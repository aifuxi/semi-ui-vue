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

function observeRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

export async function openParityPages(
  context: BrowserContext,
  options: ParityScenarioOptions,
): Promise<ParityPagePair> {
  const [reactPage, vuePage] = await Promise.all([context.newPage(), context.newPage()]);
  const reactErrors = observeRuntimeErrors(reactPage);
  const vueErrors = observeRuntimeErrors(vuePage);

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

  const [reactStyle, vueStyle, reactRect, vueRect, reactScreenshot, vueScreenshot] =
    await Promise.all([
      captureComputedStyle(reactTarget, target.computedStyleProperties),
      captureComputedStyle(vueTarget, target.computedStyleProperties),
      reactTarget.boundingBox(),
      vueTarget.boundingBox(),
      reactTarget.screenshot(),
      vueTarget.screenshot(),
    ]);

  expect(vueStyle).toEqual(reactStyle);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
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
