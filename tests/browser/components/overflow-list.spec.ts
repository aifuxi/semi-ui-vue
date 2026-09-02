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

test('OverflowList 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  test.setTimeout(120_000);
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'overflow-list',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(
    page.locator('[data-parity-target="overflow-list-end"] > .semi-overflow-list'),
  ).toHaveCSS('visibility', 'visible');
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.overflowListPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'overflow-list')).toBe(true);
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.vue.baseUrl, {
      scenarioId: 'overflow-list',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByRole('heading', { name: PARITY_APPLICATIONS.vue.heading })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test('OverflowList React/Vue 折叠、scroll、computed style 与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'overflow-list',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  const endRoots = [pair.react.page, pair.vue.page].map((page) =>
    page.locator('[data-parity-target="overflow-list-end"] > .semi-overflow-list'),
  );
  await Promise.all(endRoots.map((root) => expect(root).toHaveCSS('visibility', 'visible')));
  for (const target of assertScenarioComparable('overflow-list').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'overflow-list', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(
      page.locator('[data-parity-target="overflow-list-end"] .semi-overflow-list-item'),
    ).toHaveCount(2);
    await expect(
      page.locator('[data-parity-target="overflow-list-start"] .semi-overflow-list-item'),
    ).toHaveCount(2);
    await expect(
      page.locator('[data-parity-target="overflow-list-scroll"] [data-scrollkey]'),
    ).toHaveCount(5);
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page.getByTestId('overflow-list-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('overflow-list-vue').screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`OverflowList React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'overflow-list',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all(
        [pair.react.page, pair.vue.page].map((page) =>
          expect(
            page.locator('[data-parity-target="overflow-list-end"] > .semi-overflow-list'),
          ).toHaveCSS('visibility', 'visible'),
        ),
      );
      for (const target of assertScenarioComparable('overflow-list').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'overflow-list', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('overflow-list-reference');
      const vueTarget = pair.vue.page.getByTestId('overflow-list-vue');
      await expect(reactTarget).toHaveScreenshot(
        `overflow-list-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`overflow-list-vue-${viewportName}-${theme}.png`);
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

test('OverflowList React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'overflow-list',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      expect(
        page.locator('[data-parity-target="overflow-list-end"] > .semi-overflow-list'),
      ).toHaveCSS('visibility', 'visible'),
    ),
  );
  for (const target of assertScenarioComparable('overflow-list').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'overflow-list', target.id));
  }
  const reactTarget = pair.react.page.getByTestId('overflow-list-reference');
  const vueTarget = pair.vue.page.getByTestId('overflow-list-vue');
  await expect(reactTarget).toHaveScreenshot('overflow-list-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('overflow-list-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
