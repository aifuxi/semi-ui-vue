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

test('Icon 参考场景来自本地 v2.102.0 公开源码并保留 DOM 与无障碍契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'icon',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.iconPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'icon')).toBe(true);
  await expect(page.getByTestId('icon-reference').locator('.semi-icon')).toHaveCount(12);
  await expect(page.getByRole('img', { name: '首页图标 extra-small' })).toHaveClass(
    /semi-icon-extra-small/,
  );
  await expect(page.getByRole('img', { name: '加载中' })).toHaveClass(/semi-icon-spinning/);
  await expect(page.getByRole('img', { name: 'Lab 头像' }).locator('svg')).toHaveCount(1);
  await expect(page.getByRole('img', { name: '自定义圆点' })).toHaveClass(/semi-icon-custom-dot/);
  expect(runtimeErrors).toEqual([]);
});

test('Icon 尺寸、旋转、动画、颜色、AI fill 与 Lab 契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'icon',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('icon').targets).toHaveLength(11);
  for (const target of assertScenarioComparable('icon').targets) {
    await expectComparableTarget(pair, 'icon', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="icon-size-extra-small"]')).toHaveCSS(
      'font-size',
      '8px',
    );
    await expect(parityPage.locator('[data-parity-target="icon-size-extra-large"]')).toHaveCSS(
      'font-size',
      '24px',
    );
    await expect(parityPage.locator('[data-parity-target="icon-rotate"]')).toHaveCSS(
      'transform',
      'matrix(-1, 0, 0, -1, 0, 0)',
    );
    const bicolorPaths = parityPage.locator('[data-parity-target="icon-bicolor"] path');
    await expect(bicolorPaths.nth(0)).toHaveAttribute('fill', '#0064fa');
    await expect(bicolorPaths.nth(1)).toHaveAttribute('fill', '#15c39a');
  }

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Icon React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'icon',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('icon-reference');
      const vueTarget = pair.vue.page.getByTestId('icon-vue');
      await expect(reactTarget).toHaveScreenshot(`icon-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`icon-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}
