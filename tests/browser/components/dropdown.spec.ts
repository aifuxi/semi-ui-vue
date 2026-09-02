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

test('Dropdown 参考场景来自本地 v2.102.0 并保留 Portal/Menu/Item 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'dropdown',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'dropdown')).toBe(true);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.dropdownPublicEntry,
  );
  const scenario = page.getByTestId('dropdown-reference');
  await expect(scenario.locator('.dropdown-parity-menu')).toBeVisible();
  await expect(scenario.locator('.dropdown-parity-menu .semi-dropdown-item')).toHaveCount(3);
  await expect(scenario.locator('.dropdown-parity-menu .semi-dropdown-divider')).toHaveCount(1);
  await expect(scenario.locator('.semi-dropdown-item-active .semi-icon-tick')).toHaveCount(1);
  await expect(scenario.locator('.semi-dropdown-item-disabled')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  expect(runtimeErrors).toEqual([]);
});

test('Dropdown React/Vue DOM、键盘、焦点、computed style、几何与像素阈值一致', async ({
  context,
}) => {
  const pair = await openParityPages(context, {
    scenarioId: 'dropdown',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('dropdown').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('dropdown').targets) {
    await expectComparableTarget(pair, 'dropdown', target.id);
  }

  const reactTrigger = pair.react.page.locator('[data-action="open-dropdown"]');
  const vueTrigger = pair.vue.page.locator('[data-action="open-dropdown"]');
  await Promise.all([reactTrigger.click(), vueTrigger.click()]);
  const reactItems = pair.react.page.locator('.dropdown-interactive-menu .semi-dropdown-item');
  const vueItems = pair.vue.page.locator('.dropdown-interactive-menu .semi-dropdown-item');
  await Promise.all([expect(reactItems).toHaveCount(3), expect(vueItems).toHaveCount(3)]);
  await Promise.all([
    expect(reactItems.nth(1)).toBeFocused(),
    expect(vueItems.nth(1)).toBeFocused(),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('ArrowDown'),
    pair.vue.page.keyboard.press('ArrowDown'),
  ]);
  await Promise.all([
    expect(reactItems.nth(2)).toBeFocused(),
    expect(vueItems.nth(2)).toBeFocused(),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('Enter'),
    pair.vue.page.keyboard.press('Enter'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('已选择：Beta'),
    expect(pair.vue.page.getByRole('status')).toHaveText('已选择：Beta'),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('Escape'),
    pair.vue.page.keyboard.press('Escape'),
  ]);
  await Promise.all([expect(reactTrigger).toBeFocused(), expect(vueTrigger).toBeFocused()]);
  await Promise.all([
    expect(pair.react.page.locator('.dropdown-interactive-menu')).toHaveCount(0),
    expect(pair.vue.page.locator('.dropdown-interactive-menu')).toHaveCount(0),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Dropdown React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'dropdown',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('dropdown').targets) {
        await expectComparableTarget(pair, 'dropdown', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('dropdown-reference');
      const vueTarget = pair.vue.page.getByTestId('dropdown-vue');
      await expect(reactTarget).toHaveScreenshot(`dropdown-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`dropdown-vue-${viewportName}-${theme}.png`);
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

test('Dropdown React/Vue RTL 几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'dropdown',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('dropdown').targets) {
    await expectComparableTarget(pair, 'dropdown', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('dropdown-reference');
  const vueTarget = pair.vue.page.getByTestId('dropdown-vue');
  await expect(reactTarget).toHaveScreenshot('dropdown-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('dropdown-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
