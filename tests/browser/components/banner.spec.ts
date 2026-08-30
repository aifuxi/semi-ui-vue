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

test('Banner 参考场景来自本地 v2.102.0 并保留类型、容器与关闭契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'banner',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.bannerPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'banner')).toBe(true);
  await expect(page.getByRole('alert')).toHaveCount(5);
  await expect(page.locator('.semi-banner-info')).toHaveCount(1);
  await expect(page.locator('.semi-banner-warning')).toHaveCount(2);
  await expect(page.locator('.semi-banner-danger')).toHaveCount(1);
  await expect(page.locator('.semi-banner-success')).toHaveCount(1);
  await expect(page.locator('[data-parity-target="banner-container"]')).toHaveClass(
    /semi-banner-bordered/,
  );
  await expect(
    page.locator('[data-parity-target="banner-container"] .semi-banner-icon'),
  ).toHaveCount(0);
  await expect(
    page.locator('[data-parity-target="banner-container"] .semi-banner-close'),
  ).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
});

test('Banner React/Vue computed style、几何、ARIA 与键盘关闭一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'banner',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('banner').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'banner', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const info = page.locator('[data-parity-target="banner-info"]');
    await expect(info).toHaveAttribute('role', 'alert');
    await expect(info.locator('.semi-banner-icon [aria-label="info"]')).toBeVisible();
    const close = info.getByRole('button', { name: 'Close' });
    await close.focus();
    await expect(close).toBeFocused();
    await close.press('Space');
    await expect(info).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveText('最近操作：关闭 info');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Banner React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'banner',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('banner').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'banner', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('banner-reference');
      const vueTarget = pair.vue.page.getByTestId('banner-vue');
      await expect(reactTarget).toHaveScreenshot(`banner-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`banner-vue-${viewportName}-${theme}.png`);
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

test('Banner React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'banner',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('banner').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'banner', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('[data-parity-target="banner-info"]')).toHaveCSS('direction', 'rtl');
  }
  const reactTarget = pair.react.page.getByTestId('banner-reference');
  const vueTarget = pair.vue.page.getByTestId('banner-vue');
  await expect(reactTarget).toHaveScreenshot('banner-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('banner-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
