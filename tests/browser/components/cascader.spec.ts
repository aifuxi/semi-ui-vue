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

test('Cascader 参考场景来自本地 v2.102.0 并保留触发器、级联列、选中与禁用项', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'cascader',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.cascaderPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'cascader')).toBe(true);
  await expect(page.locator('[data-parity-target="cascader-root"]')).toHaveAttribute(
    'role',
    'combobox',
  );
  await expect(page.locator('.semi-cascader-popover')).toBeVisible();
  await expect(page.locator('.semi-cascader-option-list')).toHaveCount(3);
  await expect(page.locator('.semi-cascader-option-select')).toContainText('北京');
  await page.locator('.semi-cascader-option').filter({ hasText: '北美洲' }).click();
  await expect(page.locator('.semi-cascader-option-disabled')).toContainText('加拿大');
  expect(runtimeErrors).toEqual([]);
});

test('Cascader React/Vue DOM、样式、几何、ARIA、搜索与选择行为一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'cascader',
    theme: 'light',
    direction: 'ltr',
    locale: 'en-US',
  });
  expect(assertScenarioComparable('cascader').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('cascader').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'cascader', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const trigger = page.locator('[data-parity-target="cascader-root"]');
    await expect(trigger).toHaveAttribute('role', 'combobox');
    await expect(trigger).toHaveAttribute('aria-label', 'Cascader');
    const search = trigger.locator('input');
    await search.fill('日本');
    await expect(page.locator('.semi-cascader-option-flatten')).toHaveCount(1);
    await page.locator('.semi-cascader-option-flatten').click();
    await expect(trigger).toContainText('亚洲 / 日本');
    await expect(page.locator('.semi-cascader-popover')).toHaveCount(0);
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.semi-cascader-popover')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.semi-cascader-popover')).toHaveCount(0);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Cascader React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'cascader',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('cascader').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'cascader', target.id));
      }
      const [reactTrigger, vueTrigger, reactPopup, vuePopup] = await Promise.all([
        pair.react.page.locator('[data-parity-target="cascader-root"]').screenshot({
          animations: 'disabled',
        }),
        pair.vue.page.locator('[data-parity-target="cascader-root"]').screenshot({
          animations: 'disabled',
        }),
        pair.react.page.locator('.semi-cascader-popover').screenshot({ animations: 'disabled' }),
        pair.vue.page.locator('.semi-cascader-popover').screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(
        pair.react.page,
        vueTrigger,
        reactTrigger,
        'Cascader Trigger React/Vue',
      );
      await expectScreenshotPixelsToMatch(
        pair.react.page,
        vuePopup,
        reactPopup,
        'Cascader Popup React/Vue',
      );
      expect(reactTrigger).toMatchSnapshot(
        `cascader-trigger-reference-${viewportName}-${theme}.png`,
      );
      expect(vueTrigger).toMatchSnapshot(`cascader-trigger-vue-${viewportName}-${theme}.png`);
      expect(reactPopup).toMatchSnapshot(`cascader-popup-reference-${viewportName}-${theme}.png`);
      expect(vuePopup).toMatchSnapshot(`cascader-popup-vue-${viewportName}-${theme}.png`);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Cascader React/Vue RTL 方向、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'cascader',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('cascader').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'cascader', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('[data-parity-target="cascader-root"]')).toHaveCSS(
      'direction',
      'rtl',
    );
    await expect(page.locator('.semi-cascader-popover')).toHaveCSS('direction', 'rtl');
  }
  const [reactTrigger, vueTrigger, reactPopup, vuePopup] = await Promise.all([
    pair.react.page.locator('[data-parity-target="cascader-root"]').screenshot({
      animations: 'disabled',
    }),
    pair.vue.page.locator('[data-parity-target="cascader-root"]').screenshot({
      animations: 'disabled',
    }),
    pair.react.page.locator('.semi-cascader-popover').screenshot({ animations: 'disabled' }),
    pair.vue.page.locator('.semi-cascader-popover').screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(
    pair.react.page,
    vueTrigger,
    reactTrigger,
    'Cascader RTL Trigger React/Vue',
  );
  await expectScreenshotPixelsToMatch(
    pair.react.page,
    vuePopup,
    reactPopup,
    'Cascader RTL Popup React/Vue',
  );
  expect(reactTrigger).toMatchSnapshot('cascader-trigger-reference-light-rtl.png');
  expect(vueTrigger).toMatchSnapshot('cascader-trigger-vue-light-rtl.png');
  expect(reactPopup).toMatchSnapshot('cascader-popup-reference-light-rtl.png');
  expect(vuePopup).toMatchSnapshot('cascader-popup-vue-light-rtl.png');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
