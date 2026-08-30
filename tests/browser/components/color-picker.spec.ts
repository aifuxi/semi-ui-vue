import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../../packages/test-infra/src';
import {
  expectComparableTarget,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('ColorPicker 参考场景来自本地 v2.102.0 并保留内联、Popover、滑条与 ARIA', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'color-picker',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.colorPickerPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'color-picker')).toBe(true);
  await expect(page.getByTestId('color-picker-reference')).toBeVisible();
  await expect(page.locator('.color-picker-target-popover')).toBeVisible();
  await expect(
    page.locator('[data-parity-target="color-picker-inline"] .semi-colorPicker-colorChooseArea'),
  ).toHaveAttribute('aria-label', 'Color');
  await expect(
    page.locator('[data-parity-target="color-picker-inline"] .semi-colorPicker-alphaSlider'),
  ).toHaveAttribute('aria-label', 'Alpha');
  expect(runtimeErrors).toEqual([]);
});

test('ColorPicker React/Vue DOM、样式、几何、拖拽与输入同步一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'color-picker',
    theme: 'light',
    direction: 'ltr',
    locale: 'en-US',
  });
  expect(assertScenarioComparable('color-picker').targets).toHaveLength(7);
  for (const target of assertScenarioComparable('color-picker').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'color-picker', target.id));
  }
  const colorSlider = '[data-parity-target="color-picker-inline"] .semi-colorPicker-colorSlider';
  await Promise.all([
    pair.react.page.locator(colorSlider).click({ position: { x: 110, y: 5 } }),
    pair.vue.page.locator(colorSlider).click({ position: { x: 110, y: 5 } }),
  ]);
  const colorInput =
    '[data-parity-target="color-picker-inline"] .semi-colorPicker-colorPickerInput input';
  const [reactValue, vueValue] = await Promise.all([
    pair.react.page.locator(colorInput).inputValue(),
    pair.vue.page.locator(colorInput).inputValue(),
  ]);
  expect(vueValue).toBe(reactValue);
  await Promise.all([
    pair.react.page.locator(colorInput).fill('#00ff00'),
    pair.vue.page.locator(colorInput).fill('#00ff00'),
  ]);
  await Promise.all([
    expect(pair.react.page.locator(colorInput)).toHaveValue('#00ff00'),
    expect(pair.vue.page.locator(colorInput)).toHaveValue('#00ff00'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`ColorPicker React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'color-picker',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('color-picker').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'color-picker', target.id));
      }
      const [reactInline, vueInline, reactPopup, vuePopup] = await Promise.all([
        pair.react.page
          .locator('[data-parity-target="color-picker-inline"]')
          .screenshot({ animations: 'disabled' }),
        pair.vue.page
          .locator('[data-parity-target="color-picker-inline"]')
          .screenshot({ animations: 'disabled' }),
        pair.react.page
          .locator('.color-picker-target-popover')
          .screenshot({ animations: 'disabled' }),
        pair.vue.page
          .locator('.color-picker-target-popover')
          .screenshot({ animations: 'disabled' }),
      ]);
      expect(vueInline.equals(reactInline)).toBe(true);
      expect(vuePopup.equals(reactPopup)).toBe(true);
      expect(reactInline).toMatchSnapshot(
        `color-picker-inline-reference-${viewportName}-${theme}.png`,
      );
      expect(vueInline).toMatchSnapshot(`color-picker-inline-vue-${viewportName}-${theme}.png`);
      expect(reactPopup).toMatchSnapshot(
        `color-picker-popup-reference-${viewportName}-${theme}.png`,
      );
      expect(vuePopup).toMatchSnapshot(`color-picker-popup-vue-${viewportName}-${theme}.png`);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('ColorPicker React/Vue RTL 方向、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'color-picker',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('color-picker').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'color-picker', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(
      page.locator('[data-parity-target="color-picker-inline"] .semi-colorPicker'),
    ).toHaveCSS('direction', 'rtl');
  }
  const [reactInline, vueInline, reactPopup, vuePopup] = await Promise.all([
    pair.react.page
      .locator('[data-parity-target="color-picker-inline"]')
      .screenshot({ animations: 'disabled' }),
    pair.vue.page
      .locator('[data-parity-target="color-picker-inline"]')
      .screenshot({ animations: 'disabled' }),
    pair.react.page.locator('.color-picker-target-popover').screenshot({ animations: 'disabled' }),
    pair.vue.page.locator('.color-picker-target-popover').screenshot({ animations: 'disabled' }),
  ]);
  expect(vueInline.equals(reactInline)).toBe(true);
  expect(vuePopup.equals(reactPopup)).toBe(true);
  expect(reactInline).toMatchSnapshot('color-picker-inline-reference-light-rtl.png');
  expect(vueInline).toMatchSnapshot('color-picker-inline-vue-light-rtl.png');
  expect(reactPopup).toMatchSnapshot('color-picker-popup-reference-light-rtl.png');
  expect(vuePopup).toMatchSnapshot('color-picker-popup-vue-light-rtl.png');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
