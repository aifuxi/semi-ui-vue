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

test('Transfer 参考场景来自本地 v2.102.0 并保留双面板、搜索与禁用项', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'transfer',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.transferPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'transfer')).toBe(true);
  const scenario = page.getByTestId('transfer-reference');
  await expect(scenario.locator('.semi-transfer')).toHaveCount(1);
  await expect(scenario.locator('.semi-transfer-left')).toHaveCount(1);
  await expect(scenario.locator('.semi-transfer-right')).toHaveCount(1);
  await expect(scenario.locator('.semi-transfer-filter')).toHaveCount(1);
  await expect(scenario.locator('.semi-transfer-left-list .semi-transfer-item')).toHaveCount(6);
  await expect(scenario.locator('.semi-transfer-right-item')).toHaveCount(2);
  await expect(scenario.locator('.semi-transfer-item-disabled')).toHaveCount(1);
  expect(runtimeErrors).toEqual([]);
});

test('Transfer React/Vue DOM、样式、几何、键盘与选择行为一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'transfer',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('transfer').targets).toHaveLength(7);
  for (const target of assertScenarioComparable('transfer').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'transfer', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const root = page.locator('[data-parity-target="transfer-root"]');
    await expect(root.locator('.semi-transfer-filter')).toBeVisible();
    await expect(root.locator('.semi-transfer-left-list .semi-transfer-item')).toHaveCount(6);
    await expect(root.locator('.semi-transfer-right-item')).toHaveCount(2);
    const engineering = root.locator('.semi-transfer-left-list .semi-checkbox input').nth(1);
    await engineering.focus();
    await page.keyboard.press('Space');
    await expect(root.locator('.semi-transfer-right-item')).toHaveCount(3);
    await expect(root.locator('.semi-transfer-right-header')).toContainText('已选个数：3');
    await root.locator('.semi-transfer-right-item').first().hover();
    await root.locator('.semi-transfer-item-close-icon').first().click();
    await expect(root.locator('.semi-transfer-right-item')).toHaveCount(2);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Transfer React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'transfer',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('transfer').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'transfer', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('transfer-reference');
      const vueTarget = pair.vue.page.getByTestId('transfer-vue');
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(reactScreenshot).toMatchSnapshot(`transfer-reference-${viewportName}-${theme}.png`);
      expect(vueScreenshot).toMatchSnapshot(`transfer-vue-${viewportName}-${theme}.png`);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Transfer React/Vue RTL 边框、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'transfer',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('transfer').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'transfer', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const root = page.locator('[data-parity-target="transfer-root"]');
    await expect(root).toHaveCSS('direction', 'rtl');
    await expect(root.locator('.semi-transfer-left')).toHaveCSS('border-right-width', '0px');
    await expect(root.locator('.semi-transfer-left')).toHaveCSS('border-left-width', '1px');
  }
  const reactTarget = pair.react.page.getByTestId('transfer-reference');
  const vueTarget = pair.vue.page.getByTestId('transfer-vue');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(reactScreenshot).toMatchSnapshot('transfer-reference-light-rtl.png');
  expect(vueScreenshot).toMatchSnapshot('transfer-vue-light-rtl.png');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
