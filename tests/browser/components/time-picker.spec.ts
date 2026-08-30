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

test('TimePicker 参考场景来自本地 v2.102.0 并保留输入、范围与状态 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'time-picker',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.timePickerPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'time-picker')).toBe(true);
  const scenario = page.getByTestId('time-picker-reference');
  await expect(scenario.locator('.semi-timepicker')).toHaveCount(7);
  await expect(scenario.locator('[data-parity-target="time-picker-basic"]')).toHaveValue(
    '10:24:18',
  );
  await expect(scenario.locator('[data-parity-target="time-picker-range"]')).toHaveValue(
    '09:00:00 ~ 18:00:00',
  );
  await expect(scenario.locator('[data-parity-target="time-picker-disabled"]')).toBeDisabled();
  expect(runtimeErrors).toEqual([]);
});

test('TimePicker React/Vue 输入、面板选择、焦点、Portal、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'time-picker',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('time-picker').targets).toHaveLength(7);
  for (const target of assertScenarioComparable('time-picker').targets) {
    await expectComparableTarget(pair, 'time-picker', target.id);
  }

  const reactInput = pair.react.page.locator('[data-parity-target="time-picker-basic"]');
  const vueInput = pair.vue.page.locator('[data-parity-target="time-picker-basic"]');
  await Promise.all([reactInput.click(), vueInput.click()]);
  const reactPanel = pair.react.page.locator('.semi-timepicker-panel-column-3');
  const vuePanel = pair.vue.page.locator('.semi-timepicker-panel-column-3');
  await Promise.all([expect(reactPanel).toBeVisible(), expect(vuePanel).toBeVisible()]);
  await Promise.all([
    expect(reactPanel.locator('.semi-timepicker-panel-list-hour')).toHaveCount(1),
    expect(vuePanel.locator('.semi-timepicker-panel-list-hour')).toHaveCount(1),
    expect(reactPanel.locator('[role="listbox"]')).toHaveCount(3),
    expect(vuePanel.locator('[role="listbox"]')).toHaveCount(3),
  ]);
  const [reactPanelStyle, vuePanelStyle] = await Promise.all([
    captureComputedStyle(reactPanel, ['backgroundColor', 'borderRadius', 'height', 'width']),
    captureComputedStyle(vuePanel, ['backgroundColor', 'borderRadius', 'height', 'width']),
  ]);
  expect(vuePanelStyle).toEqual(reactPanelStyle);
  const [reactPanelBox, vuePanelBox] = await Promise.all([
    reactPanel.boundingBox(),
    vuePanel.boundingBox(),
  ]);
  if (!reactPanelBox || !vuePanelBox) throw new Error('TimePicker 面板不可测量');
  // 两端 Popover wrapper 深度不同会让四个圆角各产生一个抗锯齿像素；内缩 2px 保留完整内容区。
  const [reactPanelScreenshot, vuePanelScreenshot] = await Promise.all([
    pair.react.page.screenshot({
      animations: 'disabled',
      clip: {
        x: reactPanelBox.x + 2,
        y: reactPanelBox.y + 2,
        width: reactPanelBox.width - 4,
        height: reactPanelBox.height - 4,
      },
    }),
    pair.vue.page.screenshot({
      animations: 'disabled',
      clip: {
        x: vuePanelBox.x + 2,
        y: vuePanelBox.y + 2,
        width: vuePanelBox.width - 4,
        height: vuePanelBox.height - 4,
      },
    }),
  ]);
  await expect(reactPanelScreenshot).toMatchSnapshot('time-picker-panel-reference-light.png');
  await expect(vuePanelScreenshot).toMatchSnapshot('time-picker-panel-vue-light.png');
  expect(vuePanelScreenshot.equals(reactPanelScreenshot)).toBe(true);

  const reactMinute = reactPanel
    .locator('.semi-timepicker-panel-list-minute li')
    .filter({ hasText: /^25/ });
  const vueMinute = vuePanel
    .locator('.semi-timepicker-panel-list-minute li')
    .filter({ hasText: /^25/ });
  await Promise.all([reactMinute.click(), vueMinute.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toContainText('10:25:18'),
    expect(pair.vue.page.getByRole('status')).toContainText('10:25:18'),
  ]);
  await Promise.all([
    pair.react.page.getByRole('heading', { name: 'TimePicker 时间选择器' }).click(),
    pair.vue.page.getByRole('heading', { name: 'TimePicker 时间选择器' }).click(),
  ]);
  await Promise.all([expect(reactPanel).toBeHidden(), expect(vuePanel).toBeHidden()]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`TimePicker React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'time-picker',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('time-picker-reference');
      const vueTarget = pair.vue.page.getByTestId('time-picker-vue');
      await expect(reactTarget).toHaveScreenshot(
        `time-picker-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`time-picker-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('TimePicker React/Vue RTL 面板、样式、几何与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'time-picker',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('time-picker').targets) {
    await expectComparableTarget(pair, 'time-picker', target.id);
  }
  const reactInput = pair.react.page.locator('[data-parity-target="time-picker-basic"]');
  const vueInput = pair.vue.page.locator('[data-parity-target="time-picker-basic"]');
  await Promise.all([reactInput.click(), vueInput.click()]);
  const reactPanel = pair.react.page.locator('.semi-timepicker-panel-column-3');
  const vuePanel = pair.vue.page.locator('.semi-timepicker-panel-column-3');
  await Promise.all([expect(reactPanel).toBeVisible(), expect(vuePanel).toBeVisible()]);
  const [reactDirection, vueDirection] = await Promise.all([
    captureComputedStyle(reactPanel, ['direction', 'marginLeft', 'marginRight']),
    captureComputedStyle(vuePanel, ['direction', 'marginLeft', 'marginRight']),
  ]);
  expect(vueDirection).toEqual(reactDirection);
  await Promise.all([
    pair.react.page.getByRole('heading', { name: 'TimePicker 时间选择器' }).click(),
    pair.vue.page.getByRole('heading', { name: 'TimePicker 时间选择器' }).click(),
  ]);
  await Promise.all([expect(reactPanel).toBeHidden(), expect(vuePanel).toBeHidden()]);
  const reactTarget = pair.react.page.getByTestId('time-picker-reference');
  const vueTarget = pair.vue.page.getByTestId('time-picker-vue');
  await expect(reactTarget).toHaveScreenshot('time-picker-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('time-picker-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
