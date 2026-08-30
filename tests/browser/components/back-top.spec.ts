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
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('BackTop 参考场景来自本地 v2.102.0 并保留阈值、默认与自定义 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'back-top',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.backTopPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'back-top')).toBe(true);
  await expect(page.locator('[data-parity-target="back-top-default"]')).toHaveCount(0);
  const custom = page.locator('[data-parity-target="back-top-custom"]');
  await expect(custom).toBeVisible();
  await expect(custom).toHaveText('TOP');
  await expect(custom).toHaveAttribute('x-semi-prop', 'children');
  expect(runtimeErrors).toEqual([]);
});

test('BackTop React/Vue Element 阈值、回顶事件、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'back-top',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('back-top').targets).toHaveLength(2);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="back-top-default"]')).toHaveCount(0);
    await parityPage.locator('.back-top-scenario__scroll').evaluate((element) => {
      element.scrollTop = 120;
      element.dispatchEvent(new Event('scroll'));
    });
    await expect(parityPage.locator('[data-parity-target="back-top-default"]')).toBeVisible();
  }

  for (const target of assertScenarioComparable('back-top').targets) {
    await expectComparableTarget(pair, 'back-top', target.id);
  }
  const [reactPosition, vuePosition] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('[data-parity-target="back-top-default"]'), [
      'bottom',
      'position',
      'right',
    ]),
    captureComputedStyle(pair.vue.page.locator('[data-parity-target="back-top-default"]'), [
      'bottom',
      'position',
      'right',
    ]),
  ]);
  expect(vuePosition).toEqual(reactPosition);
  expect(reactPosition).toEqual({ bottom: '50px', position: 'fixed', right: '100px' });

  await Promise.all([
    pair.react.page.locator('[data-parity-target="back-top-default"]').click(),
    pair.vue.page.locator('[data-parity-target="back-top-default"]').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('点击：默认回顶'),
    expect(pair.vue.page.getByRole('status')).toHaveText('点击：默认回顶'),
  ]);
  await Promise.all([
    expect
      .poll(() =>
        pair.react.page
          .locator('.back-top-scenario__scroll')
          .evaluate((element) => element.scrollTop),
      )
      .toBe(0),
    expect
      .poll(() =>
        pair.vue.page
          .locator('.back-top-scenario__scroll')
          .evaluate((element) => element.scrollTop),
      )
      .toBe(0),
  ]);
  const [reactScrollTop, vueScrollTop] = await Promise.all([
    pair.react.page.locator('.back-top-scenario__scroll').evaluate((element) => element.scrollTop),
    pair.vue.page.locator('.back-top-scenario__scroll').evaluate((element) => element.scrollTop),
  ]);
  expect(vueScrollTop).toBe(reactScrollTop);
  expect(reactScrollTop).toBe(0);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`BackTop React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'back-top',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const parityPage of [pair.react.page, pair.vue.page]) {
        await parityPage.locator('.back-top-scenario__scroll').evaluate((element) => {
          element.scrollTop = 120;
          element.dispatchEvent(new Event('scroll'));
        });
      }
      const reactTarget = pair.react.page.locator('[data-parity-target="back-top-default"]');
      const vueTarget = pair.vue.page.locator('[data-parity-target="back-top-default"]');
      await Promise.all([expect(reactTarget).toBeVisible(), expect(vueTarget).toBeVisible()]);
      await expect(reactTarget).toHaveScreenshot(`back-top-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`back-top-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('BackTop React/Vue RTL 固定定位、样式、几何与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'back-top',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await parityPage.locator('.back-top-scenario__scroll').evaluate((element) => {
      element.scrollTop = 120;
      element.dispatchEvent(new Event('scroll'));
    });
  }
  for (const target of assertScenarioComparable('back-top').targets) {
    await expectComparableTarget(pair, 'back-top', target.id);
  }
  const reactTarget = pair.react.page.locator('[data-parity-target="back-top-default"]');
  const vueTarget = pair.vue.page.locator('[data-parity-target="back-top-default"]');
  const [reactPosition, vuePosition] = await Promise.all([
    captureComputedStyle(reactTarget, ['left', 'right']),
    captureComputedStyle(vueTarget, ['left', 'right']),
  ]);
  expect(vuePosition).toEqual(reactPosition);
  expect(reactPosition).toEqual({ left: '100px', right: '1308px' });
  await expect(reactTarget).toHaveScreenshot('back-top-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('back-top-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
