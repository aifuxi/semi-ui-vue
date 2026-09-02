import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
  VISUAL_THRESHOLDS,
} from '../../../packages/test-infra/src';
import {
  captureComputedStyle,
  expectComparableTarget,
  expectScreenshotPixelsToMatch,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('Breadcrumb 参考场景来自本地 v2.102.0 并保留图标、链接、折叠与 active DOM', async ({
  page,
}) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'breadcrumb',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.breadcrumbPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'breadcrumb')).toBe(true);
  const scenario = page.getByTestId('breadcrumb-reference');
  await expect(scenario.locator('.semi-breadcrumb-wrapper')).toHaveCount(3);
  await expect(scenario.locator('.semi-icon-home')).toHaveCount(1);
  await expect(scenario.locator('.semi-breadcrumb-collapse')).toHaveCount(1);
  await expect(scenario.locator('[data-parity-target="breadcrumb-basic"] a')).toHaveAttribute(
    'href',
    '#components',
  );
  await expect(
    scenario.locator('[data-parity-target="breadcrumb-loose"] [aria-current="page"]'),
  ).toContainText('当前页面');
  expect(runtimeErrors).toEqual([]);
});

test('Breadcrumb React/Vue 事件、Enter 展开、Popover、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'breadcrumb',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('breadcrumb').targets).toHaveLength(4);
  for (const target of assertScenarioComparable('breadcrumb').targets) {
    await expectComparableTarget(pair, 'breadcrumb', target.id);
  }

  const reactFirst = pair.react.page
    .locator('[data-parity-target="breadcrumb-basic"] .semi-breadcrumb-item')
    .first();
  const vueFirst = pair.vue.page
    .locator('[data-parity-target="breadcrumb-basic"] .semi-breadcrumb-item')
    .first();
  await Promise.all([reactFirst.click(), vueFirst.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('父级：首页'),
    expect(pair.vue.page.getByRole('status')).toHaveText('父级：首页'),
  ]);

  const reactMore = pair.react.page.locator('.semi-breadcrumb-item-more');
  const vueMore = pair.vue.page.locator('.semi-breadcrumb-item-more');
  await Promise.all([reactMore.hover(), vueMore.hover()]);
  const reactPopover = pair.react.page.locator('.semi-popover-wrapper');
  const vuePopover = pair.vue.page.locator('.semi-popover-wrapper');
  await Promise.all([expect(reactPopover).toBeVisible(), expect(vuePopover).toBeVisible()]);
  await Promise.all([
    expect(reactPopover).toContainText('设计系统'),
    expect(vuePopover).toContainText('设计系统'),
  ]);
  await expect(reactPopover).toHaveScreenshot('breadcrumb-popover-reference-light.png');
  await expect(vuePopover).toHaveScreenshot('breadcrumb-popover-vue-light.png');
  const [reactPopoverScreenshot, vuePopoverScreenshot] = await Promise.all([
    reactPopover.screenshot({ animations: 'disabled' }),
    vuePopover.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(
    pair.react.page,
    vuePopoverScreenshot,
    reactPopoverScreenshot,
    'Breadcrumb Popover React/Vue',
  );
  const [reactPopoverStyle, vuePopoverStyle, reactPopoverBox, vuePopoverBox] = await Promise.all([
    captureComputedStyle(reactPopover, [
      'backgroundColor',
      'borderRadius',
      'boxShadow',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
    ]),
    captureComputedStyle(vuePopover, [
      'backgroundColor',
      'borderRadius',
      'boxShadow',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
    ]),
    reactPopover.boundingBox(),
    vuePopover.boundingBox(),
  ]);
  expect(vuePopoverStyle).toEqual(reactPopoverStyle);
  if (!reactPopoverBox || !vuePopoverBox) throw new Error('Breadcrumb Popover 不可测量');
  for (const axis of ['x', 'y', 'width', 'height'] as const) {
    const delta = Math.abs(vuePopoverBox[axis] - reactPopoverBox[axis]);
    expect(
      delta,
      `Breadcrumb Popover ${axis} 几何不一致：React=${reactPopoverBox[axis]}，Vue=${vuePopoverBox[axis]}，delta=${delta}`,
    ).toBeLessThanOrEqual(VISUAL_THRESHOLDS.boundingRectToleranceCssPx);
  }

  await Promise.all([reactMore.focus(), vueMore.focus()]);
  await Promise.all([
    pair.react.page.keyboard.press('Enter'),
    pair.vue.page.keyboard.press('Enter'),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-breadcrumb-collapse')).toHaveCount(0),
    expect(pair.vue.page.locator('.semi-breadcrumb-collapse')).toHaveCount(0),
    expect(
      pair.react.page.locator(
        '[data-parity-target="breadcrumb-collapsed"] .semi-breadcrumb-item-wrap',
      ),
    ).toHaveCount(6),
    expect(
      pair.vue.page.locator(
        '[data-parity-target="breadcrumb-collapsed"] .semi-breadcrumb-item-wrap',
      ),
    ).toHaveCount(6),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Breadcrumb React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'breadcrumb',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('breadcrumb-reference');
      const vueTarget = pair.vue.page.getByTestId('breadcrumb-vue');
      await expect(reactTarget).toHaveScreenshot(
        `breadcrumb-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`breadcrumb-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Breadcrumb React/Vue RTL 间距、样式、几何与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'breadcrumb',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('breadcrumb').targets) {
    await expectComparableTarget(pair, 'breadcrumb', target.id);
  }
  const reactItem = pair.react.page
    .locator('[data-parity-target="breadcrumb-basic"] .semi-breadcrumb-item-wrap')
    .first();
  const vueItem = pair.vue.page
    .locator('[data-parity-target="breadcrumb-basic"] .semi-breadcrumb-item-wrap')
    .first();
  const [reactSpacing, vueSpacing] = await Promise.all([
    captureComputedStyle(reactItem, ['marginLeft', 'marginRight']),
    captureComputedStyle(vueItem, ['marginLeft', 'marginRight']),
  ]);
  expect(vueSpacing).toEqual(reactSpacing);
  const reactTarget = pair.react.page.getByTestId('breadcrumb-reference');
  const vueTarget = pair.vue.page.getByTestId('breadcrumb-vue');
  await expect(reactTarget).toHaveScreenshot('breadcrumb-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('breadcrumb-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
