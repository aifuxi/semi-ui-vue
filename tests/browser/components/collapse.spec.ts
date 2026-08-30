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

test('Collapse 参考场景来自本地 v2.102.0 并保留复合组件与 ARIA 基线', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'collapse',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.collapsePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'collapse')).toBe(true);
  const scenario = page.getByTestId('collapse-reference');
  await expect(scenario.locator('.semi-collapse')).toHaveCount(4);
  await expect(scenario.locator('.semi-collapse-header')).toHaveCount(10);
  await expect(scenario.locator('.semi-collapse-header[aria-expanded="true"]')).toHaveCount(4);
  await expect(scenario.locator('.semi-collapse-header-disabled')).toHaveCount(1);
  await expect(scenario.locator('.semi-collapse-header-iconLeft')).toHaveCount(2);
  await expect(scenario.locator('[data-lazy-content]')).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
});

test('Collapse React/Vue 多开、手风琴、受控、图标热区、懒渲染与 ARIA 一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'collapse',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('collapse').targets).toHaveLength(7);
  for (const target of assertScenarioComparable('collapse').targets) {
    await expectComparableTarget(pair, 'collapse', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const basic = parityPage.locator('[data-parity-target="collapse-basic"]');
    const basicHeaders = basic.locator('.semi-collapse-header');
    await basicHeaders.nth(1).click();
    await expect(basicHeaders.nth(1)).toHaveAttribute('aria-expanded', 'true');
    await expect(basic.locator('[data-lazy-content]')).toHaveCount(1);
    const ownerId = await basicHeaders.nth(1).getAttribute('aria-owns');
    expect(ownerId).toBeTruthy();
    await expect(basic.locator(`[id="${ownerId}"]`)).toHaveAttribute('aria-hidden', 'false');
    await basicHeaders.nth(1).click();
    await expect(basicHeaders.nth(1)).toHaveAttribute('aria-expanded', 'false');
    await expect(basic.locator('[data-lazy-content]')).toHaveCount(1);

    const accordionHeaders = parityPage
      .locator('[data-parity-target="collapse-accordion"]')
      .locator('.semi-collapse-header');
    await accordionHeaders.nth(1).click();
    await expect(accordionHeaders.nth(0)).toHaveAttribute('aria-expanded', 'false');
    await expect(accordionHeaders.nth(1)).toHaveAttribute('aria-expanded', 'true');
    await accordionHeaders.nth(2).click({ force: true });
    await expect(accordionHeaders.nth(2)).toHaveAttribute('aria-expanded', 'false');
    await accordionHeaders.nth(1).focus();
    await parityPage.keyboard.press('Enter');
    await expect(accordionHeaders.nth(1)).toHaveAttribute('aria-expanded', 'true');

    const leftHeader = parityPage
      .locator('[data-parity-target="collapse-left"]')
      .locator('.semi-collapse-header')
      .first();
    await leftHeader.locator(':scope > span').nth(1).click();
    await expect(leftHeader).toHaveAttribute('aria-expanded', 'true');
    await leftHeader.locator('.semi-collapse-header-icon').click();
    await expect(leftHeader).toHaveAttribute('aria-expanded', 'false');

    const controlledHeaders = parityPage
      .locator('[data-parity-target="collapse-controlled"]')
      .locator('.semi-collapse-header');
    await controlledHeaders.nth(1).click();
    await expect(controlledHeaders.nth(0)).toHaveAttribute('aria-expanded', 'true');
    await expect(controlledHeaders.nth(1)).toHaveAttribute('aria-expanded', 'true');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Collapse React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'collapse',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('collapse').targets) {
        await expectComparableTarget(pair, 'collapse', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('collapse-reference');
      const vueTarget = pair.vue.page.getByTestId('collapse-vue');
      await expect(reactTarget).toHaveScreenshot(
        `collapse-reference-${viewportName}-${theme}.png`,
        { animations: 'disabled' },
      );
      await expect(vueTarget).toHaveScreenshot(`collapse-vue-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
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

test('Collapse React/Vue RTL 几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'collapse',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('collapse').targets) {
    await expectComparableTarget(pair, 'collapse', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('collapse-reference');
  const vueTarget = pair.vue.page.getByTestId('collapse-vue');
  await expect(reactTarget).toHaveScreenshot('collapse-reference-light-rtl.png', {
    animations: 'disabled',
  });
  await expect(vueTarget).toHaveScreenshot('collapse-vue-light-rtl.png', {
    animations: 'disabled',
  });
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
