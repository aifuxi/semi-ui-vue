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

test('InputNumber 参考场景来自本地 v2.102.0 并保留 spinbutton/步进器 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'input-number',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.inputNumberPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'input-number')).toBe(true);
  const scenario = page.getByTestId('input-number-reference');
  await expect(scenario.locator('.semi-input-number')).toHaveCount(8);
  await expect(scenario.getByRole('spinbutton')).toHaveCount(8);
  await expect(scenario.locator('.semi-input-number-suffix-btns')).toHaveCount(6);
  await expect(scenario.locator('.input-number-target-disabled input')).toBeDisabled();
  expect(runtimeErrors).toHaveLength(1);
  expect(runtimeErrors[0]).toContain('scientificNotation');
});

test('InputNumber React/Vue 样式、几何、步进、键盘、货币与 ARIA 一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'input-number',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('input-number').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'input-number', target.id);
    });
  }

  const reactBasic = pair.react.page.locator('.input-number-target-basic input');
  const vueBasic = pair.vue.page.locator('.input-number-target-basic input');
  await Promise.all([reactBasic.fill('4'), vueBasic.fill('4')]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：4'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：4'),
  ]);
  await Promise.all([reactBasic.focus(), vueBasic.focus()]);
  await Promise.all([
    pair.react.page.keyboard.press('ArrowUp'),
    pair.vue.page.keyboard.press('ArrowUp'),
  ]);
  await Promise.all([expect(reactBasic).toHaveValue('5'), expect(vueBasic).toHaveValue('5')]);

  const reactBounds = pair.react.page.locator('.input-number-target-bounds input');
  const vueBounds = pair.vue.page.locator('.input-number-target-bounds input');
  await Promise.all([
    expect(reactBounds).toHaveAttribute('role', 'spinbutton'),
    expect(vueBounds).toHaveAttribute('role', 'spinbutton'),
    expect(reactBounds).toHaveAttribute('aria-valuemin', '1'),
    expect(vueBounds).toHaveAttribute('aria-valuemin', '1'),
    expect(reactBounds).toHaveAttribute('aria-valuemax', '10'),
    expect(vueBounds).toHaveAttribute('aria-valuemax', '10'),
  ]);

  await Promise.all([
    expect(pair.react.page.locator('.input-number-target-currency input')).toHaveValue('$1,234.50'),
    expect(pair.vue.page.locator('.input-number-target-currency input')).toHaveValue('$1,234.50'),
    expect(pair.react.page.locator('.input-number-target-scientific input')).toHaveValue(
      '1.23456789012345e+14',
    ),
    expect(pair.vue.page.locator('.input-number-target-scientific input')).toHaveValue(
      '1.23456789012345e+14',
    ),
  ]);
  expect(pair.react.runtimeErrors).toHaveLength(1);
  expect(pair.react.runtimeErrors[0]).toContain('scientificNotation');
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`InputNumber React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'input-number',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('input-number-reference');
      const vueTarget = pair.vue.page.getByTestId('input-number-vue');
      await expect(reactTarget).toHaveScreenshot(
        `input-number-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`input-number-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('InputNumber React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'input-number',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('input-number-reference');
  const vueTarget = pair.vue.page.getByTestId('input-number-vue');
  await expect(reactTarget).toHaveScreenshot('input-number-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('input-number-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
