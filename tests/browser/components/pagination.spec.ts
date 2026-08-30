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

test('Pagination 参考场景来自本地 v2.102.0 并保留截断、容量、快速跳页与 small DOM', async ({
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
      scenarioId: 'pagination',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.paginationPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'pagination')).toBe(true);
  const scenario = page.getByTestId('pagination-reference');
  await expect(scenario.locator('.semi-page')).toHaveCount(4);
  await expect(
    scenario.locator('[data-parity-target="pagination-basic"] .semi-page-item-active'),
  ).toHaveText('4');
  await expect(
    scenario.locator('[data-parity-target="pagination-basic"] [aria-label="More"]'),
  ).toHaveCount(1);
  await expect(scenario.locator('.semi-page-switch')).toHaveCount(1);
  await expect(scenario.locator('.semi-page-quickjump')).toHaveCount(1);
  await expect(scenario.locator('.semi-page-small')).toHaveCount(1);
  expect(runtimeErrors).toEqual([]);
});

test('Pagination React/Vue 页码、快速跳页、容量 Select、Popover、样式与几何一致', async ({
  context,
}) => {
  const pair = await openParityPages(context, {
    scenarioId: 'pagination',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  const smallTextNodes = (page: typeof pair.react.page) =>
    page
      .locator('[data-parity-target="pagination-small"] .semi-page-item-small')
      .evaluate((element) =>
        Array.from(element.childNodes, (node) => ({
          nodeName: node.nodeName,
          nodeType: node.nodeType,
          textContent: node.textContent,
        })),
      );
  const [reactSmallTextNodes, vueSmallTextNodes] = await Promise.all([
    smallTextNodes(pair.react.page),
    smallTextNodes(pair.vue.page),
  ]);
  expect(vueSmallTextNodes).toEqual(reactSmallTextNodes);

  expect(assertScenarioComparable('pagination').targets).toHaveLength(5);
  for (const target of assertScenarioComparable('pagination').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'pagination', target.id);
    });
  }

  const basicPage = (page: typeof pair.react.page) =>
    page.locator('[data-parity-target="pagination-basic"] [aria-label="Page 5"]');
  await Promise.all([basicPage(pair.react.page).click(), basicPage(pair.vue.page).click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('页码：5'),
    expect(pair.vue.page.getByRole('status')).toHaveText('页码：5'),
  ]);

  const quickInput = (page: typeof pair.react.page) =>
    page.locator('[data-parity-target="pagination-complete"] .semi-page-quickjump input');
  await Promise.all([quickInput(pair.react.page).fill('8'), quickInput(pair.vue.page).fill('8')]);
  await Promise.all([
    quickInput(pair.react.page).press('Enter'),
    quickInput(pair.vue.page).press('Enter'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('变更：8/10'),
    expect(pair.vue.page.getByRole('status')).toHaveText('变更：8/10'),
  ]);

  const selectTrigger = (page: typeof pair.react.page) =>
    page.locator('[data-parity-target="pagination-complete"] .semi-select').first();
  await Promise.all([selectTrigger(pair.react.page).click(), selectTrigger(pair.vue.page).click()]);
  const reactOption = pair.react.page
    .locator('.semi-select-option')
    .filter({ hasText: '每页条数：20' });
  const vueOption = pair.vue.page
    .locator('.semi-select-option')
    .filter({ hasText: '每页条数：20' });
  await Promise.all([expect(reactOption).toBeVisible(), expect(vueOption).toBeVisible()]);
  await Promise.all([reactOption.click(), vueOption.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('变更：4/20'),
    expect(pair.vue.page.getByRole('status')).toHaveText('变更：4/20'),
  ]);

  const more = (page: typeof pair.react.page) =>
    page.locator('[data-parity-target="pagination-basic"] [aria-label="More"]').first();
  await Promise.all([more(pair.react.page).hover(), more(pair.vue.page).hover()]);
  const reactPopover = pair.react.page.locator('.semi-popover-wrapper:visible');
  const vuePopover = pair.vue.page.locator('.semi-popover-wrapper:visible');
  await Promise.all([expect(reactPopover).toBeVisible(), expect(vuePopover).toBeVisible()]);
  await Promise.all(
    [reactPopover, vuePopover].map((popover) =>
      popover.evaluate(async (element) => {
        await Promise.all(
          element
            .getAnimations({ subtree: true })
            .map((animation) => animation.finished.catch(() => undefined)),
        );
      }),
    ),
  );
  const [reactStyle, vueStyle, reactBox, vueBox] = await Promise.all([
    captureComputedStyle(reactPopover, [
      'backgroundColor',
      'borderRadius',
      'boxShadow',
      'paddingTop',
    ]),
    captureComputedStyle(vuePopover, [
      'backgroundColor',
      'borderRadius',
      'boxShadow',
      'paddingTop',
    ]),
    reactPopover.boundingBox(),
    vuePopover.boundingBox(),
  ]);
  expect(vueStyle).toEqual(reactStyle);
  if (!reactBox || !vueBox) throw new Error('Pagination Popover 不可测量');
  for (const axis of ['x', 'y', 'width', 'height'] as const) {
    expect(
      Math.abs(vueBox[axis] - reactBox[axis]),
      `Pagination Popover ${axis}: React ${JSON.stringify(reactBox)}, Vue ${JSON.stringify(vueBox)}`,
    ).toBeLessThanOrEqual(VISUAL_THRESHOLDS.boundingRectToleranceCssPx);
  }
  await expect(reactPopover).toHaveScreenshot('pagination-popover-reference.png');
  await expect(vuePopover).toHaveScreenshot('pagination-popover-vue.png');
  await expect(reactPopover.locator('.semi-page-rest-list')).toHaveScreenshot(
    'pagination-rest-list-reference.png',
  );
  await expect(vuePopover.locator('.semi-page-rest-list')).toHaveScreenshot(
    'pagination-rest-list-vue.png',
  );
  const [reactPopoverScreenshot, vuePopoverScreenshot] = await Promise.all([
    reactPopover.screenshot({ animations: 'disabled' }),
    vuePopover.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(
    pair.react.page,
    vuePopoverScreenshot,
    reactPopoverScreenshot,
    'Pagination Popover React/Vue',
  );
  for (const index of [0, 1]) {
    const reactPageItem = reactPopover.locator('.semi-page-rest-item').nth(index);
    const vuePageItem = vuePopover.locator('.semi-page-rest-item').nth(index);
    const [reactPageBox, vuePageBox] = await Promise.all([
      reactPageItem.boundingBox(),
      vuePageItem.boundingBox(),
    ]);
    if (!reactPageBox || !vuePageBox)
      throw new Error(`Pagination Popover 页码项 ${index} 不可测量`);
    for (const axis of ['x', 'y', 'width', 'height'] as const) {
      expect(Math.abs(vuePageBox[axis] - reactPageBox[axis])).toBeLessThanOrEqual(
        VISUAL_THRESHOLDS.boundingRectToleranceCssPx,
      );
    }
    const insetClip = (box: typeof reactPageBox) => ({
      x: box.x + 4,
      y: box.y,
      width: box.width - 8,
      height: box.height,
    });
    const [reactPageScreenshot, vuePageScreenshot] = await Promise.all([
      pair.react.page.screenshot({ animations: 'disabled', clip: insetClip(reactPageBox) }),
      pair.vue.page.screenshot({ animations: 'disabled', clip: insetClip(vuePageBox) }),
    ]);
    await expectScreenshotPixelsToMatch(pair.react.page, vuePageScreenshot, reactPageScreenshot);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Pagination React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'pagination',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('pagination-reference');
      const vueTarget = pair.vue.page.getByTestId('pagination-vue');
      await expect(reactTarget).toHaveScreenshot(
        `pagination-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`pagination-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Pagination React/Vue RTL 与 en-US Locale 的样式、几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'pagination',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('pagination').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'pagination', target.id);
    });
  }
  await Promise.all([
    expect(pair.react.page.locator('.semi-page-total').first()).toHaveText('Total pages: 20'),
    expect(pair.vue.page.locator('.semi-page-total').first()).toHaveText('Total pages: 20'),
  ]);
  const reactTarget = pair.react.page.getByTestId('pagination-reference');
  const vueTarget = pair.vue.page.getByTestId('pagination-vue');
  await expect(reactTarget).toHaveScreenshot('pagination-reference-light-rtl-en-US.png');
  await expect(vueTarget).toHaveScreenshot('pagination-vue-light-rtl-en-US.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
