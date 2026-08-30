import { expect, type BrowserContext, type Locator, type Page } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  getParityScenario,
  VISUAL_THRESHOLDS,
  type ParityScenarioId,
  type ParityScenarioOptions,
} from '../../packages/test-infra/src';

export const PARITY_APPLICATIONS = {
  react: {
    name: 'React',
    baseUrl: 'http://127.0.0.1:4173',
    heading: 'Semi Design React 参考工作台',
  },
  vue: {
    name: 'Vue',
    baseUrl: 'http://127.0.0.1:4174',
    heading: 'Semi UI Vue 对照工作台',
  },
} as const;

export interface ParityPage {
  readonly page: Page;
  readonly runtimeErrors: string[];
}

export interface ParityPagePair {
  readonly react: ParityPage;
  readonly vue: ParityPage;
}

interface ScreenshotPixelComparison {
  readonly actualHeight: number;
  readonly actualWidth: number;
  readonly diffPixelCount: number;
  readonly diffPixelRatio: number;
  readonly expectedHeight: number;
  readonly expectedWidth: number;
  readonly maxChannelDelta: number;
}

function observeRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

export async function waitForStableRendering(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  });
}

export async function openParityPages(
  context: BrowserContext,
  options: ParityScenarioOptions,
  viewport?: { width: number; height: number },
): Promise<ParityPagePair> {
  const [reactPage, vuePage] = await Promise.all([context.newPage(), context.newPage()]);
  const reactErrors = observeRuntimeErrors(reactPage);
  const vueErrors = observeRuntimeErrors(vuePage);

  if (viewport) {
    await Promise.all([reactPage.setViewportSize(viewport), vuePage.setViewportSize(viewport)]);
  }

  await Promise.all([
    reactPage.goto(createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, options)),
    vuePage.goto(createParityScenarioUrl(PARITY_APPLICATIONS.vue.baseUrl, options)),
  ]);

  await Promise.all([
    expect(
      reactPage.getByRole('heading', { name: PARITY_APPLICATIONS.react.heading }),
    ).toBeVisible(),
    expect(vuePage.getByRole('heading', { name: PARITY_APPLICATIONS.vue.heading })).toBeVisible(),
  ]);
  await Promise.all([waitForStableRendering(reactPage), waitForStableRendering(vuePage)]);

  return {
    react: { page: reactPage, runtimeErrors: reactErrors },
    vue: { page: vuePage, runtimeErrors: vueErrors },
  };
}

export async function captureComputedStyle(
  locator: Locator,
  properties: readonly string[],
): Promise<Record<string, string>> {
  return locator.evaluate((element, requestedProperties) => {
    const style = getComputedStyle(element);
    const styleRecord = style as unknown as Record<string, string>;
    return Object.fromEntries(
      requestedProperties.map((property) => [property, styleRecord[property] ?? '']),
    );
  }, properties);
}

export async function expectScreenshotPixelsToMatch(
  page: Page,
  actual: Buffer,
  expected: Buffer,
  label = 'React/Vue 截图',
): Promise<void> {
  const comparison = await page.evaluate<
    ScreenshotPixelComparison,
    { actualUrl: string; expectedUrl: string; threshold: number }
  >(
    async ({ actualUrl, expectedUrl, threshold }) => {
      const readPixels = async (url: string) => {
        const image = new Image();
        const loaded = new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error('Screenshot PNG 解码失败'));
        });
        image.src = url;
        await loaded;

        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) throw new Error('Screenshot Canvas 不可用');
        context.drawImage(image, 0, 0);
        return {
          data: context.getImageData(0, 0, canvas.width, canvas.height).data,
          height: canvas.height,
          width: canvas.width,
        };
      };

      const [actualImage, expectedImage] = await Promise.all([
        readPixels(actualUrl),
        readPixels(expectedUrl),
      ]);
      const comparableLength = Math.min(actualImage.data.length, expectedImage.data.length);
      let diffPixelCount = 0;
      let maxChannelDelta = 0;
      for (let index = 0; index < comparableLength; index += 4) {
        let pixelDelta = 0;
        for (let channel = 0; channel < 4; channel += 1) {
          pixelDelta = Math.max(
            pixelDelta,
            Math.abs(actualImage.data[index + channel]! - expectedImage.data[index + channel]!) /
              255,
          );
        }
        maxChannelDelta = Math.max(maxChannelDelta, pixelDelta);
        if (pixelDelta > threshold) diffPixelCount += 1;
      }

      const pixelCount = Math.max(
        actualImage.width * actualImage.height,
        expectedImage.width * expectedImage.height,
      );
      if (
        actualImage.width !== expectedImage.width ||
        actualImage.height !== expectedImage.height
      ) {
        diffPixelCount = pixelCount;
      }
      return {
        actualHeight: actualImage.height,
        actualWidth: actualImage.width,
        diffPixelCount,
        diffPixelRatio: pixelCount === 0 ? 0 : diffPixelCount / pixelCount,
        expectedHeight: expectedImage.height,
        expectedWidth: expectedImage.width,
        maxChannelDelta,
      };
    },
    {
      actualUrl: `data:image/png;base64,${actual.toString('base64')}`,
      expectedUrl: `data:image/png;base64,${expected.toString('base64')}`,
      threshold: VISUAL_THRESHOLDS.screenshotThreshold,
    },
  );

  expect([comparison.actualWidth, comparison.actualHeight], `${label} 尺寸不一致`).toEqual([
    comparison.expectedWidth,
    comparison.expectedHeight,
  ]);
  expect(
    comparison.diffPixelRatio,
    `${label} 像素差异超限：diff=${comparison.diffPixelCount}，ratio=${comparison.diffPixelRatio}，maxChannelDelta=${comparison.maxChannelDelta}`,
  ).toBeLessThanOrEqual(VISUAL_THRESHOLDS.maxDiffPixelRatio);
}

export async function expectComparableTarget(
  pair: ParityPagePair,
  scenarioId: ParityScenarioId,
  targetId: string,
): Promise<void> {
  const scenario = assertScenarioComparable(scenarioId);
  const target = scenario.targets.find((candidate) => candidate.id === targetId);
  if (!target) throw new Error(`${scenarioId} 缺少目标：${targetId}`);

  const reactTarget = pair.react.page.locator(target.selector);
  const vueTarget = pair.vue.page.locator(target.selector);
  await Promise.all([expect(reactTarget).toBeVisible(), expect(vueTarget).toBeVisible()]);

  const [reactStyle, vueStyle, reactRect, vueRect] = await Promise.all([
    captureComputedStyle(reactTarget, target.computedStyleProperties),
    captureComputedStyle(vueTarget, target.computedStyleProperties),
    reactTarget.boundingBox(),
    vueTarget.boundingBox(),
  ]);
  await Promise.all([
    waitForStableRendering(pair.react.page),
    waitForStableRendering(pair.vue.page),
  ]);
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);

  expect(vueStyle).toEqual(reactStyle);
  await expectScreenshotPixelsToMatch(
    pair.react.page,
    vueScreenshot,
    reactScreenshot,
    `${scenarioId}/${targetId}`,
  );
  if (!reactRect || !vueRect) throw new Error(`${scenarioId}/${targetId} 目标不可测量`);

  for (const axis of ['x', 'y', 'width', 'height'] as const) {
    expect(Math.abs(vueRect[axis] - reactRect[axis])).toBeLessThanOrEqual(
      VISUAL_THRESHOLDS.boundingRectToleranceCssPx,
    );
  }
}

export function referenceSourceWasRequested(
  requestedUrls: readonly string[],
  scenarioId: ParityScenarioId,
): boolean {
  const source = getParityScenario(scenarioId).referenceSource;
  if (!source) return false;
  return requestedUrls.some((url) => decodeURIComponent(url).includes(source));
}
