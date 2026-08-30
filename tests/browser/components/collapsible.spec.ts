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
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('Collapsible 参考场景来自本地 v2.102.0 并保留测量与无交互容器基线', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'collapsible',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.collapsiblePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'collapsible')).toBe(true);
  const scenario = page.getByTestId('collapsible-reference');
  await expect(scenario.locator('.semi-collapsible-wrapper')).toHaveCount(4);
  await expect(scenario.locator('[data-parity-target="collapsible-basic"]')).toHaveCSS(
    'height',
    '116px',
  );
  await expect(scenario.locator('[data-parity-target="collapsible-preview"]')).toHaveCSS(
    'height',
    '72px',
  );
  await expect(scenario.locator('[data-lazy-content]')).toHaveCount(0);
  await expect(scenario.locator('#collapsible-basic-content')).toHaveAttribute(
    'x-semi-prop',
    'children',
  );
  await expect(scenario.locator('[data-parity-target="collapsible-basic"]')).not.toHaveAttribute(
    'role',
  );
  expect(runtimeErrors).toEqual([]);
});

test('Collapsible React/Vue 开合、动效终态、懒渲染与动态重测一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'collapsible',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('collapsible').targets).toHaveLength(4);
  for (const target of assertScenarioComparable('collapsible').targets) {
    await expectComparableTarget(pair, 'collapsible', target.id);
  }

  const reactBasic = pair.react.page.locator('[data-parity-target="collapsible-basic"]');
  const vueBasic = pair.vue.page.locator('[data-parity-target="collapsible-basic"]');
  await Promise.all([
    pair.react.page.locator('[data-action="toggle-basic"]').click(),
    pair.vue.page.locator('[data-action="toggle-basic"]').click(),
  ]);
  await Promise.all([
    expect(reactBasic).toHaveClass(/semi-collapsible-transition/),
    expect(vueBasic).toHaveClass(/semi-collapsible-transition/),
  ]);
  const [reactMotion, vueMotion] = await Promise.all([
    captureComputedStyle(reactBasic, ['transitionDuration']),
    captureComputedStyle(vueBasic, ['transitionDuration']),
  ]);
  expect(vueMotion).toEqual(reactMotion);
  expect(reactMotion.transitionDuration).toBe('0.25s');
  await Promise.all([
    expect(reactBasic).not.toHaveClass(/semi-collapsible-transition/),
    expect(vueBasic).not.toHaveClass(/semi-collapsible-transition/),
  ]);
  await Promise.all([
    expect(reactBasic).toHaveCSS('opacity', '0'),
    expect(vueBasic).toHaveCSS('opacity', '0'),
    expect(pair.react.page.getByRole('status')).toHaveText('基础面板：动效结束'),
    expect(pair.vue.page.getByRole('status')).toHaveText('基础面板：动效结束'),
  ]);
  const [reactClosedStyle, vueClosedStyle, reactClosedRect, vueClosedRect] = await Promise.all([
    captureComputedStyle(reactBasic, ['display', 'height', 'opacity', 'overflow']),
    captureComputedStyle(vueBasic, ['display', 'height', 'opacity', 'overflow']),
    reactBasic.boundingBox(),
    vueBasic.boundingBox(),
  ]);
  expect(vueClosedStyle).toEqual(reactClosedStyle);
  expect(reactClosedStyle).toEqual({
    display: 'block',
    height: '0px',
    opacity: '0',
    overflow: 'hidden',
  });
  expect(vueClosedRect).toEqual(reactClosedRect);

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const lazy = parityPage.locator('[data-parity-target="collapsible-lazy"]');
    await parityPage.locator('[data-action="toggle-lazy"]').click();
    await expect(lazy.locator('[data-lazy-content]')).toHaveCount(1);
    await parityPage.locator('[data-action="toggle-lazy"]').click();
    await expect(lazy.locator('[data-lazy-content]')).toHaveCount(1);
    await parityPage.locator('[data-action="add-row"]').click();
  }
  await expectComparableTarget(pair, 'collapsible', 'collapsible-adaptive');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Collapsible React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'collapsible',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('collapsible').targets) {
        await expectComparableTarget(pair, 'collapsible', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('collapsible-reference');
      const vueTarget = pair.vue.page.getByTestId('collapsible-vue');
      await expect(reactTarget).toHaveScreenshot(
        `collapsible-reference-${viewportName}-${theme}.png`,
        { animations: 'disabled' },
      );
      await expect(vueTarget).toHaveScreenshot(`collapsible-vue-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Collapsible React/Vue RTL 几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'collapsible',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('collapsible').targets) {
    await expectComparableTarget(pair, 'collapsible', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('collapsible-reference');
  const vueTarget = pair.vue.page.getByTestId('collapsible-vue');
  await expect(reactTarget).toHaveScreenshot('collapsible-reference-light-rtl.png', {
    animations: 'disabled',
  });
  await expect(vueTarget).toHaveScreenshot('collapsible-vue-light-rtl.png', {
    animations: 'disabled',
  });
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
