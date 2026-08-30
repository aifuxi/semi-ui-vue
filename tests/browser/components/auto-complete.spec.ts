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

test('AutoComplete 参考场景来自本地 v2.102.0 并保留 Input、Option 与 Portal', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'auto-complete',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.autoCompletePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'auto-complete')).toBe(true);
  const scenario = page.getByTestId('auto-complete-reference');
  await expect(scenario.locator('.semi-autocomplete')).toHaveCount(4);
  await expect(scenario.locator('.semi-input')).toHaveCount(4);
  await expect(scenario.locator('.auto-complete-target-options')).toBeVisible();
  await expect(scenario.locator('.semi-autocomplete-option')).toHaveCount(3);
  await expect(scenario.locator('.semi-autocomplete-option-focused')).toHaveCount(1);
  expect(runtimeErrors).toEqual([]);
});

test('AutoComplete React/Vue 输入、键盘、选择事件、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'auto-complete',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('auto-complete').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'auto-complete', target.id);
    });
  }

  const reactInput = pair.react.page.locator('[data-parity-target="auto-complete-basic"] input');
  const vueInput = pair.vue.page.locator('[data-parity-target="auto-complete-basic"] input');
  await Promise.all([reactInput.fill('test'), vueInput.fill('test')]);
  const reactBasicOptions = pair.react.page.locator('.auto-complete-target-basic-options');
  const vueBasicOptions = pair.vue.page.locator('.auto-complete-target-basic-options');
  await Promise.all([
    expect(reactBasicOptions.locator('.semi-autocomplete-option').first()).toContainText(
      'test@gmail.com',
    ),
    expect(vueBasicOptions.locator('.semi-autocomplete-option').first()).toContainText(
      'test@gmail.com',
    ),
  ]);
  await Promise.all([reactInput.press('ArrowDown'), vueInput.press('ArrowDown')]);
  await Promise.all([
    expect(reactBasicOptions.locator('.semi-autocomplete-option-focused')).toHaveCount(1),
    expect(vueBasicOptions.locator('.semi-autocomplete-option-focused')).toHaveCount(1),
  ]);
  await Promise.all([reactInput.press('Enter'), vueInput.press('Enter')]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近输入：test@gmail.com'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近输入：test@gmail.com'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`AutoComplete React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'auto-complete',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('auto-complete-reference');
      const vueTarget = pair.vue.page.getByTestId('auto-complete-vue');
      await expect(reactTarget).toHaveScreenshot(
        `auto-complete-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`auto-complete-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('AutoComplete React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'auto-complete',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('auto-complete-reference');
  const vueTarget = pair.vue.page.getByTestId('auto-complete-vue');
  await expect(reactTarget).toHaveScreenshot('auto-complete-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('auto-complete-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});
