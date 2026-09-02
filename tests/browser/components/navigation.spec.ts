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

test('Navigation 参考场景来自本地 v2.102.0 并保留公开结构', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'navigation',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.navigationPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'navigation')).toBe(true);
  const scenario = page.getByTestId('navigation-reference');
  await expect(scenario.locator('.semi-navigation')).toHaveCount(1);
  await expect(scenario.locator('.semi-navigation-sub-open')).toHaveCount(1);
  await expect(scenario.locator('.semi-navigation-item-selected')).toContainText('项目');
  await expect(scenario.locator('.semi-navigation-item-disabled')).toContainText('设置');
  await expect(scenario.locator('.semi-navigation-collapse-btn')).toHaveCount(1);
  expect(runtimeErrors).toEqual([]);
});

test('Navigation React/Vue DOM、样式、几何与 ARIA 一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'navigation',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('navigation').targets).toHaveLength(5);
  for (const target of assertScenarioComparable('navigation').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'navigation', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(
      page.locator('[data-parity-target="navigation-root"] ul[role="menu"]'),
    ).toHaveAttribute('aria-orientation', 'vertical');
    await expect(page.locator('.semi-navigation-sub-title')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Navigation React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'navigation',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('navigation').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'navigation', target.id));
      }
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        pair.react.page.getByTestId('navigation-reference').screenshot({ animations: 'disabled' }),
        pair.vue.page.getByTestId('navigation-vue').screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
      expect(reactScreenshot).toMatchSnapshot(`navigation-reference-${viewportName}-${theme}.png`);
      expect(vueScreenshot).toMatchSnapshot(`navigation-vue-${viewportName}-${theme}.png`);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Navigation React/Vue RTL 方向、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'navigation',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('navigation').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'navigation', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('[data-parity-target="navigation-root"]')).toHaveCSS(
      'direction',
      'rtl',
    );
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page.getByTestId('navigation-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('navigation-vue').screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(reactScreenshot).toMatchSnapshot('navigation-reference-light-rtl.png');
  expect(vueScreenshot).toMatchSnapshot('navigation-vue-light-rtl.png');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
