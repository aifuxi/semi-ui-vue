import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../../packages/test-infra/src';
import {
  expectComparableTarget,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('TreeSelect 参考场景来自本地 v2.102.0 并保留触发器、搜索、树与禁用项', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'tree-select',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.treeSelectPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'tree-select')).toBe(true);
  await expect(page.locator('[data-parity-target="tree-select-root"]')).toHaveAttribute(
    'role',
    'combobox',
  );
  await expect(page.locator('.semi-tree-select-popover')).toBeVisible();
  await expect(page.locator('.semi-tree-search-wrapper input')).toHaveAttribute(
    'aria-label',
    'Filter TreeSelect item',
  );
  await expect(page.locator('.semi-tree-option')).toHaveCount(7);
  await expect(page.locator('.semi-tree-option-selected')).toContainText('中国');
  await expect(page.locator('.semi-tree-option-disabled')).toContainText('加拿大');
  expect(runtimeErrors).toEqual([]);
});

test('TreeSelect React/Vue DOM、样式、几何、ARIA、搜索与选择行为一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tree-select',
    theme: 'light',
    direction: 'ltr',
    locale: 'en-US',
  });
  expect(assertScenarioComparable('tree-select').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('tree-select').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'tree-select', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const trigger = page.locator('[data-parity-target="tree-select-root"]');
    await expect(trigger).toHaveAttribute('role', 'combobox');
    await expect(trigger).toHaveAttribute('aria-label', 'TreeSelect');
    await expect(page.locator('.semi-tree-search-wrapper input')).toHaveAttribute(
      'placeholder',
      'Search',
    );
    const search = page.locator('.semi-tree-search-wrapper input');
    await search.fill('Japan');
    await expect(page.locator('.semi-tree-option')).toHaveCount(2);
    await search.fill('');
    await page.locator('.semi-tree-option[data-key="japan"]').click();
    await expect(trigger).toContainText('日本');
    await expect(page.locator('.semi-tree-select-popover')).toHaveCount(0);
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.semi-tree-select-popover')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.semi-tree-select-popover')).toHaveCount(0);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`TreeSelect React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'tree-select',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('tree-select').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'tree-select', target.id));
      }
      const [reactTrigger, vueTrigger, reactPopup, vuePopup] = await Promise.all([
        pair.react.page.locator('[data-parity-target="tree-select-root"]').screenshot({
          animations: 'disabled',
        }),
        pair.vue.page.locator('[data-parity-target="tree-select-root"]').screenshot({
          animations: 'disabled',
        }),
        pair.react.page.locator('.semi-tree-select-popover').screenshot({ animations: 'disabled' }),
        pair.vue.page.locator('.semi-tree-select-popover').screenshot({ animations: 'disabled' }),
      ]);
      expect(vueTrigger.equals(reactTrigger)).toBe(true);
      expect(vuePopup.equals(reactPopup)).toBe(true);
      expect(reactTrigger).toMatchSnapshot(
        `tree-select-trigger-reference-${viewportName}-${theme}.png`,
      );
      expect(vueTrigger).toMatchSnapshot(`tree-select-trigger-vue-${viewportName}-${theme}.png`);
      expect(reactPopup).toMatchSnapshot(
        `tree-select-popup-reference-${viewportName}-${theme}.png`,
      );
      expect(vuePopup).toMatchSnapshot(`tree-select-popup-vue-${viewportName}-${theme}.png`);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('TreeSelect React/Vue RTL 方向、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tree-select',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('tree-select').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'tree-select', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('[data-parity-target="tree-select-root"]')).toHaveCSS(
      'direction',
      'rtl',
    );
    await expect(page.locator('.semi-tree-select-popover')).toHaveCSS('direction', 'rtl');
  }
  const [reactTrigger, vueTrigger, reactPopup, vuePopup] = await Promise.all([
    pair.react.page.locator('[data-parity-target="tree-select-root"]').screenshot({
      animations: 'disabled',
    }),
    pair.vue.page.locator('[data-parity-target="tree-select-root"]').screenshot({
      animations: 'disabled',
    }),
    pair.react.page.locator('.semi-tree-select-popover').screenshot({ animations: 'disabled' }),
    pair.vue.page.locator('.semi-tree-select-popover').screenshot({ animations: 'disabled' }),
  ]);
  expect(vueTrigger.equals(reactTrigger)).toBe(true);
  expect(vuePopup.equals(reactPopup)).toBe(true);
  expect(reactTrigger).toMatchSnapshot('tree-select-trigger-reference-light-rtl.png');
  expect(vueTrigger).toMatchSnapshot('tree-select-trigger-vue-light-rtl.png');
  expect(reactPopup).toMatchSnapshot('tree-select-popup-reference-light-rtl.png');
  expect(vuePopup).toMatchSnapshot('tree-select-popup-vue-light-rtl.png');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
