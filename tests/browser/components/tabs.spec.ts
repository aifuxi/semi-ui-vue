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

test('Tabs 参考场景来自本地 v2.102.0 并保留类型、竖向、More 与折叠 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'tabs',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.tabsPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'tabs')).toBe(true);
  const scenario = page.getByTestId('tabs-reference');
  await expect(scenario.locator('.semi-tabs')).toHaveCount(7);
  await expect(scenario.locator('.semi-tabs-bar-card')).toHaveCount(4);
  await expect(scenario.locator('.semi-tabs-bar-button')).toHaveCount(1);
  await expect(scenario.locator('.semi-tabs-bar-slash')).toHaveCount(1);
  await expect(scenario.locator('.semi-tabs-left')).toHaveCount(1);
  await expect(scenario.locator('.semi-tabs-tab-disabled')).toHaveCount(1);
  await expect(scenario.locator('.semi-tabs-tab-icon-close')).toHaveCount(1);
  await expect(scenario.locator('.semi-tabs-bar-more-trigger')).toHaveCount(1);
  await expect(scenario.locator('.semi-tabs-bar-overflow-list')).toHaveCount(1);
  expect(runtimeErrors).toEqual([]);
});

test('Tabs React/Vue 点击、键盘、More、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tabs',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('tabs').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('tabs').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'tabs', target.id);
    });
  }

  const reactLineTabs = pair.react.page.locator('[data-parity-target="tabs-line"] [role="tab"]');
  const vueLineTabs = pair.vue.page.locator('[data-parity-target="tabs-line"] [role="tab"]');
  await Promise.all([reactLineTabs.nth(2).click(), vueLineTabs.nth(2).click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('Line：line3'),
    expect(pair.vue.page.getByRole('status')).toHaveText('Line：line3'),
  ]);

  await Promise.all([reactLineTabs.nth(0).focus(), vueLineTabs.nth(0).focus()]);
  await Promise.all([
    pair.react.page.keyboard.press('ArrowRight'),
    pair.vue.page.keyboard.press('ArrowRight'),
  ]);
  await Promise.all([
    expect(reactLineTabs.nth(1)).toBeFocused(),
    expect(vueLineTabs.nth(1)).toBeFocused(),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('Enter'),
    pair.vue.page.keyboard.press('Enter'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('Line：line2'),
    expect(pair.vue.page.getByRole('status')).toHaveText('Line：line2'),
  ]);

  await Promise.all([reactLineTabs.nth(0).hover(), vueLineTabs.nth(0).hover()]);
  const [reactHover, vueHover] = await Promise.all([
    captureComputedStyle(reactLineTabs.nth(0), ['borderBottomColor', 'color', 'cursor']),
    captureComputedStyle(vueLineTabs.nth(0), ['borderBottomColor', 'color', 'cursor']),
  ]);
  expect(vueHover).toEqual(reactHover);

  const reactMore = pair.react.page.locator('.semi-tabs-bar-more-trigger');
  const vueMore = pair.vue.page.locator('.semi-tabs-bar-more-trigger');
  await Promise.all([reactMore.hover(), vueMore.hover()]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-dropdown-menu')).toBeVisible(),
    expect(pair.vue.page.locator('.semi-dropdown-menu')).toBeVisible(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-dropdown-item')).toHaveCount(2),
    expect(pair.vue.page.locator('.semi-dropdown-item')).toHaveCount(2),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Tabs React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'tabs',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('tabs-reference');
      const vueTarget = pair.vue.page.getByTestId('tabs-vue');
      await expect(reactTarget).toHaveScreenshot(`tabs-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`tabs-vue-${viewportName}-${theme}.png`);
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

test('Tabs React/Vue RTL 样式、几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tabs',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('tabs').targets) {
    await expectComparableTarget(pair, 'tabs', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('tabs-reference');
  const vueTarget = pair.vue.page.getByTestId('tabs-vue');
  await expect(reactTarget).toHaveScreenshot('tabs-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('tabs-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
