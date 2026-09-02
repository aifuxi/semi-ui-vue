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
  expectScreenshotPixelsToMatch,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('DatePicker 参考场景来自本地 v2.102.0 并保留输入、月历、选中态与 ARIA', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'date-picker',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.datePickerPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'date-picker')).toBe(true);
  await expect(page.getByTestId('date-picker-reference')).toBeVisible();
  await expect(page.locator('.date-picker-target-popup')).toBeVisible();
  await expect(page.locator('[data-parity-target="date-picker-trigger"] input')).toHaveValue(
    '2024-05-10',
  );
  await expect(page.locator('[role="gridcell"][aria-label="2024-05-10"]')).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(runtimeErrors).toEqual([]);
});

test('DatePicker React/Vue 样式、几何、月份导航与选择同步一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'date-picker',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('date-picker').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('date-picker').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'date-picker', target.id));
  }
  await Promise.all([
    pair.react.page.getByRole('button', { name: 'Next month' }).click(),
    pair.vue.page.getByRole('button', { name: 'Next month' }).click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('[role="gridcell"][aria-label="2024-06-12"]')).toBeVisible(),
    expect(pair.vue.page.locator('[role="gridcell"][aria-label="2024-06-12"]')).toBeVisible(),
  ]);
  await Promise.all([
    pair.react.page.locator('[role="gridcell"][aria-label="2024-06-12"]').click(),
    pair.vue.page.locator('[role="gridcell"][aria-label="2024-06-12"]').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('[data-parity-target="date-picker-trigger"] input')).toHaveValue(
      '2024-06-12',
    ),
    expect(pair.vue.page.locator('[data-parity-target="date-picker-trigger"] input')).toHaveValue(
      '2024-06-12',
    ),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`DatePicker React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        { scenarioId: 'date-picker', theme, direction: 'ltr', locale: 'zh-CN' },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('date-picker').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'date-picker', target.id));
      }
      const [reactTrigger, vueTrigger, reactPopup, vuePopup] = await Promise.all([
        pair.react.page
          .locator('[data-parity-target="date-picker-trigger"]')
          .screenshot({ animations: 'disabled' }),
        pair.vue.page
          .locator('[data-parity-target="date-picker-trigger"]')
          .screenshot({ animations: 'disabled' }),
        pair.react.page.locator('.date-picker-target-popup').screenshot({ animations: 'disabled' }),
        pair.vue.page.locator('.date-picker-target-popup').screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(
        pair.react.page,
        vueTrigger,
        reactTrigger,
        'DatePicker Trigger React/Vue',
      );
      await expectScreenshotPixelsToMatch(
        pair.react.page,
        vuePopup,
        reactPopup,
        'DatePicker Popup React/Vue',
      );
      expect(reactTrigger).toMatchSnapshot(
        `date-picker-trigger-reference-${viewportName}-${theme}.png`,
      );
      expect(vueTrigger).toMatchSnapshot(`date-picker-trigger-vue-${viewportName}-${theme}.png`);
      expect(reactPopup).toMatchSnapshot(
        `date-picker-popup-reference-${viewportName}-${theme}.png`,
      );
      expect(vuePopup).toMatchSnapshot(`date-picker-popup-vue-${viewportName}-${theme}.png`);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('DatePicker React/Vue RTL 方向、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'date-picker',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('date-picker').targets) {
    const [reactStyle, vueStyle, reactRect, vueRect] = await Promise.all([
      captureComputedStyle(
        pair.react.page.locator(target.selector),
        target.computedStyleProperties,
      ),
      captureComputedStyle(pair.vue.page.locator(target.selector), target.computedStyleProperties),
      pair.react.page.locator(target.selector).boundingBox(),
      pair.vue.page.locator(target.selector).boundingBox(),
    ]);
    expect(vueStyle).toEqual(reactStyle);
    expect(vueRect).toEqual(reactRect);
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('.date-picker-target-popup')).toHaveCSS('direction', 'rtl');
  }
  const [reactTrigger, vueTrigger, reactPopup, vuePopup] = await Promise.all([
    pair.react.page
      .locator('[data-parity-target="date-picker-trigger"]')
      .screenshot({ animations: 'disabled' }),
    pair.vue.page
      .locator('[data-parity-target="date-picker-trigger"]')
      .screenshot({ animations: 'disabled' }),
    pair.react.page.locator('.date-picker-target-popup').screenshot({ animations: 'disabled' }),
    pair.vue.page.locator('.date-picker-target-popup').screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(
    pair.react.page,
    vueTrigger,
    reactTrigger,
    'DatePicker RTL Trigger React/Vue',
  );
  await expectScreenshotPixelsToMatch(
    pair.react.page,
    vuePopup,
    reactPopup,
    'DatePicker RTL Popup React/Vue',
  );
  expect(reactTrigger).toMatchSnapshot('date-picker-trigger-reference-light-rtl.png');
  expect(vueTrigger).toMatchSnapshot('date-picker-trigger-vue-light-rtl.png');
  expect(reactPopup).toMatchSnapshot('date-picker-popup-reference-light-rtl.png');
  expect(vuePopup).toMatchSnapshot('date-picker-popup-vue-light-rtl.png');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
