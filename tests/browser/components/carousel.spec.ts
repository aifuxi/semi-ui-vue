import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../../packages/test-infra/src';
import {
  captureComputedStyle,
  expectComparableTarget,
  expectScreenshotPixelsToMatch,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('Carousel 参考场景来自本地 v2.102.0 并保留轮播 DOM 与无障碍基线', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'carousel',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.carouselPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'carousel')).toBe(true);
  const scenario = page.getByTestId('carousel-reference');
  await expect(scenario.locator('.semi-carousel')).toHaveCount(4);
  await expect(scenario.locator('.semi-carousel-content-fade')).toHaveCount(1);
  await expect(scenario.locator('.semi-carousel-indicator-columnar')).toHaveCount(1);
  await expect(scenario.locator('.semi-carousel-arrow-hover')).toHaveCount(1);
  await expect(
    scenario.locator('[data-parity-target="carousel-single"] .semi-carousel-arrow'),
  ).toHaveCount(0);
  await expect(
    scenario.locator('[data-parity-target="carousel-single"] .semi-carousel-indicator'),
  ).toHaveCount(0);
  await expect(scenario.locator('.semi-carousel-arrow-prev').first()).not.toHaveAttribute('role');
  await expect(scenario.locator('.semi-carousel-arrow-prev').first()).not.toHaveAttribute(
    'tabindex',
  );
  await expect(scenario.locator('[aria-label="Previous index"]')).toHaveCount(2);
  expect(runtimeErrors).toEqual([]);
});

test('Carousel React/Vue 默认值、切换、样式、几何和 hover 箭头一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'carousel',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('carousel').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('carousel').targets) {
    await expectComparableTarget(pair, 'carousel', target.id);
  }

  const reactNext = pair.react.page.locator(
    '[data-parity-target="carousel-basic"] .semi-carousel-arrow-next',
  );
  const vueNext = pair.vue.page.locator(
    '[data-parity-target="carousel-basic"] .semi-carousel-arrow-next',
  );
  await Promise.all([reactNext.click(), vueNext.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('当前：开发'),
    expect(pair.vue.page.getByRole('status')).toHaveText('当前：开发'),
  ]);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(
      parityPage.locator(
        '[data-parity-target="carousel-basic"] .semi-carousel-content-item-active',
      ),
    ).toContainText('开发');
    await expect(
      parityPage.locator(
        '[data-parity-target="carousel-basic"] .semi-carousel-content-item-slide-out',
      ),
    ).toContainText('设计');
    await expect(
      parityPage.locator(
        '[data-parity-target="carousel-basic"] .semi-carousel-content-item-slide-in',
      ),
    ).toContainText('开发');
  }

  const reactHover = pair.react.page.locator('[data-parity-target="carousel-columnar"]');
  const vueHover = pair.vue.page.locator('[data-parity-target="carousel-columnar"]');
  await Promise.all([reactHover.hover(), vueHover.hover()]);
  const [reactOpacity, vueOpacity] = await Promise.all([
    captureComputedStyle(reactHover.locator('.semi-carousel-arrow-prev'), ['opacity']),
    captureComputedStyle(vueHover.locator('.semi-carousel-arrow-prev'), ['opacity']),
  ]);
  expect(vueOpacity).toEqual(reactOpacity);
  expect(reactOpacity).toEqual({ opacity: '1' });
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Carousel React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'carousel',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('carousel-reference');
      const vueTarget = pair.vue.page.getByTestId('carousel-vue');
      await expect(reactTarget).toHaveScreenshot(
        `carousel-reference-${viewportName}-${theme}.png`,
        { animations: 'disabled' },
      );
      await expect(vueTarget).toHaveScreenshot(`carousel-vue-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Carousel React/Vue RTL 样式、几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'carousel',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('carousel').targets) {
    await expectComparableTarget(pair, 'carousel', target.id);
  }
  const [reactArrow, vueArrow] = await Promise.all([
    captureComputedStyle(
      pair.react.page.locator('[data-parity-target="carousel-basic"] .semi-carousel-arrow-prev'),
      ['left', 'right', 'transform'],
    ),
    captureComputedStyle(
      pair.vue.page.locator('[data-parity-target="carousel-basic"] .semi-carousel-arrow-prev'),
      ['left', 'right', 'transform'],
    ),
  ]);
  expect(vueArrow).toEqual(reactArrow);
  const reactTarget = pair.react.page.getByTestId('carousel-reference');
  const vueTarget = pair.vue.page.getByTestId('carousel-vue');
  await expect(reactTarget).toHaveScreenshot('carousel-reference-light-rtl.png', {
    animations: 'disabled',
  });
  await expect(vueTarget).toHaveScreenshot('carousel-vue-light-rtl.png', {
    animations: 'disabled',
  });
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
