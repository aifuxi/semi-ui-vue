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

test('Grid 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'grid',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.gridPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'grid')).toBe(true);
  await expect(page.getByTestId('grid-reference').locator('.semi-row')).toHaveCount(3);
  await expect(page.getByTestId('grid-reference').locator('.semi-row-flex')).toHaveCount(1);
  await expect(page.getByTestId('grid-reference').locator('.semi-col')).toHaveCount(12);
  await expect(page.locator('[data-parity-target="grid-flex-row"]')).toHaveClass(
    /semi-row-flex-space-between/,
  );
  await expect(page.locator('[data-parity-target="grid-responsive-col"]')).toHaveClass(
    /semi-col-lg-push-1/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Grid 栅格、Gutter、Flex、响应式与 RTL 契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'grid',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('grid').targets).toHaveLength(7);
  for (const target of assertScenarioComparable('grid').targets) {
    await expectComparableTarget(pair, 'grid', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="grid-gutter-row"]')).toHaveCSS(
      'margin-left',
      '-16px',
    );
    await expect(parityPage.locator('[data-parity-target="grid-gutter-col"]')).toHaveCSS(
      'padding-left',
      '16px',
    );
    await expect(parityPage.locator('[data-parity-target="grid-flex-row"]')).toHaveCSS(
      'justify-content',
      'space-between',
    );
    await expect(parityPage.locator('[data-parity-target="grid-flex-row"]')).toHaveCSS(
      'align-items',
      'center',
    );
    await expect(parityPage.locator('[data-parity-target="grid-ordered-col"]')).toHaveCSS(
      'order',
      '3',
    );
    const [basicRowBox, basicColBox, responsiveRowBox, responsiveColBox] = await Promise.all([
      parityPage.locator('[data-parity-target="grid-basic-row"]').boundingBox(),
      parityPage.locator('[data-parity-target="grid-basic-col"]').boundingBox(),
      parityPage.locator('.grid-scenario__responsive-row').boundingBox(),
      parityPage.locator('[data-parity-target="grid-responsive-col"]').boundingBox(),
    ]);
    if (!basicRowBox || !basicColBox || !responsiveRowBox || !responsiveColBox) {
      throw new Error('Grid 栅格目标不可测量');
    }
    expect(basicColBox.width / basicRowBox.width).toBeCloseTo(8 / 24, 4);
    expect(responsiveColBox.width / responsiveRowBox.width).toBeCloseTo(6 / 24, 4);
  }

  await Promise.all([
    pair.react.page.setViewportSize({ width: 390, height: 844 }),
    pair.vue.page.setViewportSize({ width: 390, height: 844 }),
  ]);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="grid-gutter-row"]')).toHaveCSS(
      'margin-left',
      '-4px',
    );
    await expect(parityPage.locator('[data-parity-target="grid-gutter-col"]')).toHaveCSS(
      'padding-left',
      '4px',
    );
  }
  await expectComparableTarget(pair, 'grid', 'grid-responsive-col');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Grid React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'grid',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('grid-reference');
      const vueTarget = pair.vue.page.getByTestId('grid-vue');
      await expect(reactTarget).toHaveScreenshot(`grid-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`grid-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Grid React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'grid',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('grid').targets) {
    await expectComparableTarget(pair, 'grid', target.id);
  }
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="grid-basic-row"]')).toHaveCSS(
      'direction',
      'rtl',
    );
    await expect(parityPage.locator('[data-parity-target="grid-basic-col"]')).toHaveCSS(
      'float',
      'right',
    );
  }
  const reactTarget = pair.react.page.getByTestId('grid-reference');
  const vueTarget = pair.vue.page.getByTestId('grid-vue');
  await expect(reactTarget).toHaveScreenshot('grid-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('grid-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot(),
    vueTarget.screenshot(),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
