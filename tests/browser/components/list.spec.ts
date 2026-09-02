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

test('List 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'list',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.locator('.list-scenario .semi-list')).toHaveCount(3);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.listPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'list')).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('List React/Vue DOM、computed style 与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'list',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([
    expect(pair.react.page.locator('.list-scenario .semi-list')).toHaveCount(3),
    expect(pair.vue.page.locator('.list-scenario .semi-list')).toHaveCount(3),
  ]);
  for (const target of assertScenarioComparable('list').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'list', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('[data-parity-target="list-basic"] .semi-list-item')).toHaveCount(2);
    await expect(page.locator('[data-parity-target="list-grid"] .semi-col-12')).toHaveCount(2);
    await expect(
      page.locator('[data-parity-target="list-horizontal"] .semi-list-item'),
    ).toHaveCount(3);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'narrow'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`List React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'list',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all([
        expect(pair.react.page.locator('.list-scenario .semi-list')).toHaveCount(3),
        expect(pair.vue.page.locator('.list-scenario .semi-list')).toHaveCount(3),
      ]);
      for (const target of assertScenarioComparable('list').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'list', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('list-reference');
      const vueTarget = pair.vue.page.getByTestId('list-vue');
      await expect(reactTarget).toHaveScreenshot(`list-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`list-vue-${viewportName}-${theme}.png`);
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

test('List React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'list',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([
    expect(pair.react.page.locator('.list-scenario .semi-list')).toHaveCount(3),
    expect(pair.vue.page.locator('.list-scenario .semi-list')).toHaveCount(3),
  ]);
  for (const target of assertScenarioComparable('list').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'list', target.id));
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page.getByTestId('list-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('list-vue').screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
