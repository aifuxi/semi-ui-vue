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

test('Checkbox 参考场景来自本地 v2.102.0 并保留单项、组、ARIA 与卡片 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'checkbox',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.checkboxPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'checkbox')).toBe(true);
  const scenario = page.getByTestId('checkbox-reference');
  await expect(scenario.locator('.semi-checkbox')).toHaveCount(12);
  await expect(scenario.locator('.semi-checkbox-indeterminate')).toHaveCount(1);
  await expect(scenario.locator('.semi-checkboxGroup-horizontal')).toHaveCount(1);
  await expect(scenario.locator('.semi-checkbox-cardType')).toHaveCount(4);
  await expect(scenario.locator('[role="list"]')).toHaveCount(3);
  await expect(scenario.locator('[role="listitem"]')).toHaveCount(7);
  await expect(scenario.locator('[data-parity-target="checkbox-disabled"] input')).toBeDisabled();
  expect(runtimeErrors).toEqual([]);
});

test('Checkbox React/Vue 样式、几何、键盘与事件一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'checkbox',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('checkbox').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'checkbox', target.id);
    });
  }

  await Promise.all([pair.react.page.keyboard.press('Tab'), pair.vue.page.keyboard.press('Tab')]);
  const reactBasic = pair.react.page.locator('[data-parity-target="checkbox-basic"]');
  const vueBasic = pair.vue.page.locator('[data-parity-target="checkbox-basic"]');
  await Promise.all([
    expect(reactBasic.locator('input')).toBeFocused(),
    expect(vueBasic.locator('input')).toBeFocused(),
  ]);
  await Promise.all([
    expect(reactBasic.locator('.semi-checkbox-inner-display')).toHaveClass(/semi-checkbox-focus/),
    expect(vueBasic.locator('.semi-checkbox-inner-display')).toHaveClass(/semi-checkbox-focus/),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('Space'),
    pair.vue.page.keyboard.press('Space'),
  ]);
  await Promise.all([
    expect(reactBasic.locator('input')).toBeChecked(),
    expect(vueBasic.locator('input')).toBeChecked(),
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：basic:true'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：basic:true'),
  ]);

  const reactGroupItem = pair.react.page
    .locator('[data-parity-target="checkbox-group-horizontal"] .semi-checkbox')
    .nth(1);
  const vueGroupItem = pair.vue.page
    .locator('[data-parity-target="checkbox-group-horizontal"] .semi-checkbox')
    .nth(1);
  await Promise.all([reactGroupItem.click(), vueGroupItem.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：group:Semi D2C,Semi DSM'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：group:Semi D2C,Semi DSM'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Checkbox React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'checkbox',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('checkbox-reference');
      const vueTarget = pair.vue.page.getByTestId('checkbox-vue');
      await expect(reactTarget).toHaveScreenshot(`checkbox-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`checkbox-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Checkbox React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'checkbox',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('checkbox-reference');
  const vueTarget = pair.vue.page.getByTestId('checkbox-vue');
  await expect(reactTarget).toHaveScreenshot('checkbox-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('checkbox-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
