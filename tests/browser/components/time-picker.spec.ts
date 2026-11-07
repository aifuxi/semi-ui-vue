import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
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

// 外扩 24px 覆盖上游 14px 模糊与 4px 偏移的阴影外沿，同时保留圆角和边框。
const POPUP_SHADOW_PADDING = 24;

/** 截取完整弹层及其外沿，防止仅比较内容区而遗漏祖先容器的额外阴影。 */
async function capturePopupWithShadow(popup: Locator): Promise<Buffer> {
  // 以可见内容的实际几何范围定位，空面板不能伪装成有效截图。
  const box = await popup.boundingBox();
  if (!box) throw new Error('TimePicker 弹层不可测量');
  return popup.page().screenshot({
    animations: 'disabled',
    clip: {
      x: box.x - POPUP_SHADOW_PADDING,
      y: box.y - POPUP_SHADOW_PADDING,
      width: box.width + POPUP_SHADOW_PADDING * 2,
      height: box.height + POPUP_SHADOW_PADDING * 2,
    },
  });
}

for (const theme of ['light', 'dark'] as const) {
  // 同时覆盖单值、范围及三种尺寸，防止专用前缀仅在默认尺寸生效。
  test(`TimePicker React/Vue 完整弹层阴影与圆角一致：${theme}`, async ({ context }, testInfo) => {
    // 两端使用相同场景、主题、方向、语言与真实固定基线来源。
    const pair = await openParityPages(context, {
      scenarioId: 'time-picker',
      theme,
      direction: 'ltr',
      locale: 'zh-CN',
    });
    for (const [target, size] of [
      ['basic', 'default'],
      ['small', 'small'],
      ['large', 'large'],
      ['range', 'default'],
    ] as const) {
      await pair.react.page.locator(`[data-parity-target="time-picker-${target}"]`).click();
      await pair.vue.page.locator(`[data-parity-target="time-picker-${target}"]`).click();
      // React 将含尺寸的 TimePicker 前缀传至 Tooltip，外层不应匹配通用 Popover。
      const wrapperSelector = `.semi-timepicker-panel-${size}-wrapper`;
      const reactWrapper = pair.react.page.locator(wrapperSelector);
      const vueWrapper = pair.vue.page.locator(wrapperSelector);
      await expect(reactWrapper).toBeVisible();
      await expect(vueWrapper).toBeVisible();
      await expect(pair.vue.page.locator('.semi-popover-wrapper')).toHaveCount(0);
      // 外层保持透明且无阴影，由 ScrollList 或范围列表承担基线规定的菜单样式。
      const styleProperties = ['boxShadow', 'backgroundColor', 'borderRadius'] as const;
      expect(await captureComputedStyle(vueWrapper, [...styleProperties])).toEqual(
        await captureComputedStyle(reactWrapper, [...styleProperties]),
      );
      await expect(reactWrapper).toHaveCSS('box-shadow', 'none');
      await expect(vueWrapper).toHaveCSS('box-shadow', 'none');
      // 对齐内容层的公开 class，范围截图保留完整双列表而非单侧列。
      const contentSelector = target === 'range' ? '.semi-timepicker-lists' : '.semi-scrolllist';
      const reactPopup = reactWrapper.locator(contentSelector);
      const vuePopup = vueWrapper.locator(contentSelector);
      await expect(vueWrapper.locator(`.semi-timepicker-panel-${size}-content`)).toHaveCount(1);
      expect(await captureComputedStyle(vuePopup, [...styleProperties])).toEqual(
        await captureComputedStyle(reactPopup, [...styleProperties]),
      );
      expect(await vuePopup.boundingBox()).toEqual(await reactPopup.boundingBox());
      // 选中项居中只允许滚动时间列，范围左面板不应因分割线溢出而横向偏移。
      for (const popup of [reactPopup, vuePopup]) {
        await expect(popup.locator('.semi-scrolllist-body').first()).toHaveJSProperty(
          'scrollLeft',
          0,
        );
      }
      // 实时像素比较包含边缘，截图作为诊断附件保存，不覆盖已有快照基线。
      const reactScreenshot = await capturePopupWithShadow(reactPopup);
      const vueScreenshot = await capturePopupWithShadow(vuePopup);
      await testInfo.attach(`${target}-reference-${theme}`, {
        body: reactScreenshot,
        contentType: 'image/png',
      });
      await testInfo.attach(`${target}-vue-${theme}`, {
        body: vueScreenshot,
        contentType: 'image/png',
      });
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
      await pair.react.page.getByRole('heading', { name: 'TimePicker 时间选择器' }).click();
      await pair.vue.page.getByRole('heading', { name: 'TimePicker 时间选择器' }).click();
      await expect(reactWrapper).toBeHidden();
      await expect(vueWrapper).toBeHidden();
    }
    expect(pair.react.runtimeErrors).toEqual([]);
    expect(pair.vue.runtimeErrors).toEqual([]);
  });
}

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
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'time-picker')).toBe(true);
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
  // 保留历史内缩 2px 的内容区快照；完整边框、圆角与阴影由上方弹层专项独立比较。
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
  await expectScreenshotPixelsToMatch(pair.react.page, vuePanelScreenshot, reactPanelScreenshot);

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

for (const viewportName of ['desktop'] as const) {
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
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
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
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
