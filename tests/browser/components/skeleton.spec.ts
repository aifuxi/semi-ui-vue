import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../../packages/test-infra/src';
import {
  expectComparableTarget,
  expectScreenshotPixelsToMatch,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('Skeleton 参考场景来自本地 v2.102.0 并保留 loading 三态与全部占位项', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'skeleton',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.skeletonPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'skeleton')).toBe(true);
  const scenario = page.getByTestId('skeleton-reference');
  await expect(scenario.locator('.semi-skeleton')).toHaveCount(2);
  await expect(scenario.locator('.semi-skeleton-active')).toHaveCount(1);
  await expect(scenario.locator('.semi-skeleton-avatar')).toHaveCount(3);
  await expect(scenario.locator('.semi-skeleton-paragraph')).toHaveCount(2);
  await expect(scenario.locator('.semi-skeleton-button')).toHaveCount(1);
  await expect(scenario.locator('.semi-skeleton-image')).toHaveCount(1);
  await expect(scenario.getByText('Content ready')).toBeVisible();
  await expect(scenario.getByText('Profile loaded')).toHaveCount(0);
  await expect(scenario.getByText('Image loaded')).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
});

test('Skeleton React/Vue DOM、样式、几何、动画与 loading 默认值一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'skeleton',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('skeleton').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('skeleton').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'skeleton', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const scenario = page.locator('.skeleton-scenario');
    await expect(scenario.locator('.semi-skeleton')).toHaveCount(2);
    await expect(scenario.locator('[data-parity-target="skeleton-root"]')).toHaveAttribute(
      'x-semi-prop',
      'placeholder',
    );
    await expect(scenario.locator('[data-parity-target="skeleton-avatar-default"]')).toHaveCSS(
      'animation-name',
      'skeleton-loading',
    );
    await expect(scenario.locator('[data-parity-target="skeleton-avatar-default"]')).toHaveCSS(
      'animation-duration',
      '1.4s',
    );
    await expect(scenario.locator('[data-parity-target="skeleton-paragraph"] li')).toHaveCount(4);
    await expect(scenario.getByText('Content ready')).toBeVisible();
    await expect(scenario.getByText('Profile loaded')).toHaveCount(0);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Skeleton React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'skeleton',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('skeleton').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'skeleton', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('skeleton-reference');
      const vueTarget = pair.vue.page.getByTestId('skeleton-vue');
      await expect(reactTarget).toHaveScreenshot(`skeleton-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`skeleton-vue-${viewportName}-${theme}.png`);
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

test('Skeleton React/Vue RTL 方向、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'skeleton',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('skeleton').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'skeleton', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('[data-parity-target="skeleton-root"]')).toHaveCSS(
      'direction',
      'rtl',
    );
  }
  const reactTarget = pair.react.page.getByTestId('skeleton-reference');
  const vueTarget = pair.vue.page.getByTestId('skeleton-vue');
  await expect(reactTarget).toHaveScreenshot('skeleton-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('skeleton-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
