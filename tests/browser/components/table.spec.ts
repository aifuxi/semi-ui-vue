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

test('Table 参考场景来自本地 v2.102.0 并保留表格、选择与滚动契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'table',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.tablePublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'table')).toBe(true);
  const table = page.locator('[data-parity-target="table-basic"]');
  await expect(table.locator('thead th')).toHaveCount(4);
  await expect(table.locator('tbody tr')).toHaveCount(3);
  await expect(table.locator('.semi-table-row-selected')).toContainText('API Gateway');
  await expect(table.locator('input[type="checkbox"]')).toHaveCount(4);
  expect(runtimeErrors).toEqual([]);
});

test('Table React/Vue computed style、几何与公开 DOM 一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'table',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('table').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'table', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const table = page.locator('[data-parity-target="table-basic"]');
    await expect(table.locator('thead th')).toHaveCount(4);
    await expect(table.locator('tbody tr')).toHaveCount(3);
    await expect(table.locator('.semi-table-row-selected')).toHaveCount(1);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Table React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'table',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('table').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'table', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('table-reference');
      const vueTarget = pair.vue.page.getByTestId('table-vue');
      await expect(reactTarget).toHaveScreenshot(`table-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`table-vue-${viewportName}-${theme}.png`);
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

test('Table React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'table',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('table').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'table', target.id));
  }
  const reactTarget = pair.react.page.getByTestId('table-reference');
  const vueTarget = pair.vue.page.getByTestId('table-vue');
  await expect(reactTarget).toHaveScreenshot('table-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('table-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
