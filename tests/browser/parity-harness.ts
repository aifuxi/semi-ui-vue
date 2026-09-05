import { expect, type BrowserContext, type Locator, type Page } from '@playwright/test';
import { requestedBuildSources } from '../../scripts/parity-build-provenance.mjs';
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

export interface ComparableGeometry {
  readonly coordinateSpace: 'document' | 'viewport';
  readonly height: number;
  readonly pageScrollX: number;
  readonly pageScrollY: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
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
  await Promise.all([
    expect(reactPage.locator('[data-parity-scenario-loading]')).toHaveCount(0),
    expect(vuePage.locator('[data-parity-scenario-loading]')).toHaveCount(0),
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

export async function waitForTargetStable(locator: Locator): Promise<void> {
  await locator.evaluate(async (element) => {
    // Portal ancestors can move this target even when the target itself has no animation.
    const relevantAnimations = new Set(element.getAnimations({ subtree: true }));
    for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
      for (const animation of ancestor.getAnimations()) relevantAnimations.add(animation);
    }
    const finiteAnimations = [...relevantAnimations].filter((animation) => {
      const endTime = animation.effect?.getComputedTiming().endTime;
      return (
        typeof endTime === 'number' &&
        Number.isFinite(endTime) &&
        animation.playState !== 'paused' &&
        animation.playbackRate !== 0
      );
    });
    await Promise.all(
      finiteAnimations.map((animation) => animation.finished.catch(() => undefined)),
    );

    const infiniteAnimations = [...relevantAnimations].filter((animation) => {
      const endTime = animation.effect?.getComputedTiming().endTime;
      return typeof endTime === 'number' && !Number.isFinite(endTime);
    });
    await Promise.all(
      infiniteAnimations.map((animation) => animation.ready.catch(() => undefined)),
    );
    for (const animation of infiniteAnimations) {
      animation.pause();
      try {
        animation.currentTime = 0;
      } catch {
        // 部分浏览器动画时间轴不允许写入；pause 仍可阻止后续几何漂移。
      }
    }
  });
}

export async function captureComparableGeometry(locator: Locator): Promise<ComparableGeometry> {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const position = getComputedStyle(element).position;
    const viewportAnchored = position === 'fixed' || position === 'sticky';
    return {
      coordinateSpace: viewportAnchored ? 'viewport' : 'document',
      height: rect.height,
      pageScrollX: window.scrollX,
      pageScrollY: window.scrollY,
      width: rect.width,
      x: rect.x + (viewportAnchored ? 0 : window.scrollX),
      y: rect.y + (viewportAnchored ? 0 : window.scrollY),
    };
  });
}

export function expectComparableGeometry(
  actual: ComparableGeometry,
  expected: ComparableGeometry,
  label = 'React/Vue 几何',
): void {
  expect(actual.coordinateSpace, `${label} 坐标空间不一致`).toBe(expected.coordinateSpace);
  for (const axis of ['x', 'y', 'width', 'height'] as const) {
    expect(
      Math.abs(actual[axis] - expected[axis]),
      `${label} ${axis} 差异超限；React scroll=(${expected.pageScrollX}, ${expected.pageScrollY})，Vue scroll=(${actual.pageScrollX}, ${actual.pageScrollY})`,
    ).toBeLessThanOrEqual(VISUAL_THRESHOLDS.boundingRectToleranceCssPx);
  }
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

  await Promise.all([waitForTargetStable(reactTarget), waitForTargetStable(vueTarget)]);
  await Promise.all([
    waitForStableRendering(pair.react.page),
    waitForStableRendering(pair.vue.page),
  ]);

  const [reactStyle, vueStyle, reactGeometry, vueGeometry] = await Promise.all([
    captureComputedStyle(reactTarget, target.computedStyleProperties),
    captureComputedStyle(vueTarget, target.computedStyleProperties),
    captureComparableGeometry(reactTarget),
    captureComparableGeometry(vueTarget),
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
  expectComparableGeometry(vueGeometry, reactGeometry, `${scenarioId}/${targetId}`);
}

const buildManifests = new Map<string, Promise<unknown>>();

export async function requestedSourcePaths(
  requestedUrls: readonly string[],
  baseUrl: string,
): Promise<string[]> {
  if (process.env.PARITY_SERVER_MODE !== 'build') {
    return requestedUrls
      .filter((url) => new URL(url).origin === new URL(baseUrl).origin)
      .map((url) => decodeURIComponent(new URL(url).pathname));
  }
  let manifest = buildManifests.get(baseUrl);
  if (!manifest) {
    manifest = fetch(new URL('/parity-provenance.json', baseUrl), {
      signal: AbortSignal.timeout(5000),
    }).then(async (response) => {
      if (!response.ok) throw new Error(`Missing parity provenance: ${response.status}`);
      return response.json();
    });
    buildManifests.set(baseUrl, manifest);
  }
  return requestedBuildSources(requestedUrls, baseUrl, await manifest);
}

export async function referenceSourceWasRequested(
  requestedUrls: readonly string[],
  scenarioId: ParityScenarioId,
): Promise<boolean> {
  const source = getParityScenario(scenarioId).referenceSource;
  if (!source) return false;
  return (await requestedSourcePaths(requestedUrls, PARITY_APPLICATIONS.react.baseUrl)).some(
    (path) => path.includes(source),
  );
}
