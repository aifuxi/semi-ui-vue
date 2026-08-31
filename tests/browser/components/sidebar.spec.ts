import { expect, test, type Page } from '@playwright/test';
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
  waitForStableRendering,
} from '../parity-harness';

async function expectSidebarReady(page: Page): Promise<void> {
  await expect(page.locator('.sidebar-scenario .semi-sidebar-container')).toHaveCount(1);
  await expect(page.locator('.sidebar-scenario .semi-sidebar-options-button')).toHaveCount(2);
  await expect(page.locator('.sidebar-scenario .semi-sidebar-code-content')).toContainText('ready');
  await waitForStableRendering(page);
}

test('Sidebar 参考场景来自本地 v2.102.0 且无运行时错误', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'sidebar',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expectSidebarReady(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.sidebarPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'sidebar')).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('Sidebar React/Vue 基础 DOM、样式、几何与受控选项一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'sidebar',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([expectSidebarReady(pair.react.page), expectSidebarReady(pair.vue.page)]);
  expect(assertScenarioComparable('sidebar').targets).toHaveLength(4);
  for (const target of assertScenarioComparable('sidebar').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'sidebar', target.id));
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const buttons = parityPage.locator('.sidebar-scenario .semi-sidebar-options-button');
    await buttons.nth(1).click();
    await expect(buttons.nth(1)).not.toHaveClass(/semi-sidebar-options-normal/);
    await expect(buttons.nth(0)).toHaveClass(/semi-sidebar-options-normal/);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Sidebar React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        { scenarioId: 'sidebar', theme, direction: 'ltr', locale: 'zh-CN' },
        PARITY_VIEWPORTS[viewportName],
      );
      await Promise.all([expectSidebarReady(pair.react.page), expectSidebarReady(pair.vue.page)]);
      const reactTarget = pair.react.page.getByTestId('sidebar-reference');
      const vueTarget = pair.vue.page.getByTestId('sidebar-vue');
      await expect(reactTarget).toHaveScreenshot(`sidebar-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`sidebar-vue-${viewportName}-${theme}.png`);
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

test('Sidebar en-US Locale 与 RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'sidebar',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([expectSidebarReady(pair.react.page), expectSidebarReady(pair.vue.page)]);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('.sidebar-scenario .semi-sidebar-container')).toHaveCSS(
      'direction',
      'rtl',
    );
    await expect(parityPage.locator('.sidebar-scenario')).toContainText('Developer resources');
  }
  const reactTarget = pair.react.page.getByTestId('sidebar-reference');
  const vueTarget = pair.vue.page.getByTestId('sidebar-vue');
  await expect(reactTarget).toHaveScreenshot('sidebar-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('sidebar-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
