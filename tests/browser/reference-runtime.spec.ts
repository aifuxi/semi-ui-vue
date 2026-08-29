import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
  VISUAL_THRESHOLDS,
} from '../../packages/test-infra/src';
import {
  captureComputedStyle,
  expectComparableTarget,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from './parity-harness';

test('Button 参考场景来自本地 v2.102.0 公开源码并保留公开行为', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'button-types',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  const root = page.locator('[data-parity-framework="react"]');
  await expect(root).toHaveAttribute('data-parity-scenario', 'button-types');
  await expect(root).toHaveAttribute('data-reference-status', 'ready');
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.buttonPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'button-types')).toBe(true);

  const buttons = page.getByTestId('button-types-reference').getByRole('button');
  await expect(buttons).toHaveCount(5);
  await expect(buttons.nth(0)).toHaveClass(/semi-button-primary/);
  await expect(buttons.nth(0)).toHaveClass(/semi-button-light/);

  const primaryStyle = await buttons.nth(0).evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      borderRadius: style.borderRadius,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      height: style.height,
      lineHeight: style.lineHeight,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
    };
  });
  expect(primaryStyle).toEqual({
    borderRadius: '3px',
    fontSize: '14px',
    fontWeight: '600',
    height: '32px',
    lineHeight: '20px',
    paddingLeft: '12px',
    paddingRight: '12px',
  });

  await buttons.nth(0).click();
  await expect(page.getByRole('status')).toHaveText('最近操作：主要按钮');
  expect(runtimeErrors).toEqual([]);
});

test('Button 类型场景在同一 Chromium 中保持行为、样式、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'button-types',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await expect(pair.react.page.locator('[data-parity-framework="react"]')).toHaveAttribute(
    'data-reference-status',
    'ready',
  );
  await expect(pair.vue.page.locator('[data-parity-framework="vue"]')).toHaveAttribute(
    'data-vue-status',
    'ready',
  );
  expect(assertScenarioComparable('button-types').targets).toHaveLength(5);

  for (const target of assertScenarioComparable('button-types').targets) {
    await expectComparableTarget(pair, 'button-types', target.id);
  }

  await Promise.all([pair.react.page.keyboard.press('Tab'), pair.vue.page.keyboard.press('Tab')]);
  const [reactFocus, vueFocus] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('[data-parity-target="button-primary"]'), [
      'outlineStyle',
      'outlineWidth',
    ]),
    captureComputedStyle(pair.vue.page.locator('[data-parity-target="button-primary"]'), [
      'outlineStyle',
      'outlineWidth',
    ]),
  ]);
  expect(vueFocus).toEqual(reactFocus);
  expect(reactFocus).toEqual({ outlineStyle: 'solid', outlineWidth: '2px' });

  await Promise.all([
    pair.react.page.keyboard.press('Enter'),
    pair.vue.page.keyboard.press('Enter'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近操作：主要按钮'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近操作：主要按钮'),
  ]);

  const reactDanger = pair.react.page.locator('[data-parity-target="button-danger"]');
  const vueDanger = pair.vue.page.locator('[data-parity-target="button-danger"]');
  await Promise.all([reactDanger.click(), vueDanger.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近操作：危险按钮'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近操作：危险按钮'),
  ]);

  await Promise.all([
    pair.react.page.locator('[data-parity-target="button-primary"]').hover(),
    pair.vue.page.locator('[data-parity-target="button-primary"]').hover(),
  ]);
  const [reactHover, vueHover] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('[data-parity-target="button-primary"]'), [
      'backgroundColor',
    ]),
    captureComputedStyle(pair.vue.page.locator('[data-parity-target="button-primary"]'), [
      'backgroundColor',
    ]),
  ]);
  expect(vueHover).toEqual(reactHover);

  await Promise.all([pair.react.page.mouse.down(), pair.vue.page.mouse.down()]);
  const [reactActive, vueActive] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('[data-parity-target="button-primary"]'), [
      'backgroundColor',
    ]),
    captureComputedStyle(pair.vue.page.locator('[data-parity-target="button-primary"]'), [
      'backgroundColor',
    ]),
  ]);
  await Promise.all([pair.react.page.mouse.up(), pair.vue.page.mouse.up()]);
  expect(vueActive).toEqual(reactActive);
  expect(reactActive).not.toEqual(reactHover);

  await Promise.all([reactDanger.click(), vueDanger.click()]);
  await Promise.all([
    pair.react.page.locator('[data-parity-target="button-primary"]').focus(),
    pair.vue.page.locator('[data-parity-target="button-primary"]').focus(),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('Space'),
    pair.vue.page.keyboard.press('Space'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近操作：主要按钮'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近操作：主要按钮'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Button 图标、加载、禁用、组合、Split 与 RTL 契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'button-contract',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('button-contract').targets) {
    await expectComparableTarget(pair, 'button-contract', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const root = parityPage.locator('[data-parity-scenario="button-contract"]');
    await expect(root).toHaveClass(/semi-rtl/);
    await expect(parityPage.locator('[data-parity-target="button-disabled"]')).toBeDisabled();
    await expect(parityPage.locator('[data-parity-target="button-disabled"]')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await expect(parityPage.locator('[data-parity-target="button-loading"]')).toHaveClass(
      /semi-button-loading/,
    );
    await expect(
      parityPage.locator('[data-parity-target="button-loading"] [data-icon="spin"]'),
    ).toBeVisible();
    await expect(
      parityPage.getByRole('group', { name: '编辑操作' }).getByRole('button'),
    ).toHaveCount(3);
    const splitButtons = parityPage.getByRole('group', { name: '项目操作' }).getByRole('button');
    await expect(splitButtons.first()).toHaveClass(/semi-button-first/);
    await expect(splitButtons.last()).toHaveClass(/semi-button-last/);
  }

  const [reactIconSpacing, vueIconSpacing] = await Promise.all([
    captureComputedStyle(
      pair.react.page.locator('[data-parity-target="button-icon-right"] .semi-button-content-left'),
      ['marginLeft', 'marginRight'],
    ),
    captureComputedStyle(
      pair.vue.page.locator('[data-parity-target="button-icon-right"] .semi-button-content-left'),
      ['marginLeft', 'marginRight'],
    ),
  ]);
  expect(vueIconSpacing).toEqual(reactIconSpacing);
  expect(reactIconSpacing).toEqual({ marginLeft: '8px', marginRight: '0px' });

  const [reactAnimation, vueAnimation] = await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      page
        .locator('[data-parity-target="button-loading"] [data-icon="spin"]')
        .evaluate((element) => {
          const animation = element.getAnimations()[0];
          return {
            duration: animation?.effect?.getTiming().duration,
            iterations: animation?.effect?.getTiming().iterations,
          };
        }),
    ),
  );
  expect(vueAnimation).toEqual(reactAnimation);
  expect(reactAnimation).toEqual({ duration: 600, iterations: Infinity });
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Button React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'button-types',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('button-types-reference');
      const vueTarget = pair.vue.page.getByTestId('button-types-vue');
      await expect(reactTarget).toHaveScreenshot(
        `button-types-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`button-types-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('PinCode 固定源码场景保留尺寸、格式、禁用、焦点、键盘与粘贴契约', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'pin-code',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('pin-code').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('pin-code').targets) {
    await expectComparableTarget(pair, 'pin-code', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const scenario = parityPage.locator('.pin-code-scenario');
    await expect(scenario.locator('.semi-pincode-wrapper')).toHaveCount(6);
    await expect(scenario.locator('input')).toHaveCount(34);
    await expect(scenario.locator('.pin-code-target-small input')).toHaveCount(6);
    await expect(scenario.locator('.pin-code-target-small input').first()).toHaveAttribute(
      'inputmode',
      'numeric',
    );
    await expect(scenario.locator('.pin-code-target-mixed input').first()).toHaveAttribute(
      'inputmode',
      'text',
    );
    await expect(scenario.locator('.pin-code-target-disabled input').first()).toBeDisabled();
    await expect(scenario.locator('.pin-code-target-large input').first()).toBeFocused();
    await expect(scenario.locator('.pin-code-target-default input').nth(2)).toHaveValue('3');
  }

  const reactEmpty = pair.react.page.locator('.pin-code-target-empty input');
  const vueEmpty = pair.vue.page.locator('.pin-code-target-empty input');
  await Promise.all([reactEmpty.first().fill('7'), vueEmpty.first().fill('7')]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：7'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：7'),
    expect(reactEmpty.nth(1)).toBeFocused(),
    expect(vueEmpty.nth(1)).toBeFocused(),
  ]);

  await Promise.all([reactEmpty.nth(1).press('Backspace'), vueEmpty.nth(1).press('Backspace')]);
  await Promise.all([
    expect(reactEmpty.first()).toBeFocused(),
    expect(vueEmpty.first()).toBeFocused(),
  ]);

  await Promise.all([reactEmpty.nth(1).focus(), vueEmpty.nth(1).focus()]);
  await Promise.all(
    [reactEmpty.nth(1), vueEmpty.nth(1)].map((target) =>
      target.evaluate((element) => {
        const clipboardData = new DataTransfer();
        clipboardData.setData('text', '23456');
        element.dispatchEvent(
          new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData }),
        );
      }),
    ),
  );
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：723456'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：723456'),
  ]);

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`PinCode React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'pin-code',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('pin-code-reference');
      const vueTarget = pair.vue.page.getByTestId('pin-code-vue');
      await expect(reactTarget).toHaveScreenshot(`pin-code-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`pin-code-vue-${viewportName}-${theme}.png`);
    });
  }
}

test('PinCode React/Vue RTL 基线截图', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'pin-code',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('pin-code-reference');
  const vueTarget = pair.vue.page.getByTestId('pin-code-vue');
  await expect(reactTarget).toHaveScreenshot('pin-code-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('pin-code-vue-light-rtl.png');
});

test('Tooltip 参考场景来自本地 v2.102.0 并保留 Portal、箭头与 placement', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'tooltip',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.tooltipPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'tooltip')).toBe(true);
  await expect(page.getByTestId('tooltip-reference').locator('.semi-portal')).toHaveCount(4);
  await expect(page.locator('.semi-tooltip-wrapper-show')).toHaveCount(4);
  for (const position of ['top', 'right', 'bottom', 'left'] as const) {
    const popup = page.locator(`.tooltip-target-${position}`);
    await expect(popup).toHaveAttribute('x-placement', position);
    await expect(popup.locator('.semi-tooltip-icon-arrow')).toHaveCount(1);
    await expect(
      page.locator(`[data-parity-target="tooltip-trigger-${position}"]`),
    ).toHaveAttribute('aria-describedby', `tooltip-${position}`);
  }
  expect(runtimeErrors).toEqual([]);
});

test('Tooltip React/Vue 定位、hover、click、outside 与 disabled trigger 契约一致', async ({
  context,
}) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tooltip',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('tooltip').targets) {
    await expectComparableTarget(pair, 'tooltip', target.id);
  }

  const reactDisabled = pair.react.page.locator('[data-parity-target="tooltip-trigger-disabled"]');
  const vueDisabled = pair.vue.page.locator('[data-parity-target="tooltip-trigger-disabled"]');
  await Promise.all([expect(reactDisabled).toBeDisabled(), expect(vueDisabled).toBeDisabled()]);
  const [reactDisabledParent, vueDisabledParent] = await Promise.all([
    reactDisabled.evaluate((element) => element.parentElement?.className),
    vueDisabled.evaluate((element) => element.parentElement?.className),
  ]);
  expect(vueDisabledParent).toBe(reactDisabledParent);

  const reactHover = pair.react.page.locator('[data-parity-target="tooltip-trigger-hover"]');
  const vueHover = pair.vue.page.locator('[data-parity-target="tooltip-trigger-hover"]');
  await Promise.all([reactHover.hover(), vueHover.hover()]);
  await Promise.all([
    expect(pair.react.page.locator('#tooltip-hover')).toBeVisible(),
    expect(pair.vue.page.locator('#tooltip-hover')).toBeVisible(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：hover:true'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：hover:true'),
  ]);

  const reactClick = pair.react.page.locator('[data-parity-target="tooltip-trigger-click"]');
  const vueClick = pair.vue.page.locator('[data-parity-target="tooltip-trigger-click"]');
  await Promise.all([reactClick.click(), vueClick.click()]);
  await Promise.all([
    expect(pair.react.page.locator('#tooltip-click')).toBeVisible(),
    expect(pair.vue.page.locator('#tooltip-click')).toBeVisible(),
  ]);
  await Promise.all([
    pair.react.page.locator('.tooltip-scenario__section h3').first().click(),
    pair.vue.page.locator('.tooltip-scenario__section h3').first().click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('#tooltip-click')).toHaveCount(0),
    expect(pair.vue.page.locator('#tooltip-click')).toHaveCount(0),
  ]);

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Tooltip React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'tooltip',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all([pair.react.page.waitForTimeout(100), pair.vue.page.waitForTimeout(100)]);

      const reactTarget = pair.react.page.getByTestId('tooltip-reference');
      const vueTarget = pair.vue.page.getByTestId('tooltip-vue');
      await Promise.all([reactTarget.scrollIntoViewIfNeeded(), vueTarget.scrollIntoViewIfNeeded()]);
      await Promise.all([pair.react.page.waitForTimeout(100), pair.vue.page.waitForTimeout(100)]);
      await expect(reactTarget).toHaveScreenshot(`tooltip-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`tooltip-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Tooltip React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tooltip',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('tooltip-reference');
  const vueTarget = pair.vue.page.getByTestId('tooltip-vue');
  await expect(reactTarget).toHaveScreenshot('tooltip-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('tooltip-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

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

test('Select 参考场景来自本地 v2.102.0 并保留 Option、分组与 Portal', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'select',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.selectPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'select')).toBe(true);
  const scenario = page.getByTestId('select-reference');
  await expect(scenario.locator('.semi-select')).toHaveCount(5);
  await expect(scenario.locator('[data-parity-target="select-disabled"]')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(scenario.locator('.semi-tag')).toHaveCount(3);
  await expect(scenario.locator('.semi-select-option-list-wrapper')).toBeVisible();
  await expect(scenario.locator('.semi-select-group')).toHaveCount(2);
  expect(runtimeErrors).toEqual([]);
});

test('Select React/Vue 基础状态、搜索、键盘与选择事件契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'select',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('select').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'select', target.id);
    });
  }

  const reactInput = pair.react.page.locator('[data-parity-target="select-filter"] input');
  const vueInput = pair.vue.page.locator('[data-parity-target="select-filter"] input');
  await Promise.all([reactInput.fill('Kor'), vueInput.fill('Kor')]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-select-option-list [role="option"]')).toHaveCount(1),
    expect(pair.vue.page.locator('.semi-select-option-list [role="option"]')).toHaveCount(1),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-select-option-keyword')).toHaveText('Kor'),
    expect(pair.vue.page.locator('.semi-select-option-keyword')).toHaveText('Kor'),
  ]);
  await Promise.all([reactInput.press('ArrowDown'), vueInput.press('ArrowDown')]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-select-option-focused')).toHaveCount(1),
    expect(pair.vue.page.locator('.semi-select-option-focused')).toHaveCount(1),
  ]);
  await Promise.all([reactInput.press('Enter'), vueInput.press('Enter')]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近选择：korea'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近选择：korea'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Select React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'select',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('select-reference');
      const vueTarget = pair.vue.page.getByTestId('select-vue');
      await expect(reactTarget).toHaveScreenshot(`select-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`select-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Select React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'select',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('select-reference');
  const vueTarget = pair.vue.page.getByTestId('select-vue');
  await Promise.all([
    expect(reactTarget.locator('.semi-tag-group.semi-tag-group-max')).toHaveCount(1),
    expect(vueTarget.locator('.semi-tag-group.semi-tag-group-max')).toHaveCount(1),
  ]);
  await expect(reactTarget).toHaveScreenshot('select-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('select-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

test('ConfigProvider 参考场景来自本地 v2.102.0 并保留 Context 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'config-provider',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.configProviderPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'config-provider')).toBe(true);
  const scenario = page.getByTestId('config-provider-reference');
  await expect(scenario.locator(':scope > .semi-rtl')).toHaveCount(1);
  await expect(scenario.locator('[data-parity-target="config-provider-direction"]')).toHaveText(
    'direction: rtl',
  );
  await expect(scenario).toContainText('locale: en-US');
  await expect(scenario).toContainText('timeZone: Asia/Shanghai');
  await expect(scenario.locator('[data-parity-target="config-provider-nested"]')).toHaveText(
    'nested: ltr',
  );
  await expect(scenario.getByRole('button', { name: 'Copy' })).toHaveCount(1);
  await expect(scenario.locator('[data-parity-target="config-provider-screens"]')).toHaveText(
    'screens: sm,md,lg,xl',
  );
  expect(runtimeErrors).toEqual([]);
});

test('ConfigProvider RTL、Locale、Consumer、嵌套上下文与断点行为一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'config-provider',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('config-provider').targets).toHaveLength(5);
  for (const target of assertScenarioComparable('config-provider').targets) {
    await expectComparableTarget(pair, 'config-provider', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const scenario = parityPage.locator('[data-parity-scenario="config-provider"]');
    await expect(scenario.locator('.config-provider-scenario > .semi-rtl')).toHaveCount(1);
    await expect(scenario.locator('[data-parity-target="config-provider-screens"]')).toHaveText(
      'screens: sm,md,lg,xl',
    );
  }

  const reactCopy = pair.react.page.getByRole('button', { name: 'Copy' });
  const vueCopy = pair.vue.page.getByRole('button', { name: 'Copy' });
  await Promise.all([reactCopy.press('Enter'), vueCopy.press('Enter')]);
  await Promise.all([
    expect(pair.react.page.locator('[data-parity-target="config-provider-locale"]')).toContainText(
      'Copied',
    ),
    expect(pair.vue.page.locator('[data-parity-target="config-provider-locale"]')).toContainText(
      'Copied',
    ),
  ]);

  await Promise.all([
    pair.react.page.setViewportSize({ width: 390, height: 844 }),
    pair.vue.page.setViewportSize({ width: 390, height: 844 }),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('[data-parity-target="config-provider-screens"]')).toHaveText(
      'screens: xs',
    ),
    expect(pair.vue.page.locator('[data-parity-target="config-provider-screens"]')).toHaveText(
      'screens: xs',
    ),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`ConfigProvider React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'config-provider',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('config-provider-reference');
      const vueTarget = pair.vue.page.getByTestId('config-provider-vue');
      await expect(reactTarget).toHaveScreenshot(
        `config-provider-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`config-provider-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Switch 参考场景来自本地 v2.102.0 并保留原生控件与状态 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'switch',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.switchPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'switch')).toBe(true);
  const scenario = page.getByTestId('switch-reference');
  await expect(scenario.locator('.semi-switch')).toHaveCount(11);
  await expect(scenario.locator('input[type="checkbox"][role="switch"]')).toHaveCount(11);
  await expect(page.locator('[data-parity-target="switch-small"]')).toHaveClass(
    /semi-switch-small/,
  );
  await expect(page.locator('[data-parity-target="switch-loading"]')).toHaveClass(
    /semi-switch-loading/,
  );
  await expect(
    page.locator('[data-parity-target="switch-loading"] [data-icon="spin"]'),
  ).toBeVisible();
  await expect(page.getByRole('switch', { name: '禁用关闭' })).toBeDisabled();
  expect(runtimeErrors).toEqual([]);
});

test('Switch 受控/非受控、键盘焦点、加载、样式与 RTL 契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'switch',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('switch').targets).toHaveLength(11);
  for (const target of assertScenarioComparable('switch').targets) {
    await expectComparableTarget(pair, 'switch', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const defaultSwitch = parityPage.getByRole('switch', { name: '默认关闭' });
    await defaultSwitch.click();
    await expect(parityPage.locator('[data-parity-target="switch-default"]')).toHaveClass(
      /semi-switch-checked/,
    );
    await expect(parityPage.getByRole('status')).toHaveText('最近变化：default:true');

    const controlled = parityPage.getByRole('switch', { name: '受控开关' });
    await parityPage.getByRole('switch', { name: '关闭文本' }).focus();
    await parityPage.keyboard.press('Tab');
    await expect(controlled).toBeFocused();
    await expect(parityPage.locator('[data-parity-target="switch-controlled"]')).toHaveClass(
      /semi-switch-focus/,
    );
    await parityPage.keyboard.press('Space');
    await expect(parityPage.locator('[data-parity-target="switch-controlled"]')).toHaveClass(
      /semi-switch-checked/,
    );
    await expect(parityPage.getByRole('status')).toHaveText('最近变化：controlled:true');
    await expect(parityPage.getByRole('switch', { name: '加载关闭' })).toBeDisabled();
    await expect(parityPage.getByRole('switch', { name: '禁用开启' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  }

  const [reactRtlKnob, vueRtlKnob] = await Promise.all([
    captureComputedStyle(
      pair.react.page.locator('[data-parity-target="switch-checked"] .semi-switch-knob'),
      ['left', 'right', 'transform'],
    ),
    captureComputedStyle(
      pair.vue.page.locator('[data-parity-target="switch-checked"] .semi-switch-knob'),
      ['left', 'right', 'transform'],
    ),
  ]);
  expect(vueRtlKnob).toEqual(reactRtlKnob);

  const [reactAnimation, vueAnimation] = await Promise.all(
    [pair.react.page, pair.vue.page].map((parityPage) =>
      parityPage
        .locator('[data-parity-target="switch-loading"] [data-icon="spin"]')
        .evaluate((element) => {
          const animation = element.getAnimations()[0];
          return {
            duration: animation?.effect?.getTiming().duration,
            iterations: animation?.effect?.getTiming().iterations,
          };
        }),
    ),
  );
  expect(vueAnimation).toEqual(reactAnimation);
  expect(reactAnimation).toEqual({ duration: 600, iterations: Infinity });
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Switch React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'switch',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('switch-reference');
      const vueTarget = pair.vue.page.getByTestId('switch-vue');
      await expect(reactTarget).toHaveScreenshot(`switch-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`switch-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Switch React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'switch',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('switch-reference');
  const vueTarget = pair.vue.page.getByTestId('switch-vue');
  await expect(reactTarget).toHaveScreenshot('switch-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('switch-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

test('Typography 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'typography',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.typographyPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'typography')).toBe(true);
  const scenario = page.getByTestId('typography-reference');
  await expect(scenario.locator('.semi-typography')).toHaveCount(17);
  await expect(scenario.locator('h2.semi-typography-h2')).toHaveCount(1);
  await expect(scenario.locator('.semi-typography-paragraph')).toHaveCount(2);
  await expect(scenario.locator('.semi-typography-action-copy')).toHaveCount(1);
  await expect(scenario.locator('[data-parity-target="typography-numeral"]')).toHaveText(
    '1.50 KiB',
  );
  expect(runtimeErrors).toEqual([]);
});

test('Typography 标题、装饰、链接、数值、复制、样式和几何契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'typography',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  await Promise.all(
    [pair.react.page, pair.vue.page].map((parityPage) =>
      expect(
        parityPage.locator('[data-parity-target="typography-js-ellipsis"] > span').first(),
      ).toHaveText('Expandable typography content ...'),
    ),
  );
  expect(assertScenarioComparable('typography').targets).toHaveLength(10);
  for (const target of assertScenarioComparable('typography').targets) {
    await expectComparableTarget(pair, 'typography', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const decorated = parityPage.locator('[data-parity-target="typography-decorated"]');
    await expect(decorated.locator('del > strong > u > code > mark')).toHaveText('Decorated text');
    await expect(parityPage.locator('[data-parity-target="typography-link"] > a')).toHaveAttribute(
      'href',
      '#typography',
    );
    await expect(
      parityPage.locator('[data-parity-target="typography-disabled-link"] > span'),
    ).toHaveText('Disabled link');
    await expect(parityPage.locator('[data-parity-target="typography-numeral"]')).toHaveText(
      '1.50 KiB',
    );
  }

  const reactCopy = pair.react.page
    .locator('[data-parity-target="typography-copyable"]')
    .getByRole('button');
  const vueCopy = pair.vue.page
    .locator('[data-parity-target="typography-copyable"]')
    .getByRole('button');
  await Promise.all([reactCopy.press('Enter'), vueCopy.press('Enter')]);
  await Promise.all([
    expect(pair.react.page.locator('[data-parity-target="typography-copyable"]')).toContainText(
      '复制成功',
    ),
    expect(pair.vue.page.locator('[data-parity-target="typography-copyable"]')).toContainText(
      '复制成功',
    ),
  ]);

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const cssEllipsis = parityPage.locator('[data-parity-target="typography-css-ellipsis"]');
    await cssEllipsis.hover();
    await expect(parityPage.locator('[role="tooltip"]')).toContainText(
      'Typography ellipsis tooltip contains the complete original content.',
    );
    await parityPage.mouse.move(0, 0);

    const jsEllipsis = parityPage.locator('[data-parity-target="typography-js-ellipsis"]');
    const expand = jsEllipsis.getByRole('button', { name: '展开' });
    await expand.press('Enter');
    await expect(jsEllipsis).toContainText(
      'Expandable typography content keeps keyboard and collapse behavior aligned.',
    );
    await jsEllipsis.getByRole('button', { name: '收起' }).press('Enter');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Typography React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'typography',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all(
        [pair.react.page, pair.vue.page].map(async (parityPage) => {
          const jsEllipsis = parityPage.locator('[data-parity-target="typography-js-ellipsis"]');
          await jsEllipsis.getByRole('button', { name: '展开' }).press('Enter');
          await expect(jsEllipsis.getByRole('button', { name: '收起' })).toBeVisible();
        }),
      );

      const reactTarget = pair.react.page.getByTestId('typography-reference');
      const vueTarget = pair.vue.page.getByTestId('typography-vue');
      await expect(reactTarget).toHaveScreenshot(
        `typography-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`typography-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Space 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'space',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.spacePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'space')).toBe(true);
  await expect(page.getByTestId('space-reference').locator('.semi-space')).toHaveCount(10);
  await expect(page.locator('[data-parity-target="space-tight"]')).toHaveAttribute(
    'x-semi-prop',
    'children',
  );
  await expect(page.locator('[data-parity-target="space-array-wrap"]')).toHaveClass(
    /semi-space-wrap/,
  );
  await expect(page.locator('[data-parity-target="space-vertical"]')).toHaveClass(
    /semi-space-vertical/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Space 间距、方向、换行、对齐与 RTL 契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'space',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('space').targets).toHaveLength(10);
  for (const target of assertScenarioComparable('space').targets) {
    await expectComparableTarget(pair, 'space', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="space-tight"]')).toHaveCSS(
      'column-gap',
      '8px',
    );
    await expect(parityPage.locator('[data-parity-target="space-medium"]')).toHaveCSS(
      'row-gap',
      '16px',
    );
    await expect(parityPage.locator('[data-parity-target="space-loose"]')).toHaveCSS(
      'column-gap',
      '24px',
    );
    await expect(parityPage.locator('[data-parity-target="space-number"]')).toHaveCSS(
      'row-gap',
      '12px',
    );
    await expect(parityPage.locator('[data-parity-target="space-array-wrap"]')).toHaveCSS(
      'row-gap',
      '20px',
    );
    await expect(parityPage.locator('[data-parity-target="space-vertical"]')).toHaveCSS(
      'flex-direction',
      'column',
    );
    await expect(parityPage.locator('[data-parity-target="space-align-baseline"]')).toHaveCSS(
      'align-items',
      'baseline',
    );
    await expect(parityPage.locator('[data-parity-target="space-align-start"]')).toHaveCSS(
      'direction',
      'rtl',
    );
  }

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Space React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'space',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('space-reference');
      const vueTarget = pair.vue.page.getByTestId('space-vue');
      await expect(reactTarget).toHaveScreenshot(`space-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`space-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Space React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'space',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('space-reference');
  const vueTarget = pair.vue.page.getByTestId('space-vue');
  await expect(reactTarget).toHaveScreenshot('space-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('space-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot(),
    vueTarget.screenshot(),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

test('FloatButton 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'float-button',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.floatButtonPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'float-button')).toBe(true);
  await expect(page.getByTestId('float-button-reference').locator('.semi-floatButton')).toHaveCount(
    7,
  );
  await expect(page.locator('.float-button-target-colorful')).toHaveClass(/semi-floatButton-round/);
  await expect(page.locator('.float-button-target-colorful > .semi-floatButton-body')).toHaveClass(
    /semi-floatButton-colorful/,
  );
  await expect(page.locator('.float-button-target-badge .semi-badge-count')).toHaveText('99+');
  expect(runtimeErrors).toEqual([]);
});

test('FloatButton 尺寸、状态、Badge、Group 事件与可访问性契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'float-button',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('float-button').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('float-button').targets) {
    await expectComparableTarget(pair, 'float-button', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const defaultButton = parityPage.locator('.float-button-target-default');
    await expect(defaultButton).toHaveCSS('width', '32px');
    await expect(parityPage.locator('.float-button-target-small')).toHaveCSS('height', '24px');
    await expect(parityPage.locator('.float-button-target-large')).toHaveCSS('height', '40px');
    await expect(defaultButton).toHaveJSProperty('tagName', 'DIV');
    await expect(defaultButton).toHaveJSProperty('tabIndex', -1);

    await defaultButton.click();
    await expect(parityPage.getByRole('status')).toHaveText('最近操作：default');
    await parityPage.locator('.float-button-target-disabled').click();
    await expect(parityPage.getByRole('status')).toHaveText('最近操作：default');
    await parityPage
      .locator('.float-button-target-group .semi-floatButtonGroup-item')
      .first()
      .dispatchEvent('click');
    await expect(parityPage.getByRole('status')).toHaveText('最近操作：support');
  }

  await Promise.all([
    pair.react.page.locator('.float-button-target-default .semi-floatButton-body').hover(),
    pair.vue.page.locator('.float-button-target-default .semi-floatButton-body').hover(),
  ]);
  const [reactHover, vueHover] = await Promise.all([
    captureComputedStyle(
      pair.react.page.locator('.float-button-target-default .semi-floatButton-body'),
      ['backgroundColor'],
    ),
    captureComputedStyle(
      pair.vue.page.locator('.float-button-target-default .semi-floatButton-body'),
      ['backgroundColor'],
    ),
  ]);
  expect(vueHover).toEqual(reactHover);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`FloatButton React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'float-button',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('float-button-reference');
      const vueTarget = pair.vue.page.getByTestId('float-button-vue');
      await expect(reactTarget).toHaveScreenshot(
        `float-button-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`float-button-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('FloatButton React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'float-button',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('float-button-reference');
  const vueTarget = pair.vue.page.getByTestId('float-button-vue');
  await expect(reactTarget).toHaveScreenshot('float-button-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('float-button-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot(),
    vueTarget.screenshot(),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

test('Layout 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'layout',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.layoutPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'layout')).toBe(true);
  await expect(page.getByTestId('layout-reference').locator('.semi-layout')).toHaveCount(4);
  await expect(page.locator('[data-parity-target="layout-with-sider"]')).toHaveClass(
    /semi-layout-has-sider/,
  );
  await expect(page.locator('[data-parity-target="layout-sider"]')).toHaveAttribute(
    'data-breakpoint-source',
    'layout',
  );
  await expect(page.locator('[data-parity-target="layout-sider"] > div')).toHaveClass(
    /semi-layout-sider-children/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Layout 语义、嵌套、Sider 与响应式断点契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'layout',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('layout').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('layout').targets) {
    await expectComparableTarget(pair, 'layout', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="layout-vertical"]')).toHaveCSS(
      'flex-direction',
      'column',
    );
    await expect(parityPage.locator('[data-parity-target="layout-with-sider"]')).toHaveCSS(
      'flex-direction',
      'row',
    );
    await expect(parityPage.locator('[data-parity-target="layout-with-sider"]')).toHaveCSS(
      'direction',
      'rtl',
    );
    await expect(parityPage.locator('[data-parity-target="layout-sider"]')).toHaveCSS(
      'position',
      'relative',
    );
    await expect(parityPage.locator('[data-parity-target="layout-semantic"]')).toHaveJSProperty(
      'tagName',
      'ARTICLE',
    );
    await expect(parityPage.locator('[data-parity-target="layout-semantic"]')).toHaveAttribute(
      'role',
      'region',
    );
    await expect(parityPage.locator('[data-parity-target="layout-sider"]')).toHaveAttribute(
      'aria-label',
      '演示侧边栏',
    );
    await expect(parityPage.getByRole('status')).toHaveText('xs:false · md:true');
  }

  await Promise.all([
    pair.react.page.setViewportSize({ width: 390, height: 844 }),
    pair.vue.page.setViewportSize({ width: 390, height: 844 }),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('xs:true · md:false'),
    expect(pair.vue.page.getByRole('status')).toHaveText('xs:true · md:false'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Layout React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'layout',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('layout-reference');
      const vueTarget = pair.vue.page.getByTestId('layout-vue');
      await expect(reactTarget).toHaveScreenshot(`layout-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`layout-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Layout React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'layout',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('layout-reference');
  const vueTarget = pair.vue.page.getByTestId('layout-vue');
  await expect(reactTarget).toHaveScreenshot('layout-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('layout-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot(),
    vueTarget.screenshot(),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

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
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
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
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

test('Resizable 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'resizable',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.resizablePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'resizable')).toBe(true);
  const scenario = page.getByTestId('resizable-reference');
  await expect(scenario.locator('.semi-resizable-resizable')).toHaveCount(1);
  await expect(scenario.locator('.semi-resizable-resizableHandler')).toHaveCount(8);
  await expect(scenario.locator('.semi-resizable-group')).toHaveCount(2);
  await expect(scenario.locator('.semi-resizable-item')).toHaveCount(4);
  await expect(scenario.locator('.semi-resizable-handler')).toHaveCount(2);
  for (const handle of await scenario.locator('.semi-resizable-resizableHandler').all()) {
    await expect(handle).not.toHaveAttribute('role');
    await expect(handle).not.toHaveAttribute('tabindex');
  }
  expect(runtimeErrors).toEqual([]);
});

test('Resizable 单体与组合拖拽、约束、回调、样式和几何契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'resizable',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('resizable').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('resizable').targets) {
    await expectComparableTarget(pair, 'resizable', target.id);
  }

  async function dragSingle(page: typeof pair.react.page): Promise<number> {
    const root = page.locator('[data-parity-target="resizable-single"]');
    const handle = root.locator('.semi-resizable-resizableHandler-right');
    const box = await handle.boundingBox();
    if (!box) throw new Error('Resizable 右侧手柄不可测量');
    await handle.dispatchEvent('mousedown', {
      button: 0,
      clientX: box.x + box.width / 2,
      clientY: box.y + box.height / 2,
    });
    await expect(root.locator('.semi-resizable-background')).toBeVisible();
    await page.mouse.move(box.x + box.width / 2 + 48, box.y + box.height / 2);
    await expect(root).toContainText('Resizing');
    await page.mouse.up();
    await expect(root).toContainText('Drag edge to resize');
    return (await root.boundingBox())?.width ?? 0;
  }

  const [reactSingleWidth, vueSingleWidth] = await Promise.all([
    dragSingle(pair.react.page),
    dragSingle(pair.vue.page),
  ]);
  expect(Math.abs(vueSingleWidth - reactSingleWidth)).toBeLessThanOrEqual(0.5);

  async function dragGroup(page: typeof pair.react.page): Promise<readonly [number, number]> {
    const group = page.locator('[data-parity-target="resize-group-horizontal"]');
    const handler = page.locator('.resizable-target-handler-horizontal');
    const items = group.locator('.semi-resizable-item');
    const box = await handler.boundingBox();
    if (!box) throw new Error('ResizeGroup 水平手柄不可测量');
    await handler.dispatchEvent('mousedown', {
      button: 0,
      clientX: box.x + box.width / 2,
      clientY: box.y + box.height / 2,
    });
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    );
    await page.mouse.move(box.x + box.width / 2 + 36, box.y + box.height / 2);
    await expect(items.first()).toContainText('Resizing');
    await page.mouse.up();
    await expect(items.first()).toContainText('Drag divider to resize');
    const [first, second] = await Promise.all([
      items.nth(0).boundingBox(),
      items.nth(1).boundingBox(),
    ]);
    return [first?.width ?? 0, second?.width ?? 0];
  }

  const [reactGroupWidths, vueGroupWidths] = await Promise.all([
    dragGroup(pair.react.page),
    dragGroup(pair.vue.page),
  ]);
  expect(Math.abs(vueGroupWidths[0] - reactGroupWidths[0])).toBeLessThanOrEqual(0.5);
  expect(Math.abs(vueGroupWidths[1] - reactGroupWidths[1])).toBeLessThanOrEqual(0.5);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Resizable React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'resizable',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('resizable-reference');
      const vueTarget = pair.vue.page.getByTestId('resizable-vue');
      await expect(reactTarget).toHaveScreenshot(
        `resizable-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`resizable-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

for (const { theme, direction } of [
  { theme: 'light', direction: 'ltr' },
  { theme: 'dark', direction: 'ltr' },
  { theme: 'light', direction: 'rtl' },
] as const) {
  test(`Button contract React/Vue 截图：${theme}/${direction}`, async ({ context }) => {
    const pair = await openParityPages(context, {
      scenarioId: 'button-contract',
      theme,
      direction,
      locale: 'zh-CN',
    });
    const reactTarget = pair.react.page.getByTestId('button-contract-reference');
    const vueTarget = pair.vue.page.getByTestId('button-contract-vue');
    await expect(reactTarget).toHaveScreenshot(
      `button-contract-reference-${theme}-${direction}.png`,
    );
    await expect(vueTarget).toHaveScreenshot(`button-contract-vue-${theme}-${direction}.png`);
    const [reactScreenshot, vueScreenshot] = await Promise.all([
      reactTarget.screenshot({ animations: 'disabled' }),
      vueTarget.screenshot({ animations: 'disabled' }),
    ]);
    expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  });
}

test('Divider 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'divider',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.dividerPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'divider')).toBe(true);
  await expect(page.getByTestId('divider-reference').locator('.semi-divider')).toHaveCount(8);
  await expect(page.getByRole('separator', { name: '章节分隔' })).toHaveClass(
    /semi-divider-horizontal/,
  );
  await expect(page.getByRole('separator', { name: '操作分隔' })).toHaveAttribute(
    'aria-orientation',
    'vertical',
  );
  await expect(page.locator('[data-parity-target="divider-content-left"]')).toHaveClass(
    /semi-divider-with-text-left/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Divider 水平、垂直、虚线、内容与 RTL 契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'divider',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('divider').targets) {
    await expectComparableTarget(pair, 'divider', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-scenario="divider"]')).toHaveClass(/semi-rtl/);
    await expect(parityPage.locator('[data-parity-target="divider-horizontal-dashed"]')).toHaveCSS(
      'border-bottom-style',
      'dashed',
    );
    await expect(parityPage.locator('[data-parity-target="divider-vertical-dashed"]')).toHaveCSS(
      'border-left-style',
      'dashed',
    );
    await expect(parityPage.getByRole('separator', { name: '章节分隔' })).toBeVisible();
    await expect(parityPage.getByRole('separator', { name: '操作分隔' })).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  }

  const readPseudoLineWidths = (selector: string) => {
    const read = (page: typeof pair.react.page) =>
      page.locator(selector).evaluate((element) => ({
        afterWidth: getComputedStyle(element, '::after').width,
        beforeWidth: getComputedStyle(element, '::before').width,
      }));
    return Promise.all([read(pair.react.page), read(pair.vue.page)]);
  };
  const [reactLeft, vueLeft] = await readPseudoLineWidths(
    '[data-parity-target="divider-content-left"]',
  );
  const [reactRight, vueRight] = await readPseudoLineWidths(
    '[data-parity-target="divider-content-right"]',
  );
  expect(vueLeft).toEqual(reactLeft);
  expect(vueRight).toEqual(reactRight);
  expect(reactLeft.beforeWidth).toBe('40px');
  expect(reactRight.afterWidth).toBe('40px');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Divider React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'divider',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('divider-reference');
      const vueTarget = pair.vue.page.getByTestId('divider-vue');
      await expect(reactTarget).toHaveScreenshot(`divider-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`divider-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Divider React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'divider',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('divider-reference');
  const vueTarget = pair.vue.page.getByTestId('divider-vue');
  await expect(reactTarget).toHaveScreenshot('divider-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('divider-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot(),
    vueTarget.screenshot(),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

test('Icon 参考场景来自本地 v2.102.0 公开源码并保留 DOM 与无障碍契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'icon',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.iconPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'icon')).toBe(true);
  await expect(page.getByTestId('icon-reference').locator('.semi-icon')).toHaveCount(12);
  await expect(page.getByRole('img', { name: '首页图标 extra-small' })).toHaveClass(
    /semi-icon-extra-small/,
  );
  await expect(page.getByRole('img', { name: '加载中' })).toHaveClass(/semi-icon-spinning/);
  await expect(page.getByRole('img', { name: 'Lab 头像' }).locator('svg')).toHaveCount(1);
  await expect(page.getByRole('img', { name: '自定义圆点' })).toHaveClass(/semi-icon-custom-dot/);
  expect(runtimeErrors).toEqual([]);
});

test('Icon 尺寸、旋转、动画、颜色、AI fill 与 Lab 契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'icon',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('icon').targets).toHaveLength(11);
  for (const target of assertScenarioComparable('icon').targets) {
    await expectComparableTarget(pair, 'icon', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="icon-size-extra-small"]')).toHaveCSS(
      'font-size',
      '8px',
    );
    await expect(parityPage.locator('[data-parity-target="icon-size-extra-large"]')).toHaveCSS(
      'font-size',
      '24px',
    );
    await expect(parityPage.locator('[data-parity-target="icon-rotate"]')).toHaveCSS(
      'transform',
      'matrix(-1, 0, 0, -1, 0, 0)',
    );
    const bicolorPaths = parityPage.locator('[data-parity-target="icon-bicolor"] path');
    await expect(bicolorPaths.nth(0)).toHaveAttribute('fill', '#0064fa');
    await expect(bicolorPaths.nth(1)).toHaveAttribute('fill', '#15c39a');
  }

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Icon React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'icon',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('icon-reference');
      const vueTarget = pair.vue.page.getByTestId('icon-vue');
      await expect(reactTarget).toHaveScreenshot(`icon-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`icon-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

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
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
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
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

test('Radio 参考场景来自本地 v2.102.0 并保留单项、组、ARIA、按钮与卡片 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'radio',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.radioPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'radio')).toBe(true);
  const scenario = page.getByTestId('radio-reference');
  await expect(scenario.locator('.semi-radio')).toHaveCount(14);
  await expect(scenario.locator('.semi-radioGroup-horizontal')).toHaveCount(1);
  await expect(scenario.locator('.semi-radioGroup-buttonRadio')).toHaveCount(1);
  await expect(scenario.locator('.semi-radio-cardRadioGroup')).toHaveCount(4);
  await expect(scenario.locator('.semi-radio-inner-pureCardRadio')).toHaveCount(2);
  await expect(scenario.locator('[data-parity-target="radio-disabled"] input')).toBeDisabled();
  await expect(scenario.locator('[data-parity-target="radio-extra"] input')).toHaveAttribute(
    'aria-describedby',
    /extra/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Radio React/Vue 样式、几何、键盘、焦点与事件一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'radio',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('radio').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('radio').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'radio', target.id);
    });
  }

  await Promise.all([pair.react.page.keyboard.press('Tab'), pair.vue.page.keyboard.press('Tab')]);
  const reactBasic = pair.react.page.locator('[data-parity-target="radio-basic"]');
  const vueBasic = pair.vue.page.locator('[data-parity-target="radio-basic"]');
  await Promise.all([
    expect(reactBasic.locator('input')).toBeFocused(),
    expect(vueBasic.locator('input')).toBeFocused(),
    expect(reactBasic.locator('.semi-radio-inner-display')).toHaveClass(/semi-radio-focus/),
    expect(vueBasic.locator('.semi-radio-inner-display')).toHaveClass(/semi-radio-focus/),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('Space'),
    pair.vue.page.keyboard.press('Space'),
  ]);
  await Promise.all([
    expect(reactBasic.locator('input')).toBeChecked(),
    expect(vueBasic.locator('input')).toBeChecked(),
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：single:true'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：single:true'),
  ]);

  const reactGroupItem = pair.react.page
    .locator('[data-parity-target="radio-group"] .semi-radio')
    .nth(1);
  const vueGroupItem = pair.vue.page
    .locator('[data-parity-target="radio-group"] .semi-radio')
    .nth(1);
  await Promise.all([reactGroupItem.click(), vueGroupItem.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：group:Semi DSM'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：group:Semi DSM'),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('ArrowRight'),
    pair.vue.page.keyboard.press('ArrowRight'),
  ]);
  await Promise.all([
    expect(
      pair.react.page.locator('[data-parity-target="radio-group"] input').nth(2),
    ).toBeChecked(),
    expect(pair.vue.page.locator('[data-parity-target="radio-group"] input').nth(2)).toBeChecked(),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Radio React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'radio',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('radio-reference');
      const vueTarget = pair.vue.page.getByTestId('radio-vue');
      await expect(reactTarget).toHaveScreenshot(`radio-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`radio-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Radio React/Vue RTL 样式与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'radio',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('radio').targets) {
    await expectComparableTarget(pair, 'radio', target.id);
  }
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="radio-basic"]')).toHaveCSS(
      'direction',
      'rtl',
    );
    await expect(parityPage.locator('[data-parity-target="radio-group"]')).toHaveCSS(
      'direction',
      'rtl',
    );
  }
  const reactTarget = pair.react.page.getByTestId('radio-reference');
  const vueTarget = pair.vue.page.getByTestId('radio-vue');
  await expect(reactTarget).toHaveScreenshot('radio-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('radio-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

test('Rating 参考场景来自本地 v2.102.0 并保留整星、半星、空值项、ARIA 与尺寸 DOM', async ({
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
      scenarioId: 'rating',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.ratingPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'rating')).toBe(true);
  const scenario = page.getByTestId('rating-reference');
  await expect(scenario.locator('.semi-rating')).toHaveCount(6);
  await expect(scenario.locator('.semi-rating-star')).toHaveCount(36);
  await expect(scenario.locator('[role="radio"]')).toHaveCount(41);
  await expect(
    scenario.locator('[data-parity-target="rating-half"] .semi-rating-star-half'),
  ).toHaveCount(1);
  await expect(scenario.locator('[data-parity-target="rating-disabled"]')).toHaveClass(
    /semi-rating-disabled/,
  );
  await expect(
    scenario.locator('[data-parity-target="rating-small"] .semi-rating-star-small'),
  ).toHaveCount(5);
  await expect(scenario.locator('[data-parity-target="rating-custom"]')).toHaveAttribute(
    'aria-label',
    /S/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Rating React/Vue 样式、几何、清空、Tooltip、键盘与焦点一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'rating',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('rating').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('rating').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'rating', target.id);
    });
  }

  const reactDefault = pair.react.page.locator('[data-parity-target="rating-default"]');
  const vueDefault = pair.vue.page.locator('[data-parity-target="rating-default"]');
  await Promise.all([
    reactDefault.locator('.semi-rating-star-second').nth(3).click(),
    vueDefault.locator('.semi-rating-star-second').nth(3).click(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：change:4'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：change:4'),
  ]);
  await Promise.all([
    reactDefault.locator('.semi-rating-star-second').nth(3).click(),
    vueDefault.locator('.semi-rating-star-second').nth(3).click(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：change:0'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：change:0'),
  ]);

  const reactTooltip = pair.react.page.locator('[data-parity-target="rating-tooltip"]');
  const vueTooltip = pair.vue.page.locator('[data-parity-target="rating-tooltip"]');
  await Promise.all([
    reactTooltip.locator('.semi-rating-star-second').nth(1).hover(),
    vueTooltip.locator('.semi-rating-star-second').nth(1).hover(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：hover:2'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：hover:2'),
    expect(pair.react.page.locator('.semi-tooltip-wrapper-show')).toContainText('bad'),
    expect(pair.vue.page.locator('.semi-tooltip-wrapper-show')).toContainText('bad'),
  ]);

  await Promise.all([
    reactDefault.locator('.semi-rating-star-second').nth(1).focus(),
    vueDefault.locator('.semi-rating-star-second').nth(1).focus(),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('ArrowRight'),
    pair.vue.page.keyboard.press('ArrowRight'),
  ]);
  await Promise.all([
    expect(reactDefault.locator('.semi-rating-star-second').nth(0)).toBeFocused(),
    expect(vueDefault.locator('.semi-rating-star-second').nth(0)).toBeFocused(),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Rating React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'rating',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('rating-reference');
      const vueTarget = pair.vue.page.getByTestId('rating-vue');
      await expect(reactTarget).toHaveScreenshot(`rating-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`rating-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Rating React/Vue RTL 样式、几何与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'rating',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('rating').targets) {
    await expectComparableTarget(pair, 'rating', target.id);
  }
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="rating-default"]')).toHaveCSS(
      'direction',
      'rtl',
    );
  }
  const reactTarget = pair.react.page.getByTestId('rating-reference');
  const vueTarget = pair.vue.page.getByTestId('rating-vue');
  await expect(reactTarget).toHaveScreenshot('rating-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('rating-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

test('Input 参考场景来自本地 v2.102.0 并保留 Input/Group/TextArea DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'input',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.inputPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'input')).toBe(true);
  const scenario = page.getByTestId('input-reference');
  await expect(scenario.locator('.semi-input-wrapper')).toHaveCount(10);
  await expect(scenario.locator('.semi-input-textarea-wrapper')).toHaveCount(2);
  await expect(scenario.locator('.semi-input-modebtn')).toHaveCount(1);
  await expect(scenario.locator('.semi-input-group[role="group"]')).toHaveCount(1);
  await expect(scenario.locator('.semi-input-textarea-lineNumber-item')).toHaveCount(3);
  await expect(scenario.locator('.input-target-disabled .semi-input')).toBeDisabled();
  expect(runtimeErrors).toEqual([]);
});

test('Input React/Vue 样式、几何、清除、密码键盘与输入事件一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'input',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('input').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'input', target.id);
    });
  }

  const reactBasic = pair.react.page.locator('.input-target-basic .semi-input');
  const vueBasic = pair.vue.page.locator('.input-target-basic .semi-input');
  await Promise.all([reactBasic.fill('Vue'), vueBasic.fill('Vue')]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：input:Vue'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：input:Vue'),
  ]);

  const reactClearInput = pair.react.page.locator('.input-target-clear .semi-input');
  const vueClearInput = pair.vue.page.locator('.input-target-clear .semi-input');
  await Promise.all([reactClearInput.focus(), vueClearInput.focus()]);
  const reactClear = pair.react.page.locator('.input-target-clear .semi-input-clearbtn');
  const vueClear = pair.vue.page.locator('.input-target-clear .semi-input-clearbtn');
  await Promise.all([expect(reactClear).toBeVisible(), expect(vueClear).toBeVisible()]);
  await Promise.all([reactClear.click(), vueClear.click()]);
  await Promise.all([
    expect(reactClearInput).toHaveValue(''),
    expect(vueClearInput).toHaveValue(''),
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：clear'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：clear'),
  ]);

  const reactPasswordButton = pair.react.page.locator('.input-target-password .semi-input-modebtn');
  const vuePasswordButton = pair.vue.page.locator('.input-target-password .semi-input-modebtn');
  await Promise.all([reactPasswordButton.focus(), vuePasswordButton.focus()]);
  await Promise.all([
    pair.react.page.keyboard.press('Enter'),
    pair.vue.page.keyboard.press('Enter'),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.input-target-password .semi-input')).toHaveAttribute(
      'type',
      'text',
    ),
    expect(pair.vue.page.locator('.input-target-password .semi-input')).toHaveAttribute(
      'type',
      'text',
    ),
  ]);

  const reactTextarea = pair.react.page.locator(
    '.input-target-textarea-counter .semi-input-textarea',
  );
  const vueTextarea = pair.vue.page.locator('.input-target-textarea-counter .semi-input-textarea');
  await Promise.all([reactTextarea.fill('同一内容'), vueTextarea.fill('同一内容')]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：textarea:同一内容'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：textarea:同一内容'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Input React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'input',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('input-reference');
      const vueTarget = pair.vue.page.getByTestId('input-vue');
      await expect(reactTarget).toHaveScreenshot(`input-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`input-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Input React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'input',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('input-reference');
  const vueTarget = pair.vue.page.getByTestId('input-vue');
  await expect(reactTarget).toHaveScreenshot('input-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('input-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

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
  expect(referenceSourceWasRequested(requestedUrls, 'input-number')).toBe(true);
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
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
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
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

test('Slider 参考场景来自本地 v2.102.0 并保留单值、范围、marks、disabled、纵向与 ARIA DOM', async ({
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
      scenarioId: 'slider',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.sliderPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'slider')).toBe(true);
  const scenario = page.getByTestId('slider-reference');
  await expect(scenario.locator('.semi-slider-wrapper')).toHaveCount(5);
  await expect(scenario.locator('[role="slider"]')).toHaveCount(7);
  await expect(scenario.locator('.semi-slider-mark')).toHaveCount(5);
  await expect(scenario.locator('[data-parity-target="slider-disabled"]')).toHaveClass(
    /semi-slider-disabled/,
  );
  await expect(
    scenario.locator('[data-parity-target="slider-vertical"] [role="slider"]'),
  ).toHaveAttribute('aria-orientation', 'vertical');
  expect(runtimeErrors).toEqual([]);
});

test('Slider React/Vue 样式、几何、点击、Tooltip、键盘与真实拖拽一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'slider',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('slider').targets).toHaveLength(5);
  const captureBasicGeometry = async (page: (typeof pair.react)['page']) =>
    page.locator('[data-parity-target="slider-basic"]').evaluate((root) => {
      const selectors = ['.semi-slider-rail', '.semi-slider-track', '.semi-slider-handle'];
      return Object.fromEntries(
        selectors.map((selector) => {
          const element = root.querySelector<HTMLElement>(selector);
          if (!element) throw new Error(`Slider 基础场景缺少 ${selector}`);
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return [
            selector,
            {
              rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
              left: style.left,
              right: style.right,
              width: style.width,
              transform: style.transform,
            },
          ];
        }),
      );
    });
  const [reactBasicGeometry, vueBasicGeometry] = await Promise.all([
    captureBasicGeometry(pair.react.page),
    captureBasicGeometry(pair.vue.page),
  ]);
  expect(vueBasicGeometry).toEqual(reactBasicGeometry);
  for (const target of assertScenarioComparable('slider').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'slider', target.id);
    });
  }

  const reactBasic = pair.react.page.locator('[data-parity-target="slider-basic"]');
  const vueBasic = pair.vue.page.locator('[data-parity-target="slider-basic"]');
  await Promise.all([
    reactBasic.locator('.semi-slider-rail').click({ position: { x: 400, y: 2 } }),
    vueBasic.locator('.semi-slider-rail').click({ position: { x: 400, y: 2 } }),
  ]);
  const [reactClickedValue, vueClickedValue] = await Promise.all([
    reactBasic.locator('[role="slider"]').getAttribute('aria-valuenow'),
    vueBasic.locator('[role="slider"]').getAttribute('aria-valuenow'),
  ]);
  expect(vueClickedValue).toBe(reactClickedValue);

  await Promise.all([
    reactBasic.locator('[role="slider"]').hover(),
    vueBasic.locator('[role="slider"]').hover(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-slider-handle-tooltip')).toContainText(
      reactClickedValue ?? '',
    ),
    expect(pair.vue.page.locator('.semi-slider-handle-tooltip')).toContainText(
      vueClickedValue ?? '',
    ),
  ]);

  await Promise.all([
    reactBasic.locator('[role="slider"]').focus(),
    vueBasic.locator('[role="slider"]').focus(),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('ArrowRight'),
    pair.vue.page.keyboard.press('ArrowRight'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText(/最近变化：basic:/),
    expect(pair.vue.page.getByRole('status')).toHaveText(/最近变化：basic:/),
  ]);
  const [reactKeyboardValue, vueKeyboardValue] = await Promise.all([
    reactBasic.locator('[role="slider"]').getAttribute('aria-valuenow'),
    vueBasic.locator('[role="slider"]').getAttribute('aria-valuenow'),
  ]);
  expect(vueKeyboardValue).toBe(reactKeyboardValue);

  const reactRangeHandle = pair.react.page
    .locator('[data-parity-target="slider-range"] [role="slider"]')
    .first();
  const vueRangeHandle = pair.vue.page
    .locator('[data-parity-target="slider-range"] [role="slider"]')
    .first();
  const [reactBox, vueBox] = await Promise.all([
    reactRangeHandle.boundingBox(),
    vueRangeHandle.boundingBox(),
  ]);
  expect(reactBox).not.toBeNull();
  expect(vueBox).not.toBeNull();
  await pair.react.page.mouse.move(
    reactBox!.x + reactBox!.width / 2,
    reactBox!.y + reactBox!.height / 2,
  );
  await pair.react.page.mouse.down();
  await pair.react.page.mouse.move(reactBox!.x + 120, reactBox!.y + reactBox!.height / 2);
  await pair.react.page.mouse.up();
  await pair.vue.page.mouse.move(vueBox!.x + vueBox!.width / 2, vueBox!.y + vueBox!.height / 2);
  await pair.vue.page.mouse.down();
  await pair.vue.page.mouse.move(vueBox!.x + 120, vueBox!.y + vueBox!.height / 2);
  await pair.vue.page.mouse.up();
  const [reactRangeValue, vueRangeValue] = await Promise.all([
    reactRangeHandle.getAttribute('aria-valuenow'),
    vueRangeHandle.getAttribute('aria-valuenow'),
  ]);
  expect(vueRangeValue).toBe(reactRangeValue);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Slider React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'slider',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('slider-reference');
      const vueTarget = pair.vue.page.getByTestId('slider-vue');
      await expect(reactTarget).toHaveScreenshot(`slider-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`slider-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Slider React/Vue RTL 方向、键盘、几何与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'slider',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('slider').targets) {
    await expectComparableTarget(pair, 'slider', target.id);
  }
  const reactHandle = pair.react.page.locator(
    '[data-parity-target="slider-basic"] [role="slider"]',
  );
  const vueHandle = pair.vue.page.locator('[data-parity-target="slider-basic"] [role="slider"]');
  await Promise.all([reactHandle.focus(), vueHandle.focus()]);
  await Promise.all([
    pair.react.page.keyboard.press('ArrowLeft'),
    pair.vue.page.keyboard.press('ArrowLeft'),
  ]);
  await Promise.all([
    expect(reactHandle).toHaveAttribute('aria-valuenow', '31'),
    expect(vueHandle).toHaveAttribute('aria-valuenow', '31'),
  ]);
  const reactTooltip = pair.react.page.locator('.semi-slider-handle-tooltip');
  const vueTooltip = pair.vue.page.locator('.semi-slider-handle-tooltip');
  await Promise.all([
    expect(reactTooltip).toHaveCSS('transform', 'none'),
    expect(vueTooltip).toHaveCSS('transform', 'none'),
  ]);
  const captureRtlTooltipGeometry = async (tooltip: typeof reactTooltip) =>
    tooltip.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      };
    });
  const [reactTooltipGeometry, vueTooltipGeometry] = await Promise.all([
    captureRtlTooltipGeometry(reactTooltip),
    captureRtlTooltipGeometry(vueTooltip),
  ]);
  expect(vueTooltipGeometry).toEqual(reactTooltipGeometry);
  const reactTarget = pair.react.page.getByTestId('slider-reference');
  const vueTarget = pair.vue.page.getByTestId('slider-vue');
  await expect(reactTarget).toHaveScreenshot('slider-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('slider-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

test('TagInput 参考场景来自本地 v2.102.0 并保留标签、折叠与输入 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'tag-input',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.tagInputPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'tag-input')).toBe(true);
  const scenario = page.getByTestId('tag-input-reference');
  await expect(scenario.locator('.semi-tagInput')).toHaveCount(7);
  await expect(scenario.locator('[data-parity-target="tag-input-basic"] .semi-tag')).toHaveCount(3);
  await expect(
    scenario.locator('[data-parity-target="tag-input-collapsed"] .semi-tag'),
  ).toHaveCount(2);
  await expect(
    scenario.locator('[data-parity-target="tag-input-collapsed"] .semi-tagInput-wrapper-n'),
  ).toHaveText('+2');
  await expect(scenario.locator('[data-parity-target="tag-input-disabled"] input')).toBeDisabled();
  expect(runtimeErrors).toEqual([]);
});

test('TagInput React/Vue 添加、删除、焦点、Popover、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tag-input',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('tag-input').targets).toHaveLength(7);
  for (const target of assertScenarioComparable('tag-input').targets) {
    await expectComparableTarget(pair, 'tag-input', target.id);
  }

  const reactBasic = pair.react.page.locator('[data-parity-target="tag-input-basic"]');
  const vueBasic = pair.vue.page.locator('[data-parity-target="tag-input-basic"]');
  const reactInput = reactBasic.locator('input');
  const vueInput = vueBasic.locator('input');
  await Promise.all([reactInput.fill('新增'), vueInput.fill('新增')]);
  await Promise.all([reactInput.press('Enter'), vueInput.press('Enter')]);
  await Promise.all([
    expect(reactBasic.locator('.semi-tag')).toHaveCount(4),
    expect(vueBasic.locator('.semi-tag')).toHaveCount(4),
    expect(pair.react.page.getByRole('status')).toContainText('新增'),
    expect(pair.vue.page.getByRole('status')).toContainText('新增'),
  ]);

  const reactLastTag = reactBasic.locator('.semi-tag').last();
  const vueLastTag = vueBasic.locator('.semi-tag').last();
  await Promise.all([reactLastTag.focus(), vueLastTag.focus()]);
  await Promise.all([reactLastTag.press('Delete'), vueLastTag.press('Delete')]);
  await Promise.all([
    expect(reactBasic.locator('.semi-tag')).toHaveCount(3),
    expect(vueBasic.locator('.semi-tag')).toHaveCount(3),
  ]);

  const reactRest = pair.react.page.locator(
    '[data-parity-target="tag-input-collapsed"] .semi-tagInput-wrapper-n',
  );
  const vueRest = pair.vue.page.locator(
    '[data-parity-target="tag-input-collapsed"] .semi-tagInput-wrapper-n',
  );
  await Promise.all([reactRest.hover(), vueRest.hover()]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-popover-wrapper')).toContainText('Vue'),
    expect(pair.vue.page.locator('.semi-popover-wrapper')).toContainText('Vue'),
  ]);
  const [reactPopover, vuePopover] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('.semi-popover-wrapper'), [
      'backgroundColor',
      'borderRadius',
      'padding',
    ]),
    captureComputedStyle(pair.vue.page.locator('.semi-popover-wrapper'), [
      'backgroundColor',
      'borderRadius',
      'padding',
    ]),
  ]);
  expect(vuePopover).toEqual(reactPopover);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`TagInput React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'tag-input',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('tag-input-reference');
      const vueTarget = pair.vue.page.getByTestId('tag-input-vue');
      await expect(reactTarget).toHaveScreenshot(
        `tag-input-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`tag-input-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('TagInput React/Vue RTL 样式、几何与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tag-input',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('tag-input').targets) {
    await expectComparableTarget(pair, 'tag-input', target.id);
  }
  const [reactMargin, vueMargin] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('.semi-tagInput-wrapper-tag').first(), [
      'marginLeft',
      'marginRight',
    ]),
    captureComputedStyle(pair.vue.page.locator('.semi-tagInput-wrapper-tag').first(), [
      'marginLeft',
      'marginRight',
    ]),
  ]);
  expect(vueMargin).toEqual(reactMargin);
  const reactTarget = pair.react.page.getByTestId('tag-input-reference');
  const vueTarget = pair.vue.page.getByTestId('tag-input-vue');
  await expect(reactTarget).toHaveScreenshot('tag-input-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('tag-input-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

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

test('Anchor 参考场景来自本地 v2.102.0 并保留导航、嵌套与禁用 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'anchor',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.anchorPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'anchor')).toBe(true);
  const scenario = page.getByTestId('anchor-reference');
  await expect(scenario.locator('.semi-anchor')).toHaveCount(2);
  await expect(scenario.locator('.semi-anchor-link-title')).toHaveCount(6);
  await expect(scenario.locator('[role="navigation"]').first()).toHaveAttribute(
    'aria-label',
    '章节导航',
  );
  await expect(
    scenario.locator('.anchor-target-disabled > .semi-anchor-link-title'),
  ).toHaveAttribute('aria-disabled', 'true');
  expect(runtimeErrors).toEqual([]);
});

test('Anchor React/Vue 点击、keypress、滚动、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'anchor',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('anchor').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('anchor').targets) {
    await expectComparableTarget(pair, 'anchor', target.id);
  }

  const reactApi = pair.react.page.locator('.anchor-target-api > .semi-anchor-link-title');
  const vueApi = pair.vue.page.locator('.anchor-target-api > .semi-anchor-link-title');
  await Promise.all([reactApi.click(), vueApi.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('点击：#anchor-api'),
    expect(pair.vue.page.getByRole('status')).toHaveText('点击：#anchor-api'),
  ]);
  await Promise.all([
    expect(reactApi).toHaveClass(/semi-anchor-link-title-active/),
    expect(vueApi).toHaveClass(/semi-anchor-link-title-active/),
  ]);
  const [reactScrollTop, vueScrollTop] = await Promise.all([
    pair.react.page.locator('.anchor-scenario__content').evaluate((element) => element.scrollTop),
    pair.vue.page.locator('.anchor-scenario__content').evaluate((element) => element.scrollTop),
  ]);
  expect(vueScrollTop).toBe(reactScrollTop);
  expect(reactScrollTop).toBeGreaterThan(0);

  const reactDisabled = pair.react.page.locator(
    '.anchor-target-disabled > .semi-anchor-link-title',
  );
  const vueDisabled = pair.vue.page.locator('.anchor-target-disabled > .semi-anchor-link-title');
  await Promise.all([reactDisabled.dispatchEvent('click'), vueDisabled.dispatchEvent('click')]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('点击：#anchor-api'),
    expect(pair.vue.page.getByRole('status')).toHaveText('点击：#anchor-api'),
  ]);

  const reactOverview = pair.react.page.locator(
    '.anchor-target-overview > .semi-anchor-link-title',
  );
  const vueOverview = pair.vue.page.locator('.anchor-target-overview > .semi-anchor-link-title');
  await Promise.all([reactOverview.focus(), vueOverview.focus()]);
  await Promise.all([
    pair.react.page.keyboard.press('Enter'),
    pair.vue.page.keyboard.press('Enter'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('点击：#anchor-overview'),
    expect(pair.vue.page.getByRole('status')).toHaveText('点击：#anchor-overview'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Anchor React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'anchor',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('anchor-reference');
      const vueTarget = pair.vue.page.getByTestId('anchor-vue');
      await expect(reactTarget).toHaveScreenshot(`anchor-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`anchor-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Anchor React/Vue RTL 缩进、滑轨、样式、几何与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'anchor',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('anchor').targets) {
    await expectComparableTarget(pair, 'anchor', target.id);
  }
  const reactApi = pair.react.page.locator('.anchor-target-api > .semi-anchor-link-title');
  const vueApi = pair.vue.page.locator('.anchor-target-api > .semi-anchor-link-title');
  const [reactPadding, vuePadding] = await Promise.all([
    captureComputedStyle(reactApi, ['paddingLeft', 'paddingRight']),
    captureComputedStyle(vueApi, ['paddingLeft', 'paddingRight']),
  ]);
  expect(vuePadding).toEqual(reactPadding);
  expect(reactPadding.paddingRight).toBe('16px');
  expect(reactPadding.paddingLeft).toBe('0px');
  const [reactSlide, vueSlide] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('.semi-anchor-slide').first(), ['left', 'right']),
    captureComputedStyle(pair.vue.page.locator('.semi-anchor-slide').first(), ['left', 'right']),
  ]);
  expect(vueSlide).toEqual(reactSlide);
  const reactTarget = pair.react.page.getByTestId('anchor-reference');
  const vueTarget = pair.vue.page.getByTestId('anchor-vue');
  await expect(reactTarget).toHaveScreenshot('anchor-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('anchor-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('BackTop 参考场景来自本地 v2.102.0 并保留阈值、默认与自定义 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'back-top',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.backTopPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'back-top')).toBe(true);
  await expect(page.locator('[data-parity-target="back-top-default"]')).toHaveCount(0);
  const custom = page.locator('[data-parity-target="back-top-custom"]');
  await expect(custom).toBeVisible();
  await expect(custom).toHaveText('TOP');
  await expect(custom).toHaveAttribute('x-semi-prop', 'children');
  expect(runtimeErrors).toEqual([]);
});

test('BackTop React/Vue Element 阈值、回顶事件、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'back-top',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('back-top').targets).toHaveLength(2);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="back-top-default"]')).toHaveCount(0);
    await parityPage.locator('.back-top-scenario__scroll').evaluate((element) => {
      element.scrollTop = 120;
      element.dispatchEvent(new Event('scroll'));
    });
    await expect(parityPage.locator('[data-parity-target="back-top-default"]')).toBeVisible();
  }

  for (const target of assertScenarioComparable('back-top').targets) {
    await expectComparableTarget(pair, 'back-top', target.id);
  }
  const [reactPosition, vuePosition] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('[data-parity-target="back-top-default"]'), [
      'bottom',
      'position',
      'right',
    ]),
    captureComputedStyle(pair.vue.page.locator('[data-parity-target="back-top-default"]'), [
      'bottom',
      'position',
      'right',
    ]),
  ]);
  expect(vuePosition).toEqual(reactPosition);
  expect(reactPosition).toEqual({ bottom: '50px', position: 'fixed', right: '100px' });

  await Promise.all([
    pair.react.page.locator('[data-parity-target="back-top-default"]').click(),
    pair.vue.page.locator('[data-parity-target="back-top-default"]').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('点击：默认回顶'),
    expect(pair.vue.page.getByRole('status')).toHaveText('点击：默认回顶'),
  ]);
  const [reactScrollTop, vueScrollTop] = await Promise.all([
    pair.react.page.locator('.back-top-scenario__scroll').evaluate((element) => element.scrollTop),
    pair.vue.page.locator('.back-top-scenario__scroll').evaluate((element) => element.scrollTop),
  ]);
  expect(vueScrollTop).toBe(reactScrollTop);
  expect(reactScrollTop).toBe(0);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`BackTop React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'back-top',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const parityPage of [pair.react.page, pair.vue.page]) {
        await parityPage.locator('.back-top-scenario__scroll').evaluate((element) => {
          element.scrollTop = 120;
          element.dispatchEvent(new Event('scroll'));
        });
      }
      const reactTarget = pair.react.page.locator('[data-parity-target="back-top-default"]');
      const vueTarget = pair.vue.page.locator('[data-parity-target="back-top-default"]');
      await Promise.all([expect(reactTarget).toBeVisible(), expect(vueTarget).toBeVisible()]);
      await expect(reactTarget).toHaveScreenshot(`back-top-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`back-top-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('BackTop React/Vue RTL 固定定位、样式、几何与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'back-top',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await parityPage.locator('.back-top-scenario__scroll').evaluate((element) => {
      element.scrollTop = 120;
      element.dispatchEvent(new Event('scroll'));
    });
  }
  for (const target of assertScenarioComparable('back-top').targets) {
    await expectComparableTarget(pair, 'back-top', target.id);
  }
  const reactTarget = pair.react.page.locator('[data-parity-target="back-top-default"]');
  const vueTarget = pair.vue.page.locator('[data-parity-target="back-top-default"]');
  const [reactPosition, vuePosition] = await Promise.all([
    captureComputedStyle(reactTarget, ['left', 'right']),
    captureComputedStyle(vueTarget, ['left', 'right']),
  ]);
  expect(vuePosition).toEqual(reactPosition);
  expect(reactPosition).toEqual({ left: '100px', right: '1308px' });
  await expect(reactTarget).toHaveScreenshot('back-top-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('back-top-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

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
  expect(referenceSourceWasRequested(requestedUrls, 'breadcrumb')).toBe(true);
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
  await expect(reactPopover).toHaveScreenshot('breadcrumb-popover-parity-light.png');
  await expect(vuePopover).toHaveScreenshot('breadcrumb-popover-parity-light.png');
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
    expect(Math.abs(vuePopoverBox[axis] - reactPopoverBox[axis])).toBeLessThanOrEqual(
      VISUAL_THRESHOLDS.boundingRectToleranceCssPx,
    );
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
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
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
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

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
    expect(vuePageScreenshot.equals(reactPageScreenshot)).toBe(true);
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
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
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
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Steps 参考场景来自本地 v2.102.0 并保留 fill/basic/vertical/nav DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'steps',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.stepsPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'steps')).toBe(true);
  const scenario = page.getByTestId('steps-reference');
  await expect(scenario.locator('.semi-steps')).toHaveCount(1);
  await expect(scenario.locator('.semi-steps-basic')).toHaveCount(2);
  await expect(scenario.locator('.semi-steps-nav')).toHaveCount(1);
  await expect(scenario.locator('.semi-steps-item')).toHaveCount(12);
  await expect(scenario.locator('[data-parity-target="steps-basic"]')).toHaveClass(
    /semi-steps-small/,
  );
  await expect(scenario.locator('[data-parity-target="steps-vertical"]')).toHaveClass(
    /semi-steps-vertical/,
  );
  await expect(
    scenario.locator('[data-parity-target="steps-basic"] .semi-steps-item-warning'),
  ).toHaveCount(1);
  expect(runtimeErrors).toEqual([]);
});

test('Steps React/Vue 状态、点击、Enter、hover、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'steps',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('steps').targets).toHaveLength(5);
  for (const target of assertScenarioComparable('steps').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'steps', target.id);
    });
  }

  const reactBasicFirst = pair.react.page
    .locator('[data-parity-target="steps-basic"] .semi-steps-item')
    .first();
  const vueBasicFirst = pair.vue.page
    .locator('[data-parity-target="steps-basic"] .semi-steps-item')
    .first();
  await Promise.all([reactBasicFirst.click(), vueBasicFirst.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('Basic：0'),
    expect(pair.vue.page.getByRole('status')).toHaveText('Basic：0'),
  ]);

  await Promise.all([reactBasicFirst.focus(), vueBasicFirst.focus()]);
  await Promise.all([
    pair.react.page.keyboard.press('Enter'),
    pair.vue.page.keyboard.press('Enter'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('Basic：0'),
    expect(pair.vue.page.getByRole('status')).toHaveText('Basic：0'),
  ]);

  await Promise.all([reactBasicFirst.hover(), vueBasicFirst.hover()]);
  const [reactHover, vueHover] = await Promise.all([
    captureComputedStyle(reactBasicFirst, ['backgroundColor', 'color', 'cursor']),
    captureComputedStyle(vueBasicFirst, ['backgroundColor', 'color', 'cursor']),
  ]);
  expect(vueHover).toEqual(reactHover);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Steps React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'steps',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('steps-reference');
      const vueTarget = pair.vue.page.getByTestId('steps-vue');
      await expect(reactTarget).toHaveScreenshot(`steps-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`steps-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Steps React/Vue RTL 样式、几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'steps',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('steps').targets) {
    await expectComparableTarget(pair, 'steps', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('steps-reference');
  const vueTarget = pair.vue.page.getByTestId('steps-vue');
  await expect(reactTarget).toHaveScreenshot('steps-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('steps-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Tabs 参考场景来自本地 v2.102.0 并保留类型、竖向、More 与折叠 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'tabs',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.tabsPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'tabs')).toBe(true);
  const scenario = page.getByTestId('tabs-reference');
  await expect(scenario.locator('.semi-tabs')).toHaveCount(7);
  await expect(scenario.locator('.semi-tabs-bar-card')).toHaveCount(4);
  await expect(scenario.locator('.semi-tabs-bar-button')).toHaveCount(1);
  await expect(scenario.locator('.semi-tabs-bar-slash')).toHaveCount(1);
  await expect(scenario.locator('.semi-tabs-left')).toHaveCount(1);
  await expect(scenario.locator('.semi-tabs-tab-disabled')).toHaveCount(1);
  await expect(scenario.locator('.semi-tabs-tab-icon-close')).toHaveCount(1);
  await expect(scenario.locator('.semi-tabs-bar-more-trigger')).toHaveCount(1);
  await expect(scenario.locator('.semi-tabs-bar-overflow-list')).toHaveCount(1);
  expect(runtimeErrors).toEqual([]);
});

test('Tabs React/Vue 点击、键盘、More、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tabs',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('tabs').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('tabs').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'tabs', target.id);
    });
  }

  const reactLineTabs = pair.react.page.locator('[data-parity-target="tabs-line"] [role="tab"]');
  const vueLineTabs = pair.vue.page.locator('[data-parity-target="tabs-line"] [role="tab"]');
  await Promise.all([reactLineTabs.nth(2).click(), vueLineTabs.nth(2).click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('Line：line3'),
    expect(pair.vue.page.getByRole('status')).toHaveText('Line：line3'),
  ]);

  await Promise.all([reactLineTabs.nth(0).focus(), vueLineTabs.nth(0).focus()]);
  await Promise.all([
    pair.react.page.keyboard.press('ArrowRight'),
    pair.vue.page.keyboard.press('ArrowRight'),
  ]);
  await Promise.all([
    expect(reactLineTabs.nth(1)).toBeFocused(),
    expect(vueLineTabs.nth(1)).toBeFocused(),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('Enter'),
    pair.vue.page.keyboard.press('Enter'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('Line：line2'),
    expect(pair.vue.page.getByRole('status')).toHaveText('Line：line2'),
  ]);

  await Promise.all([reactLineTabs.nth(0).hover(), vueLineTabs.nth(0).hover()]);
  const [reactHover, vueHover] = await Promise.all([
    captureComputedStyle(reactLineTabs.nth(0), ['borderBottomColor', 'color', 'cursor']),
    captureComputedStyle(vueLineTabs.nth(0), ['borderBottomColor', 'color', 'cursor']),
  ]);
  expect(vueHover).toEqual(reactHover);

  const reactMore = pair.react.page.locator('.semi-tabs-bar-more-trigger');
  const vueMore = pair.vue.page.locator('.semi-tabs-bar-more-trigger');
  await Promise.all([reactMore.hover(), vueMore.hover()]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-dropdown-menu')).toBeVisible(),
    expect(pair.vue.page.locator('.semi-dropdown-menu')).toBeVisible(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-dropdown-item')).toHaveCount(2),
    expect(pair.vue.page.locator('.semi-dropdown-item')).toHaveCount(2),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Tabs React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'tabs',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('tabs-reference');
      const vueTarget = pair.vue.page.getByTestId('tabs-vue');
      await expect(reactTarget).toHaveScreenshot(`tabs-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`tabs-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Tabs React/Vue RTL 样式、几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tabs',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('tabs').targets) {
    await expectComparableTarget(pair, 'tabs', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('tabs-reference');
  const vueTarget = pair.vue.page.getByTestId('tabs-vue');
  await expect(reactTarget).toHaveScreenshot('tabs-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('tabs-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Tree 参考场景来自本地 v2.102.0 并保留节点、选择、搜索与目录 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'tree',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.treePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'tree')).toBe(true);
  const scenario = page.getByTestId('tree-reference');
  await expect(scenario.locator('[role="tree"]')).toHaveCount(4);
  await expect(scenario.locator('[data-key="beijing"]')).toHaveCount(4);
  await expect(scenario.locator('[data-key="shanghai"]').first()).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(scenario.locator('.semi-tree-option-selected')).toHaveCount(1);
  await expect(scenario.locator('.semi-checkbox-checked')).toHaveCount(2);
  await expect(scenario.getByRole('textbox', { name: 'Filter Tree' })).toHaveAttribute(
    'placeholder',
    '搜索',
  );
  await expect(scenario.locator('.semi-tree-option-indent-show-line')).not.toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
});

test('Tree React/Vue 选择、禁用、搜索、键盘、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tree',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('tree').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('tree').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'tree', target.id);
    });
  }

  const reactBasic = pair.react.page.locator('[data-parity-target="tree-basic"]');
  const vueBasic = pair.vue.page.locator('[data-parity-target="tree-basic"]');
  await Promise.all([
    reactBasic.locator('[data-key="japan"]').click(),
    vueBasic.locator('[data-key="japan"]').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('选择：Japan'),
    expect(pair.vue.page.getByRole('status')).toHaveText('选择：Japan'),
    expect(reactBasic.locator('[data-key="japan"]')).toHaveClass(/semi-tree-option-selected/),
    expect(vueBasic.locator('[data-key="japan"]')).toHaveClass(/semi-tree-option-selected/),
  ]);

  await Promise.all([
    reactBasic.locator('[data-key="shanghai"]').dispatchEvent('click'),
    vueBasic.locator('[data-key="shanghai"]').dispatchEvent('click'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('选择：Japan'),
    expect(pair.vue.page.getByRole('status')).toHaveText('选择：Japan'),
  ]);

  const reactSearch = pair.react.page.locator('[data-parity-target="tree-search"]');
  const vueSearch = pair.vue.page.locator('[data-parity-target="tree-search"]');
  await Promise.all([
    reactSearch.getByRole('textbox', { name: 'Filter Tree' }).fill('北京'),
    vueSearch.getByRole('textbox', { name: 'Filter Tree' }).fill('北京'),
  ]);
  await Promise.all([
    expect(reactSearch.locator('.semi-tree-option-highlight')).toHaveText('北京'),
    expect(vueSearch.locator('.semi-tree-option-highlight')).toHaveText('北京'),
  ]);

  await Promise.all([
    reactBasic
      .locator('[data-key="america"]')
      .dispatchEvent('keypress', { charCode: 13, key: 'Enter', keyCode: 13 }),
    vueBasic
      .locator('[data-key="america"]')
      .dispatchEvent('keypress', { charCode: 13, key: 'Enter', keyCode: 13 }),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('选择：America'),
    expect(pair.vue.page.getByRole('status')).toHaveText('选择：America'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Tree React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'tree',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('tree-reference');
      const vueTarget = pair.vue.page.getByTestId('tree-vue');
      await expect(reactTarget).toHaveScreenshot(`tree-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`tree-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Tree React/Vue RTL 与 en-US 搜索文案、样式、几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tree',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('tree').targets) {
    await expectComparableTarget(pair, 'tree', target.id);
  }
  await Promise.all([
    expect(pair.react.page.getByRole('textbox', { name: 'Filter Tree' })).toHaveAttribute(
      'placeholder',
      'Search',
    ),
    expect(pair.vue.page.getByRole('textbox', { name: 'Filter Tree' })).toHaveAttribute(
      'placeholder',
      'Search',
    ),
  ]);
  const reactTarget = pair.react.page.getByTestId('tree-reference');
  const vueTarget = pair.vue.page.getByTestId('tree-vue');
  await expect(reactTarget).toHaveScreenshot('tree-reference-light-rtl-en.png');
  await expect(vueTarget).toHaveScreenshot('tree-vue-light-rtl-en.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Avatar 参考场景来自本地 v2.102.0 并保留尺寸、图片、Group 与装饰 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'avatar',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.avatarPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'avatar')).toBe(true);
  const scenario = page.getByTestId('avatar-reference');
  await expect(scenario.locator('.semi-avatar')).toHaveCount(18);
  await expect(scenario.locator('.semi-avatar-extra-extra-small')).toHaveCount(1);
  await expect(scenario.locator('.semi-avatar-extra-large')).toHaveCount(1);
  await expect(scenario.locator('[data-parity-target="avatar-image"] > img')).toHaveAttribute(
    'alt',
    'Profile',
  );
  await expect(
    scenario.locator('[data-parity-target="avatar-group"] > .semi-avatar-group'),
  ).toHaveAttribute('role', 'list');
  await expect(scenario.locator('.semi-avatar-item-more')).toContainText('+2');
  await expect(scenario.locator('.semi-avatar-top_slot-content')).toHaveText('直播');
  await expect(scenario.locator('.semi-avatar-bottom_slot')).toHaveCount(2);
  expect(runtimeErrors).toEqual([]);
});

test('Avatar React/Vue 行为、样式、几何、图片回退、hover 与键盘一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'avatar',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('avatar').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('avatar').targets) {
    await expectComparableTarget(pair, 'avatar', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const scenario = parityPage.locator('[data-parity-scenario="avatar"]');
    await expect(scenario.locator('.semi-avatar')).toHaveCount(18);
    await expect(scenario.locator('.semi-avatar-item-more')).toContainText('+2');
    await expect(scenario.locator('.semi-avatar-additionalBorder')).toHaveCount(1);
    await expect(scenario.locator('.semi-avatar-top_slot-content')).toHaveText('直播');
    await expect(scenario.locator('.semi-avatar-bottom_slot')).toHaveCount(2);
  }

  const reactHover = pair.react.page.locator('[data-parity-target="avatar-hover"]');
  const vueHover = pair.vue.page.locator('[data-parity-target="avatar-hover"]');
  await Promise.all([reactHover.hover(), vueHover.hover()]);
  await Promise.all([
    expect(reactHover.locator('.semi-avatar-hover')).toHaveText('编辑'),
    expect(vueHover.locator('.semi-avatar-hover')).toHaveText('编辑'),
  ]);
  const [reactMaskStyle, vueMaskStyle] = await Promise.all([
    captureComputedStyle(reactHover.locator('.avatar-scenario__mask'), [
      'alignItems',
      'backgroundColor',
      'color',
      'display',
      'height',
      'justifyContent',
      'width',
    ]),
    captureComputedStyle(vueHover.locator('.avatar-scenario__mask'), [
      'alignItems',
      'backgroundColor',
      'color',
      'display',
      'height',
      'justifyContent',
      'width',
    ]),
  ]);
  expect(vueMaskStyle).toEqual(reactMaskStyle);

  await Promise.all([reactHover.click(), vueHover.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('头像已点击'),
    expect(pair.vue.page.getByRole('status')).toHaveText('头像已点击'),
  ]);

  const reactLabel = reactHover.locator('.semi-avatar-label');
  const vueLabel = vueHover.locator('.semi-avatar-label');
  await Promise.all([reactLabel.focus(), vueLabel.focus()]);
  await Promise.all([
    expect(reactHover).toHaveClass(/semi-avatar-focus/),
    expect(vueHover).toHaveClass(/semi-avatar-focus/),
  ]);
  await Promise.all([reactLabel.press('Enter'), vueLabel.press('Enter')]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('头像已点击'),
    expect(pair.vue.page.getByRole('status')).toHaveText('头像已点击'),
  ]);
  await Promise.all([reactLabel.press('Escape'), vueLabel.press('Escape')]);
  await Promise.all([
    expect(reactHover).not.toHaveClass(/semi-avatar-focus/),
    expect(vueHover).not.toHaveClass(/semi-avatar-focus/),
  ]);

  const reactImage = pair.react.page.locator('[data-parity-target="avatar-image"] > img');
  const vueImage = pair.vue.page.locator('[data-parity-target="avatar-image"] > img');
  await Promise.all([reactImage.dispatchEvent('error'), vueImage.dispatchEvent('error')]);
  await Promise.all([
    expect(pair.react.page.locator('[data-parity-target="avatar-image"]')).toHaveClass(
      /semi-avatar-grey/,
    ),
    expect(pair.vue.page.locator('[data-parity-target="avatar-image"]')).toHaveClass(
      /semi-avatar-grey/,
    ),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Avatar React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'avatar',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('avatar-reference');
      const vueTarget = pair.vue.page.getByTestId('avatar-vue');
      await expect(reactTarget).toHaveScreenshot(`avatar-reference-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      await expect(vueTarget).toHaveScreenshot(`avatar-vue-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Avatar React/Vue RTL 重叠、样式、几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'avatar',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('avatar').targets) {
    await expectComparableTarget(pair, 'avatar', target.id);
  }
  const [reactOverlap, vueOverlap] = await Promise.all([
    captureComputedStyle(
      pair.react.page.locator('[data-parity-target="avatar-group"] .semi-avatar').nth(1),
      ['marginLeft', 'marginRight', 'zIndex'],
    ),
    captureComputedStyle(
      pair.vue.page.locator('[data-parity-target="avatar-group"] .semi-avatar').nth(1),
      ['marginLeft', 'marginRight', 'zIndex'],
    ),
  ]);
  expect(vueOverlap).toEqual(reactOverlap);
  expect(reactOverlap).toMatchObject({ marginLeft: '0px', marginRight: '-12px' });
  const reactTarget = pair.react.page.getByTestId('avatar-reference');
  const vueTarget = pair.vue.page.getByTestId('avatar-vue');
  await expect(reactTarget).toHaveScreenshot('avatar-reference-light-rtl.png', {
    animations: 'disabled',
  });
  await expect(vueTarget).toHaveScreenshot('avatar-vue-light-rtl.png', {
    animations: 'disabled',
  });
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Calendar 参考场景来自本地 v2.102.0 并保留周视图与事件 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'calendar',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.calendarPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'calendar')).toBe(true);
  const scenario = page.getByTestId('calendar-reference');
  await expect(scenario.locator('.semi-calendar-week')).toHaveCount(1);
  await expect(scenario.locator('.semi-calendar-week-header li')).toHaveCount(7);
  await expect(scenario.locator('.semi-calendar-time-item')).toHaveCount(24);
  await expect(scenario.locator('.semi-calendar-event-day')).toHaveCount(2);
  await expect(scenario.locator('.semi-calendar-event-allday')).toHaveCount(2);
  await expect(scenario.locator('.semi-calendar-all-day-tag')).toContainText('全天');
  expect(runtimeErrors).toEqual([]);
});

test('Calendar React/Vue 四种模式、事件、Locale、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'calendar',
    theme: 'light',
    direction: 'ltr',
    locale: 'en-US',
  });
  expect(assertScenarioComparable('calendar').targets).toHaveLength(6);
  const [reactScroll, vueScroll] = await Promise.all([
    pair.react.page.locator('[data-parity-target="calendar-root"]').evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
    })),
    pair.vue.page.locator('[data-parity-target="calendar-root"]').evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
    })),
  ]);
  expect(vueScroll).toEqual(reactScroll);
  for (const target of assertScenarioComparable('calendar').targets) {
    await expectComparableTarget(pair, 'calendar', target.id);
  }
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const scenario = parityPage.locator('[data-parity-scenario="calendar"]');
    await expect(scenario.locator('.semi-calendar-event-day')).toHaveCount(2);
    await expect(scenario.locator('.semi-calendar-event-allday')).toHaveCount(2);
    await expect(scenario.locator('.semi-calendar-all-day-tag')).toContainText('All Day');
  }

  const reactGrid = pair.react.page
    .locator('.semi-calendar-week-scroll .semi-calendar-grid')
    .nth(1);
  const vueGrid = pair.vue.page.locator('.semi-calendar-week-scroll .semi-calendar-grid').nth(1);
  await Promise.all([
    reactGrid.click({ position: { x: 20, y: 80 } }),
    vueGrid.click({ position: { x: 20, y: 80 } }),
  ]);
  const [reactStatus, vueStatus] = await Promise.all([
    pair.react.page.getByRole('status').textContent(),
    pair.vue.page.getByRole('status').textContent(),
  ]);
  expect(vueStatus).toBe(reactStatus);
  expect(reactStatus).toMatch(/^日期：2023-04-\d{2}T/);

  for (const mode of ['day', 'range', 'month'] as const) {
    await Promise.all([
      pair.react.page.locator(`button[data-mode="${mode}"]`).click(),
      pair.vue.page.locator(`button[data-mode="${mode}"]`).click(),
    ]);
    await Promise.all([
      expect(pair.react.page.locator(`[data-parity-target="calendar-root"]`)).toHaveClass(
        new RegExp(`semi-calendar-${mode === 'range' ? 'week' : mode}`),
      ),
      expect(pair.vue.page.locator(`[data-parity-target="calendar-root"]`)).toHaveClass(
        new RegExp(`semi-calendar-${mode === 'range' ? 'week' : mode}`),
      ),
    ]);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('.semi-calendar-month')).toHaveAttribute('role', 'grid');
    await expect(parityPage.locator('.semi-calendar-month [role="columnheader"]')).toHaveCount(7);
  }
  const reactMore = pair.react.page.locator('.semi-calendar-month-event-card-wrapper').first();
  const vueMore = pair.vue.page.locator('.semi-calendar-month-event-card-wrapper').first();
  await Promise.all([expect(reactMore).toBeVisible(), expect(vueMore).toBeVisible()]);
  await Promise.all([reactMore.click(), vueMore.click()]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-calendar-month-event-card')).toBeVisible(),
    expect(pair.vue.page.locator('.semi-calendar-month-event-card')).toBeVisible(),
  ]);
  const reactCard = pair.react.page.locator(
    '.semi-popover-wrapper:has(.semi-calendar-month-event-card)',
  );
  const vueCard = pair.vue.page.locator(
    '.semi-popover-wrapper:has(.semi-calendar-month-event-card)',
  );
  await Promise.all(
    [reactCard, vueCard].map((card) =>
      card.evaluate(async (element) => {
        await Promise.all(
          element
            .getAnimations({ subtree: true })
            .map((animation) => animation.finished.catch(() => undefined)),
        );
      }),
    ),
  );
  const [reactCardStyle, vueCardStyle, reactCardRect, vueCardRect] = await Promise.all([
    captureComputedStyle(reactCard, [
      'backgroundColor',
      'borderRadius',
      'boxShadow',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
    ]),
    captureComputedStyle(vueCard, [
      'backgroundColor',
      'borderRadius',
      'boxShadow',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
    ]),
    reactCard.boundingBox(),
    vueCard.boundingBox(),
  ]);
  expect(vueCardStyle).toEqual(reactCardStyle);
  expect(reactCardRect).not.toBeNull();
  expect(vueCardRect).not.toBeNull();
  for (const axis of ['x', 'y', 'width', 'height'] as const) {
    expect(Math.abs(vueCardRect![axis] - reactCardRect![axis])).toBeLessThanOrEqual(
      VISUAL_THRESHOLDS.boundingRectToleranceCssPx,
    );
  }
  await expect(reactCard).toHaveScreenshot('calendar-month-card-reference-light-en-US.png', {
    animations: 'disabled',
  });
  await expect(vueCard).toHaveScreenshot('calendar-month-card-vue-light-en-US.png', {
    animations: 'disabled',
  });
  const [reactCardScreenshot, vueCardScreenshot] = await Promise.all([
    reactCard.screenshot({ animations: 'disabled' }),
    vueCard.screenshot({ animations: 'disabled' }),
  ]);
  expect(reactCardScreenshot.byteLength).toBeGreaterThan(0);
  await expect(vueCardScreenshot).toMatchSnapshot('calendar-month-card-reference-light-en-US.png', {
    threshold: VISUAL_THRESHOLDS.screenshotThreshold,
    maxDiffPixelRatio: VISUAL_THRESHOLDS.maxDiffPixelRatio,
  });
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toContainText('更多：10/4'),
    expect(pair.vue.page.getByRole('status')).toContainText('更多：10/4'),
  ]);
  await Promise.all([
    pair.react.page.locator('.semi-calendar-month-event-card-close').click(),
    pair.vue.page.locator('.semi-calendar-month-event-card-close').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-calendar-month-event-card')).toBeHidden(),
    expect(pair.vue.page.locator('.semi-calendar-month-event-card')).toBeHidden(),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Calendar React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'calendar',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('calendar-reference');
      const vueTarget = pair.vue.page.getByTestId('calendar-vue');
      await expect(reactTarget).toHaveScreenshot(
        `calendar-reference-${viewportName}-${theme}.png`,
        { animations: 'disabled' },
      );
      await expect(vueTarget).toHaveScreenshot(`calendar-vue-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Calendar React/Vue RTL 与英文 Locale 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'calendar',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('calendar').targets) {
    await expectComparableTarget(pair, 'calendar', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('calendar-reference');
  const vueTarget = pair.vue.page.getByTestId('calendar-vue');
  await expect(reactTarget).toHaveScreenshot('calendar-reference-light-rtl-en-US.png', {
    animations: 'disabled',
  });
  await expect(vueTarget).toHaveScreenshot('calendar-vue-light-rtl-en-US.png', {
    animations: 'disabled',
  });
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Badge 参考场景来自本地 v2.102.0 并保留计数、圆点、溢出和自定义 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'badge',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.badgePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'badge')).toBe(true);
  const scenario = page.getByTestId('badge-reference');
  await expect(scenario.locator('.semi-badge')).toHaveCount(15);
  await expect(
    scenario.locator('[data-parity-target="badge-root"] > .semi-badge-count'),
  ).toHaveText('5');
  await expect(scenario.locator('[data-parity-target="badge-dot"] > .semi-badge-dot')).toHaveText(
    '',
  );
  await expect(
    scenario.locator('[data-parity-target="badge-overflow"] > .semi-badge-count'),
  ).toHaveText('99+');
  await expect(scenario.locator('.semi-badge-custom')).toHaveCount(1);
  await expect(scenario.locator('.semi-badge-block')).toHaveCount(2);
  expect(runtimeErrors).toEqual([]);
});

test('Badge React/Vue 行为、样式、几何和方向缺省一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'badge',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('badge').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('badge').targets) {
    await expectComparableTarget(pair, 'badge', target.id);
  }
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const scenario = parityPage.locator('[data-parity-scenario="badge"]');
    await expect(scenario.locator('.semi-badge')).toHaveCount(15);
    await expect(scenario.locator('.semi-badge-dot')).toHaveCount(3);
    await expect(scenario.locator('.semi-badge-custom')).toHaveCount(1);
    await expect(scenario.locator('.semi-badge-block')).toHaveCount(2);
    await expect(
      scenario.locator('[data-parity-target="badge-root"] > .semi-badge-count'),
    ).toHaveClass(/semi-badge-rightTop/);
  }
  await Promise.all([
    pair.react.page.locator('[data-parity-target="badge-root"]').click(),
    pair.vue.page.locator('[data-parity-target="badge-root"]').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('徽章已点击'),
    expect(pair.vue.page.getByRole('status')).toHaveText('徽章已点击'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Badge React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'badge',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('badge-reference');
      const vueTarget = pair.vue.page.getByTestId('badge-vue');
      await expect(reactTarget).toHaveScreenshot(`badge-reference-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      await expect(vueTarget).toHaveScreenshot(`badge-vue-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Badge React/Vue RTL 缺省位置、样式、几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'badge',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('badge').targets) {
    await expectComparableTarget(pair, 'badge', target.id);
  }
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const defaultCount = parityPage.locator(
      '[data-parity-target="badge-root"] > .semi-badge-count',
    );
    await expect(defaultCount).toHaveClass(/semi-badge-leftTop/);
    await expect(defaultCount).not.toHaveClass(/semi-badge-rightTop/);
  }
  const [reactPosition, vuePosition] = await Promise.all([
    captureComputedStyle(
      pair.react.page.locator('[data-parity-target="badge-root"] > .semi-badge-count'),
      ['left', 'right', 'top', 'transform'],
    ),
    captureComputedStyle(
      pair.vue.page.locator('[data-parity-target="badge-root"] > .semi-badge-count'),
      ['left', 'right', 'top', 'transform'],
    ),
  ]);
  expect(vuePosition).toEqual(reactPosition);
  const reactTarget = pair.react.page.getByTestId('badge-reference');
  const vueTarget = pair.vue.page.getByTestId('badge-vue');
  await expect(reactTarget).toHaveScreenshot('badge-reference-light-rtl.png', {
    animations: 'disabled',
  });
  await expect(vueTarget).toHaveScreenshot('badge-vue-light-rtl.png', {
    animations: 'disabled',
  });
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Card 参考场景来自本地 v2.102.0 并保留 Meta、actions、loading 与 Group DOM', async ({
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
      scenarioId: 'card',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.cardPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'card')).toBe(true);
  const scenario = page.getByTestId('card-reference');
  await expect(scenario.locator('.semi-card')).toHaveCount(8);
  await expect(scenario.locator('.semi-card-meta-wrapper-description')).toHaveText(
    '全面、易用、优质',
  );
  await expect(scenario.locator('.semi-card-body-actions-item')).toHaveCount(2);
  await expect(scenario.locator('.semi-skeleton-active')).toHaveCount(1);
  await expect(scenario.locator('.semi-card-group-grid > .semi-card')).toHaveCount(3);
  await expect(scenario.locator('[data-parity-target="card-loading"]')).toHaveAttribute(
    'aria-busy',
    'true',
  );
  expect(runtimeErrors).toEqual([]);
});

test('Card React/Vue 默认值、行为、样式、几何与 hover 一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'card',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('card').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('card').targets) {
    await expectComparableTarget(pair, 'card', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const basic = parityPage.locator('[data-parity-target="card-basic"]');
    const borderless = parityPage.locator('[data-parity-target="card-borderless"]');
    await expect(basic).toHaveClass(/semi-card-bordered/);
    await expect(basic.locator('.semi-card-header')).toHaveClass(/semi-card-header-bordered/);
    await expect(borderless).not.toHaveClass(/semi-card-bordered/);
    await expect(borderless.locator('.semi-card-header')).not.toHaveClass(
      /semi-card-header-bordered/,
    );
  }

  const reactHover = pair.react.page.locator('[data-parity-target="card-hover"]');
  const vueHover = pair.vue.page.locator('[data-parity-target="card-hover"]');
  await Promise.all([reactHover.hover(), vueHover.hover()]);
  await pair.react.page.waitForTimeout(350);
  const [reactShadow, vueShadow] = await Promise.all([
    captureComputedStyle(reactHover, ['boxShadow', 'cursor', 'transitionDuration']),
    captureComputedStyle(vueHover, ['boxShadow', 'cursor', 'transitionDuration']),
  ]);
  expect(vueShadow).toEqual(reactShadow);
  expect(reactShadow.boxShadow).not.toBe('none');

  const reactStart = pair.react.page
    .locator('[data-parity-target="card-complete"] .semi-card-body-actions-item')
    .nth(1)
    .getByRole('button');
  const vueStart = pair.vue.page
    .locator('[data-parity-target="card-complete"] .semi-card-body-actions-item')
    .nth(1)
    .getByRole('button');
  await Promise.all([reactStart.click(), vueStart.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('开始使用'),
    expect(pair.vue.page.getByRole('status')).toHaveText('开始使用'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Card React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'card',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('card-reference');
      const vueTarget = pair.vue.page.getByTestId('card-vue');
      await expect(reactTarget).toHaveScreenshot(`card-reference-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      await expect(vueTarget).toHaveScreenshot(`card-vue-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Card React/Vue RTL 样式、几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'card',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('card').targets) {
    await expectComparableTarget(pair, 'card', target.id);
  }
  const [reactMetaAvatar, vueMetaAvatar] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('.semi-card-meta-avatar'), [
      'marginLeft',
      'marginRight',
    ]),
    captureComputedStyle(pair.vue.page.locator('.semi-card-meta-avatar'), [
      'marginLeft',
      'marginRight',
    ]),
  ]);
  expect(vueMetaAvatar).toEqual(reactMetaAvatar);
  expect(reactMetaAvatar).toEqual({ marginLeft: '12px', marginRight: '0px' });

  const reactTarget = pair.react.page.getByTestId('card-reference');
  const vueTarget = pair.vue.page.getByTestId('card-vue');
  await expect(reactTarget).toHaveScreenshot('card-reference-light-rtl.png', {
    animations: 'disabled',
  });
  await expect(vueTarget).toHaveScreenshot('card-vue-light-rtl.png', {
    animations: 'disabled',
  });
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Carousel 参考场景来自本地 v2.102.0 并保留轮播 DOM 与无障碍基线', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'carousel',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.carouselPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'carousel')).toBe(true);
  const scenario = page.getByTestId('carousel-reference');
  await expect(scenario.locator('.semi-carousel')).toHaveCount(4);
  await expect(scenario.locator('.semi-carousel-content-fade')).toHaveCount(1);
  await expect(scenario.locator('.semi-carousel-indicator-columnar')).toHaveCount(1);
  await expect(scenario.locator('.semi-carousel-arrow-hover')).toHaveCount(1);
  await expect(
    scenario.locator('[data-parity-target="carousel-single"] .semi-carousel-arrow'),
  ).toHaveCount(0);
  await expect(
    scenario.locator('[data-parity-target="carousel-single"] .semi-carousel-indicator'),
  ).toHaveCount(0);
  await expect(scenario.locator('.semi-carousel-arrow-prev').first()).not.toHaveAttribute('role');
  await expect(scenario.locator('.semi-carousel-arrow-prev').first()).not.toHaveAttribute(
    'tabindex',
  );
  await expect(scenario.locator('[aria-label="Previous index"]')).toHaveCount(2);
  expect(runtimeErrors).toEqual([]);
});

test('Carousel React/Vue 默认值、切换、样式、几何和 hover 箭头一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'carousel',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('carousel').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('carousel').targets) {
    await expectComparableTarget(pair, 'carousel', target.id);
  }

  const reactNext = pair.react.page.locator(
    '[data-parity-target="carousel-basic"] .semi-carousel-arrow-next',
  );
  const vueNext = pair.vue.page.locator(
    '[data-parity-target="carousel-basic"] .semi-carousel-arrow-next',
  );
  await Promise.all([reactNext.click(), vueNext.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('当前：开发'),
    expect(pair.vue.page.getByRole('status')).toHaveText('当前：开发'),
  ]);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(
      parityPage.locator(
        '[data-parity-target="carousel-basic"] .semi-carousel-content-item-active',
      ),
    ).toContainText('开发');
    await expect(
      parityPage.locator(
        '[data-parity-target="carousel-basic"] .semi-carousel-content-item-slide-out',
      ),
    ).toContainText('设计');
    await expect(
      parityPage.locator(
        '[data-parity-target="carousel-basic"] .semi-carousel-content-item-slide-in',
      ),
    ).toContainText('开发');
  }

  const reactHover = pair.react.page.locator('[data-parity-target="carousel-columnar"]');
  const vueHover = pair.vue.page.locator('[data-parity-target="carousel-columnar"]');
  await Promise.all([reactHover.hover(), vueHover.hover()]);
  const [reactOpacity, vueOpacity] = await Promise.all([
    captureComputedStyle(reactHover.locator('.semi-carousel-arrow-prev'), ['opacity']),
    captureComputedStyle(vueHover.locator('.semi-carousel-arrow-prev'), ['opacity']),
  ]);
  expect(vueOpacity).toEqual(reactOpacity);
  expect(reactOpacity).toEqual({ opacity: '1' });
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Carousel React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'carousel',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('carousel-reference');
      const vueTarget = pair.vue.page.getByTestId('carousel-vue');
      await expect(reactTarget).toHaveScreenshot(
        `carousel-reference-${viewportName}-${theme}.png`,
        { animations: 'disabled' },
      );
      await expect(vueTarget).toHaveScreenshot(`carousel-vue-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Carousel React/Vue RTL 样式、几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'carousel',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('carousel').targets) {
    await expectComparableTarget(pair, 'carousel', target.id);
  }
  const [reactArrow, vueArrow] = await Promise.all([
    captureComputedStyle(
      pair.react.page.locator('[data-parity-target="carousel-basic"] .semi-carousel-arrow-prev'),
      ['left', 'right', 'transform'],
    ),
    captureComputedStyle(
      pair.vue.page.locator('[data-parity-target="carousel-basic"] .semi-carousel-arrow-prev'),
      ['left', 'right', 'transform'],
    ),
  ]);
  expect(vueArrow).toEqual(reactArrow);
  const reactTarget = pair.react.page.getByTestId('carousel-reference');
  const vueTarget = pair.vue.page.getByTestId('carousel-vue');
  await expect(reactTarget).toHaveScreenshot('carousel-reference-light-rtl.png', {
    animations: 'disabled',
  });
  await expect(vueTarget).toHaveScreenshot('carousel-vue-light-rtl.png', {
    animations: 'disabled',
  });
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Collapsible 参考场景来自本地 v2.102.0 并保留测量与无交互容器基线', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'collapsible',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.collapsiblePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'collapsible')).toBe(true);
  const scenario = page.getByTestId('collapsible-reference');
  await expect(scenario.locator('.semi-collapsible-wrapper')).toHaveCount(4);
  await expect(scenario.locator('[data-parity-target="collapsible-basic"]')).toHaveCSS(
    'height',
    '116px',
  );
  await expect(scenario.locator('[data-parity-target="collapsible-preview"]')).toHaveCSS(
    'height',
    '72px',
  );
  await expect(scenario.locator('[data-lazy-content]')).toHaveCount(0);
  await expect(scenario.locator('#collapsible-basic-content')).toHaveAttribute(
    'x-semi-prop',
    'children',
  );
  await expect(scenario.locator('[data-parity-target="collapsible-basic"]')).not.toHaveAttribute(
    'role',
  );
  expect(runtimeErrors).toEqual([]);
});

test('Collapsible React/Vue 开合、动效终态、懒渲染与动态重测一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'collapsible',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('collapsible').targets).toHaveLength(4);
  for (const target of assertScenarioComparable('collapsible').targets) {
    await expectComparableTarget(pair, 'collapsible', target.id);
  }

  const reactBasic = pair.react.page.locator('[data-parity-target="collapsible-basic"]');
  const vueBasic = pair.vue.page.locator('[data-parity-target="collapsible-basic"]');
  await Promise.all([
    pair.react.page.locator('[data-action="toggle-basic"]').click(),
    pair.vue.page.locator('[data-action="toggle-basic"]').click(),
  ]);
  await Promise.all([
    expect(reactBasic).toHaveClass(/semi-collapsible-transition/),
    expect(vueBasic).toHaveClass(/semi-collapsible-transition/),
  ]);
  const [reactMotion, vueMotion] = await Promise.all([
    captureComputedStyle(reactBasic, ['transitionDuration']),
    captureComputedStyle(vueBasic, ['transitionDuration']),
  ]);
  expect(vueMotion).toEqual(reactMotion);
  expect(reactMotion.transitionDuration).toBe('0.25s');
  await Promise.all([
    expect(reactBasic).not.toHaveClass(/semi-collapsible-transition/),
    expect(vueBasic).not.toHaveClass(/semi-collapsible-transition/),
  ]);
  await Promise.all([
    expect(reactBasic).toHaveCSS('opacity', '0'),
    expect(vueBasic).toHaveCSS('opacity', '0'),
    expect(pair.react.page.getByRole('status')).toHaveText('基础面板：动效结束'),
    expect(pair.vue.page.getByRole('status')).toHaveText('基础面板：动效结束'),
  ]);
  const [reactClosedStyle, vueClosedStyle, reactClosedRect, vueClosedRect] = await Promise.all([
    captureComputedStyle(reactBasic, ['display', 'height', 'opacity', 'overflow']),
    captureComputedStyle(vueBasic, ['display', 'height', 'opacity', 'overflow']),
    reactBasic.boundingBox(),
    vueBasic.boundingBox(),
  ]);
  expect(vueClosedStyle).toEqual(reactClosedStyle);
  expect(reactClosedStyle).toEqual({
    display: 'block',
    height: '0px',
    opacity: '0',
    overflow: 'hidden',
  });
  expect(vueClosedRect).toEqual(reactClosedRect);

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const lazy = parityPage.locator('[data-parity-target="collapsible-lazy"]');
    await parityPage.locator('[data-action="toggle-lazy"]').click();
    await expect(lazy.locator('[data-lazy-content]')).toHaveCount(1);
    await parityPage.locator('[data-action="toggle-lazy"]').click();
    await expect(lazy.locator('[data-lazy-content]')).toHaveCount(1);
    await parityPage.locator('[data-action="add-row"]').click();
  }
  await expectComparableTarget(pair, 'collapsible', 'collapsible-adaptive');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Collapsible React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'collapsible',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('collapsible').targets) {
        await expectComparableTarget(pair, 'collapsible', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('collapsible-reference');
      const vueTarget = pair.vue.page.getByTestId('collapsible-vue');
      await expect(reactTarget).toHaveScreenshot(
        `collapsible-reference-${viewportName}-${theme}.png`,
        { animations: 'disabled' },
      );
      await expect(vueTarget).toHaveScreenshot(`collapsible-vue-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Collapsible React/Vue RTL 几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'collapsible',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('collapsible').targets) {
    await expectComparableTarget(pair, 'collapsible', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('collapsible-reference');
  const vueTarget = pair.vue.page.getByTestId('collapsible-vue');
  await expect(reactTarget).toHaveScreenshot('collapsible-reference-light-rtl.png', {
    animations: 'disabled',
  });
  await expect(vueTarget).toHaveScreenshot('collapsible-vue-light-rtl.png', {
    animations: 'disabled',
  });
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Descriptions 参考场景来自本地 v2.102.0 并保留 table/span/hidden 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'descriptions',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  expect(referenceSourceWasRequested(requestedUrls, 'descriptions')).toBe(true);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.descriptionsPublicEntry,
  );
  const scenario = page.getByTestId('descriptions-reference');
  await expect(scenario.locator('.semi-descriptions')).toHaveCount(7);
  await expect(
    scenario.locator('[data-parity-target="descriptions-horizontal"] tbody > tr'),
  ).toHaveCount(2);
  await expect(
    scenario
      .locator('[data-parity-target="descriptions-horizontal"] tbody > tr')
      .last()
      .locator('td')
      .last(),
  ).toHaveAttribute('colspan', '3');
  await expect(scenario).not.toContainText('不可见');
  expect(runtimeErrors).toEqual([]);
});

test('Descriptions React/Vue DOM、computed style、几何与字节像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'descriptions',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('descriptions').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('descriptions').targets) {
    await expectComparableTarget(pair, 'descriptions', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const scenario = parityPage.locator('.descriptions-scenario');
    await expect(scenario.locator('.semi-descriptions-center')).toHaveCount(2);
    await expect(scenario.locator('.semi-descriptions-plain')).toHaveCount(1);
    await expect(scenario.locator('.semi-descriptions-double')).toHaveCount(3);
    await expect(scenario.locator('.semi-descriptions-horizontal')).toHaveCount(1);
    await expect(scenario.locator('[tabindex]')).toHaveCount(0);
    await expect(scenario).not.toContainText('不可见');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Descriptions React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'descriptions',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('descriptions').targets) {
        await expectComparableTarget(pair, 'descriptions', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('descriptions-reference');
      const vueTarget = pair.vue.page.getByTestId('descriptions-vue');
      await expect(reactTarget).toHaveScreenshot(
        `descriptions-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`descriptions-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Descriptions React/Vue RTL 几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'descriptions',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('descriptions').targets) {
    await expectComparableTarget(pair, 'descriptions', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('descriptions-reference');
  const vueTarget = pair.vue.page.getByTestId('descriptions-vue');
  await expect(reactTarget).toHaveScreenshot('descriptions-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('descriptions-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Dropdown 参考场景来自本地 v2.102.0 并保留 Portal/Menu/Item 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'dropdown',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  expect(referenceSourceWasRequested(requestedUrls, 'dropdown')).toBe(true);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.dropdownPublicEntry,
  );
  const scenario = page.getByTestId('dropdown-reference');
  await expect(scenario.locator('.dropdown-parity-menu')).toBeVisible();
  await expect(scenario.locator('.dropdown-parity-menu .semi-dropdown-item')).toHaveCount(3);
  await expect(scenario.locator('.dropdown-parity-menu .semi-dropdown-divider')).toHaveCount(1);
  await expect(scenario.locator('.semi-dropdown-item-active .semi-icon-tick')).toHaveCount(1);
  await expect(scenario.locator('.semi-dropdown-item-disabled')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  expect(runtimeErrors).toEqual([]);
});

test('Dropdown React/Vue DOM、键盘、焦点、computed style、几何与字节像素一致', async ({
  context,
}) => {
  const pair = await openParityPages(context, {
    scenarioId: 'dropdown',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('dropdown').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('dropdown').targets) {
    await expectComparableTarget(pair, 'dropdown', target.id);
  }

  const reactTrigger = pair.react.page.locator('[data-action="open-dropdown"]');
  const vueTrigger = pair.vue.page.locator('[data-action="open-dropdown"]');
  await Promise.all([reactTrigger.click(), vueTrigger.click()]);
  const reactItems = pair.react.page.locator('.dropdown-interactive-menu .semi-dropdown-item');
  const vueItems = pair.vue.page.locator('.dropdown-interactive-menu .semi-dropdown-item');
  await Promise.all([expect(reactItems).toHaveCount(3), expect(vueItems).toHaveCount(3)]);
  await Promise.all([
    expect(reactItems.nth(1)).toBeFocused(),
    expect(vueItems.nth(1)).toBeFocused(),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('ArrowDown'),
    pair.vue.page.keyboard.press('ArrowDown'),
  ]);
  await Promise.all([
    expect(reactItems.nth(2)).toBeFocused(),
    expect(vueItems.nth(2)).toBeFocused(),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('Enter'),
    pair.vue.page.keyboard.press('Enter'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('已选择：Beta'),
    expect(pair.vue.page.getByRole('status')).toHaveText('已选择：Beta'),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('Escape'),
    pair.vue.page.keyboard.press('Escape'),
  ]);
  await Promise.all([expect(reactTrigger).toBeFocused(), expect(vueTrigger).toBeFocused()]);
  await Promise.all([
    expect(pair.react.page.locator('.dropdown-interactive-menu')).toHaveCount(0),
    expect(pair.vue.page.locator('.dropdown-interactive-menu')).toHaveCount(0),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Dropdown React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'dropdown',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('dropdown').targets) {
        await expectComparableTarget(pair, 'dropdown', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('dropdown-reference');
      const vueTarget = pair.vue.page.getByTestId('dropdown-vue');
      await expect(reactTarget).toHaveScreenshot(`dropdown-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`dropdown-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Dropdown React/Vue RTL 几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'dropdown',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('dropdown').targets) {
    await expectComparableTarget(pair, 'dropdown', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('dropdown-reference');
  const vueTarget = pair.vue.page.getByTestId('dropdown-vue');
  await expect(reactTarget).toHaveScreenshot('dropdown-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('dropdown-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Illustrations 参考场景来自本地 v2.102.0 并保留完整公开导出', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'illustrations',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  expect(referenceSourceWasRequested(requestedUrls, 'illustrations')).toBe(true);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.illustrationsPublicEntry,
  );
  const scenario = page.getByTestId('illustrations-reference');
  await expect(scenario.locator('svg[data-illustration]')).toHaveCount(16);
  await expect(scenario.locator('[data-illustration="NoContent"]')).toHaveAttribute(
    'viewBox',
    '0 0 200 200',
  );
  await expect(scenario.locator('[data-illustration="NoContentDark"]')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  expect(runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Illustrations React/Vue 全量视觉：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'illustrations',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('illustrations').targets) {
        await expectComparableTarget(pair, 'illustrations', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('illustrations-reference');
      const vueTarget = pair.vue.page.getByTestId('illustrations-vue');
      await expect(reactTarget).toHaveScreenshot(
        `illustrations-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`illustrations-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Empty 参考场景来自本地 v2.102.0 并保留图片、内容与 SVG 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'empty',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  expect(referenceSourceWasRequested(requestedUrls, 'empty')).toBe(true);
  expect(referenceSourceWasRequested(requestedUrls, 'illustrations')).toBe(true);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.emptyPublicEntry,
  );
  const scenario = page.getByTestId('empty-reference');
  await expect(scenario.locator('.semi-empty')).toHaveCount(5);
  await expect(
    scenario.locator('[data-parity-target="empty-vertical"] .empty-scenario__illustration'),
  ).toHaveAttribute('data-variant', 'light');
  await expect(
    scenario.locator('[data-parity-target="empty-vertical"] .empty-scenario__illustration'),
  ).toHaveAttribute('viewBox', '0 0 200 200');
  await expect(
    scenario.locator('[data-parity-target="empty-vertical"] .empty-scenario__illustration'),
  ).toHaveCSS('width', '150px');
  await expect(scenario.locator('[data-parity-target="empty-no-image"] h6')).toHaveText(
    '未找到匹配结果',
  );
  await expect(scenario.locator('[data-parity-target="empty-symbol"] svg')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await expect(scenario.locator('[data-parity-target="empty-string-image"] img')).toHaveAttribute(
    'alt',
    '添加一个项目',
  );
  expect(runtimeErrors).toEqual([]);
});

test('Empty React/Vue DOM、暗色切换、computed style、几何与字节像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'empty',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('empty').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('empty').targets) {
    await expectComparableTarget(pair, 'empty', target.id);
  }

  await Promise.all([
    expect(pair.react.page.locator('[data-parity-target="empty-vertical"] h4')).toHaveText(
      '暂无数据',
    ),
    expect(pair.vue.page.locator('[data-parity-target="empty-vertical"] h4')).toHaveText(
      '暂无数据',
    ),
    expect(pair.react.page.locator('[data-parity-target="empty-no-image"] h6')).toHaveCount(1),
    expect(pair.vue.page.locator('[data-parity-target="empty-no-image"] h6')).toHaveCount(1),
  ]);
  await Promise.all([
    pair.react.page.evaluate(() => document.body.setAttribute('theme-mode', 'dark')),
    pair.vue.page.evaluate(() => document.body.setAttribute('theme-mode', 'dark')),
  ]);
  await Promise.all([
    expect(
      pair.react.page.locator(
        '[data-parity-target="empty-vertical"] .empty-scenario__illustration',
      ),
    ).toHaveAttribute('data-variant', 'dark'),
    expect(
      pair.vue.page.locator('[data-parity-target="empty-vertical"] .empty-scenario__illustration'),
    ).toHaveAttribute('data-variant', 'dark'),
  ]);
  await Promise.all([
    pair.react.page.evaluate(() => document.body.setAttribute('theme-mode', 'light')),
    pair.vue.page.evaluate(() => document.body.setAttribute('theme-mode', 'light')),
  ]);
  await Promise.all([
    expect(
      pair.react.page.locator(
        '[data-parity-target="empty-horizontal"] .empty-scenario__illustration',
      ),
    ).toHaveAttribute('data-variant', 'light'),
    expect(
      pair.vue.page.locator(
        '[data-parity-target="empty-horizontal"] .empty-scenario__illustration',
      ),
    ).toHaveAttribute('data-variant', 'light'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Empty React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'empty',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all([
        expect(
          pair.react.page.locator(
            '[data-parity-target="empty-vertical"] .empty-scenario__illustration',
          ),
        ).toHaveAttribute('data-variant', theme),
        expect(
          pair.vue.page.locator(
            '[data-parity-target="empty-vertical"] .empty-scenario__illustration',
          ),
        ).toHaveAttribute('data-variant', theme),
      ]);
      for (const target of assertScenarioComparable('empty').targets) {
        await expectComparableTarget(pair, 'empty', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('empty-reference');
      const vueTarget = pair.vue.page.getByTestId('empty-vue');
      await expect(reactTarget).toHaveScreenshot(`empty-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`empty-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Empty React/Vue RTL 几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'empty',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('empty').targets) {
    await expectComparableTarget(pair, 'empty', target.id);
  }
  const reactContent = pair.react.page.locator(
    '[data-parity-target="empty-horizontal"] > .semi-empty-content',
  );
  const vueContent = pair.vue.page.locator(
    '[data-parity-target="empty-horizontal"] > .semi-empty-content',
  );
  await Promise.all([
    expect(reactContent).toHaveCSS('margin-right', '32px'),
    expect(vueContent).toHaveCSS('margin-right', '32px'),
  ]);
  const reactTarget = pair.react.page.getByTestId('empty-reference');
  const vueTarget = pair.vue.page.getByTestId('empty-vue');
  await expect(reactTarget).toHaveScreenshot('empty-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('empty-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Highlight 参考场景来自本地 v2.102.0 并保留匹配、正则与合并契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'highlight',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  expect(referenceSourceWasRequested(requestedUrls, 'highlight')).toBe(true);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.highlightPublicEntry,
  );
  const scenario = page.getByTestId('highlight-reference');
  await expect(scenario.locator('[data-parity-target="highlight-basic"] mark')).toHaveCount(2);
  await expect(scenario.locator('.highlight-scenario__custom').first()).toHaveText('Semi');
  await expect(scenario.locator('[data-parity-target="highlight-regex"] mark')).toHaveCount(2);
  await expect(scenario.locator('[data-parity-target="highlight-regex"] mark').nth(1)).toHaveText(
    'Design   System',
  );
  await expect(scenario.locator('[data-parity-target="highlight-overlap"] strong')).toHaveCount(2);
  await expect(
    scenario.locator('[data-parity-target="highlight-overlap"] strong').first(),
  ).toHaveText('design system');
  expect(runtimeErrors).toEqual([]);
});

test('Highlight React/Vue 文本、computed style、几何与字节像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'highlight',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('highlight').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('highlight').targets) {
    await expectComparableTarget(pair, 'highlight', target.id);
  }

  for (const framework of [pair.react, pair.vue]) {
    const scenario = framework.page.getByTestId(
      framework === pair.react ? 'highlight-reference' : 'highlight-vue',
    );
    await expect(scenario.locator('[data-parity-target="highlight-basic"]')).toHaveText(
      '从 Semi Design 到 Any Design，快速定义你的设计系统',
    );
    await expect(scenario.locator('[data-parity-target="highlight-regex"] mark')).toHaveCount(2);
    await expect(scenario.locator('[data-parity-target="highlight-overlap"] strong')).toHaveCount(
      2,
    );
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page.getByTestId('highlight-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('highlight-vue').screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Highlight React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'highlight',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('highlight').targets) {
        await expectComparableTarget(pair, 'highlight', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('highlight-reference');
      const vueTarget = pair.vue.page.getByTestId('highlight-vue');
      await expect(reactTarget).toHaveScreenshot(
        `highlight-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`highlight-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Highlight React/Vue RTL 几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'highlight',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('highlight').targets) {
    await expectComparableTarget(pair, 'highlight', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('highlight-reference');
  const vueTarget = pair.vue.page.getByTestId('highlight-vue');
  await expect(reactTarget).toHaveScreenshot('highlight-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('highlight-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

async function waitForImageScenario(page: import('@playwright/test').Page): Promise<void> {
  await expect(page.locator('.image-scenario img.semi-image-img')).toHaveCount(3);
  await page.locator('.image-scenario img.semi-image-img').evaluateAll(async (images) => {
    await Promise.all(
      images.map((image) => {
        const element = image as HTMLImageElement;
        if (element.complete && element.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
          element.addEventListener('load', () => resolve(), { once: true });
          element.addEventListener('error', () => reject(new Error('Image scenario load failed')), {
            once: true,
          });
        });
      }),
    );
  });
  await expect(page.locator('.image-scenario .semi-image-overlay')).toHaveCount(0);
}

test('Image 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'image',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await waitForImageScenario(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.imagePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'image')).toBe(true);
  await expect(page.getByTestId('image-reference').locator('.semi-image')).toHaveCount(3);
});

test('Image React/Vue 缩略图与分组预览行为一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'image',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([waitForImageScenario(pair.react.page), waitForImageScenario(pair.vue.page)]);
  for (const target of assertScenarioComparable('image').targets) {
    await expectComparableTarget(pair, 'image', target.id);
  }
  const [reactClosed, vueClosed] = await Promise.all([
    pair.react.page.getByTestId('image-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('image-vue').screenshot({ animations: 'disabled' }),
  ]);
  expect(vueClosed.equals(reactClosed)).toBe(true);

  await Promise.all([
    pair.react.page.locator('[data-parity-target="image-group-first"]').click(),
    pair.vue.page.locator('[data-parity-target="image-group-first"]').click(),
  ]);
  const reactPreview = pair.react.page.locator('.semi-image-preview');
  const vuePreview = pair.vue.page.locator('.semi-image-preview');
  await Promise.all([expect(reactPreview).toBeVisible(), expect(vuePreview).toBeVisible()]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-image-preview-header-title')).toHaveText('蓝色山景'),
    expect(pair.vue.page.locator('.semi-image-preview-header-title')).toHaveText('蓝色山景'),
    expect(pair.react.page.locator('.semi-image-preview-footer-page')).toHaveText('1/2'),
    expect(pair.vue.page.locator('.semi-image-preview-footer-page')).toHaveText('1/2'),
  ]);
  await Promise.all([
    pair.react.page.locator('.semi-image-preview-image-img').evaluate(async (image) => {
      const element = image as HTMLImageElement;
      if (element.complete && element.naturalWidth > 0) return;
      await new Promise<void>((resolve) =>
        element.addEventListener('load', () => resolve(), { once: true }),
      );
    }),
    pair.vue.page.locator('.semi-image-preview-image-img').evaluate(async (image) => {
      const element = image as HTMLImageElement;
      if (element.complete && element.naturalWidth > 0) return;
      await new Promise<void>((resolve) =>
        element.addEventListener('load', () => resolve(), { once: true }),
      );
    }),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-image-preview-image-spin')).toHaveCount(0),
    expect(pair.vue.page.locator('.semi-image-preview-image-spin')).toHaveCount(0),
  ]);
  await expect(reactPreview).toHaveScreenshot('image-preview-open-reference.png');
  await expect(vuePreview).toHaveScreenshot('image-preview-open-vue.png');
  await expect(pair.react.page.locator('.semi-image-preview-footer')).toHaveScreenshot(
    'image-preview-footer-reference.png',
  );
  await expect(pair.vue.page.locator('.semi-image-preview-footer')).toHaveScreenshot(
    'image-preview-footer-vue.png',
  );
  const [reactImage, vueImage, reactFooter, vueFooter] = await Promise.all([
    pair.react.page.locator('.semi-image-preview-image-img').screenshot({ animations: 'disabled' }),
    pair.vue.page.locator('.semi-image-preview-image-img').screenshot({ animations: 'disabled' }),
    pair.react.page.locator('.semi-image-preview-footer').screenshot({ animations: 'disabled' }),
    pair.vue.page.locator('.semi-image-preview-footer').screenshot({ animations: 'disabled' }),
  ]);
  expect(vueImage.equals(reactImage)).toBe(true);
  expect(reactFooter.length).toBeGreaterThan(0);
  expect(vueFooter.length).toBeGreaterThan(0);
  for (const selector of [
    '.semi-image-preview-footer',
    '.semi-image-preview-footer-page',
    '.semi-slider',
    '.semi-slider-handle',
  ]) {
    const reactNode = pair.react.page.locator(selector);
    const vueNode = pair.vue.page.locator(selector);
    const [reactStyle, vueStyle, reactRect, vueRect] = await Promise.all([
      captureComputedStyle(reactNode, ['backgroundColor', 'color', 'display', 'lineHeight']),
      captureComputedStyle(vueNode, ['backgroundColor', 'color', 'display', 'lineHeight']),
      reactNode.boundingBox(),
      vueNode.boundingBox(),
    ]);
    expect(vueStyle).toEqual(reactStyle);
    expect(reactRect).not.toBeNull();
    expect(vueRect).not.toBeNull();
    for (const axis of ['x', 'y', 'width', 'height'] as const) {
      expect(Math.abs(vueRect![axis] - reactRect![axis])).toBeLessThanOrEqual(
        VISUAL_THRESHOLDS.boundingRectToleranceCssPx,
      );
    }
  }
  const [reactPreviewStyle, vuePreviewStyle, reactPreviewRect, vuePreviewRect] = await Promise.all([
    captureComputedStyle(reactPreview, ['backgroundColor', 'height', 'position', 'width']),
    captureComputedStyle(vuePreview, ['backgroundColor', 'height', 'position', 'width']),
    reactPreview.boundingBox(),
    vuePreview.boundingBox(),
  ]);
  expect(vuePreviewStyle).toEqual(reactPreviewStyle);
  expect(vuePreviewRect).toEqual(reactPreviewRect);
  expect(await pair.react.page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  expect(await pair.vue.page.evaluate(() => document.body.style.overflow)).toBe('hidden');

  await Promise.all([
    pair.react.page
      .locator('.semi-image-preview-image-img')
      .dispatchEvent('wheel', { deltaY: 100 }),
    pair.vue.page.locator('.semi-image-preview-image-img').dispatchEvent('wheel', { deltaY: 100 }),
  ]);
  const [reactZoom, vueZoom] = await Promise.all([
    pair.react.page.locator('.semi-slider-handle').getAttribute('aria-valuenow'),
    pair.vue.page.locator('.semi-slider-handle').getAttribute('aria-valuenow'),
  ]);
  expect(Number(reactZoom)).toBeCloseTo(490, 8);
  expect(Number(vueZoom)).toBeCloseTo(490, 8);

  await Promise.all([
    pair.react.page.locator('.semi-icon-real_size_stroked').click(),
    pair.vue.page.locator('.semi-icon-real_size_stroked').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-icon-window_adaption_stroked')).toBeVisible(),
    expect(pair.vue.page.locator('.semi-icon-window_adaption_stroked')).toBeVisible(),
  ]);
  await Promise.all([
    pair.react.page.locator('.semi-icon-rotate').click(),
    pair.vue.page.locator('.semi-icon-rotate').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-image-preview-image-img')).toHaveCSS(
      'transform',
      'matrix(0, -1, 1, 0, 0, 0)',
    ),
    expect(pair.vue.page.locator('.semi-image-preview-image-img')).toHaveCSS(
      'transform',
      'matrix(0, -1, 1, 0, 0, 0)',
    ),
  ]);

  await Promise.all([
    pair.react.page.locator('.semi-image-preview-next').click(),
    pair.vue.page.locator('.semi-image-preview-next').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-image-preview-footer-page')).toHaveText('2/2'),
    expect(pair.vue.page.locator('.semi-image-preview-footer-page')).toHaveText('2/2'),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('Escape'),
    pair.vue.page.keyboard.press('Escape'),
  ]);
  await Promise.all([expect(reactPreview).toHaveCount(0), expect(vuePreview).toHaveCount(0)]);
  expect(await pair.react.page.evaluate(() => document.body.style.overflow)).toBe('');
  expect(await pair.vue.page.evaluate(() => document.body.style.overflow)).toBe('');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Image React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'image',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all([
        waitForImageScenario(pair.react.page),
        waitForImageScenario(pair.vue.page),
      ]);
      for (const target of assertScenarioComparable('image').targets) {
        await expectComparableTarget(pair, 'image', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('image-reference');
      const vueTarget = pair.vue.page.getByTestId('image-vue');
      await expect(reactTarget).toHaveScreenshot(`image-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`image-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Image React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'image',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([waitForImageScenario(pair.react.page), waitForImageScenario(pair.vue.page)]);
  for (const target of assertScenarioComparable('image').targets) {
    await expectComparableTarget(pair, 'image', target.id);
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page.getByTestId('image-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('image-vue').screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

async function waitForCropperScenario(page: import('@playwright/test').Page): Promise<void> {
  await expect(page.locator('.cropper-scenario .semi-cropper-img')).toHaveCount(2);
  await page.locator('.cropper-scenario .semi-cropper-img').evaluateAll(async (images) => {
    await Promise.all(
      images.map((image) => {
        const element = image as HTMLImageElement;
        if (element.complete && element.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
          element.addEventListener('load', () => resolve(), { once: true });
          element.addEventListener('error', () => reject(new Error('Cropper image load failed')), {
            once: true,
          });
        });
      }),
    );
  });
  await expect(
    page.locator('[data-parity-target="cropper-basic"] .semi-cropper-box-corner'),
  ).toHaveCount(8);
  await expect(
    page.locator('[data-parity-target="cropper-round"] .semi-cropper-box-corner'),
  ).toHaveCount(4);
}

test('Cropper 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'cropper',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await waitForCropperScenario(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.cropperPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'cropper')).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('Cropper React/Vue 几何、滚轮与拖动行为一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'cropper',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([
    waitForCropperScenario(pair.react.page),
    waitForCropperScenario(pair.vue.page),
  ]);
  for (const target of assertScenarioComparable('cropper').targets) {
    await expectComparableTarget(pair, 'cropper', target.id);
  }

  const reactRoot = pair.react.page.locator('[data-parity-target="cropper-basic"] > .semi-cropper');
  const vueRoot = pair.vue.page.locator('[data-parity-target="cropper-basic"] > .semi-cropper');
  await Promise.all([
    reactRoot.dispatchEvent('wheel', { clientX: 180, clientY: 110, deltaY: -1 }),
    vueRoot.dispatchEvent('wheel', { clientX: 180, clientY: 110, deltaY: -1 }),
  ]);
  const [reactZoomStyle, vueZoomStyle] = await Promise.all([
    reactRoot.locator('.semi-cropper-img').getAttribute('style'),
    vueRoot.locator('.semi-cropper-img').getAttribute('style'),
  ]);
  expect(vueZoomStyle).toBe(reactZoomStyle);

  const [reactMask, vueMask] = [
    reactRoot.locator('.semi-cropper-mask'),
    vueRoot.locator('.semi-cropper-mask'),
  ];
  const [reactBox, vueBox] = await Promise.all([reactMask.boundingBox(), vueMask.boundingBox()]);
  if (!reactBox || !vueBox) throw new Error('Cropper mask is not measurable');
  await pair.react.page.mouse.move(reactBox.x + 80, reactBox.y + 80);
  await pair.vue.page.mouse.move(vueBox.x + 80, vueBox.y + 80);
  await Promise.all([pair.react.page.mouse.down(), pair.vue.page.mouse.down()]);
  await pair.react.page.mouse.move(reactBox.x + 100, reactBox.y + 92);
  await pair.vue.page.mouse.move(vueBox.x + 100, vueBox.y + 92);
  await Promise.all([pair.react.page.mouse.up(), pair.vue.page.mouse.up()]);
  const [reactDragStyle, vueDragStyle] = await Promise.all([
    reactRoot.locator('.semi-cropper-img').getAttribute('style'),
    vueRoot.locator('.semi-cropper-img').getAttribute('style'),
  ]);
  expect(vueDragStyle).toBe(reactDragStyle);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Cropper React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'cropper',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all([
        waitForCropperScenario(pair.react.page),
        waitForCropperScenario(pair.vue.page),
      ]);
      for (const target of assertScenarioComparable('cropper').targets) {
        await expectComparableTarget(pair, 'cropper', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('cropper-reference');
      const vueTarget = pair.vue.page.getByTestId('cropper-vue');
      await expect(reactTarget).toHaveScreenshot(`cropper-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`cropper-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Cropper React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'cropper',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([
    waitForCropperScenario(pair.react.page),
    waitForCropperScenario(pair.vue.page),
  ]);
  for (const target of assertScenarioComparable('cropper').targets) {
    await expectComparableTarget(pair, 'cropper', target.id);
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page.getByTestId('cropper-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('cropper-vue').screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('List 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'list',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.locator('.list-scenario .semi-list')).toHaveCount(3);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.listPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'list')).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('List React/Vue DOM、computed style 与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'list',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([
    expect(pair.react.page.locator('.list-scenario .semi-list')).toHaveCount(3),
    expect(pair.vue.page.locator('.list-scenario .semi-list')).toHaveCount(3),
  ]);
  for (const target of assertScenarioComparable('list').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'list', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('[data-parity-target="list-basic"] .semi-list-item')).toHaveCount(2);
    await expect(page.locator('[data-parity-target="list-grid"] .semi-col-12')).toHaveCount(2);
    await expect(
      page.locator('[data-parity-target="list-horizontal"] .semi-list-item'),
    ).toHaveCount(3);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`List React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'list',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all([
        expect(pair.react.page.locator('.list-scenario .semi-list')).toHaveCount(3),
        expect(pair.vue.page.locator('.list-scenario .semi-list')).toHaveCount(3),
      ]);
      for (const target of assertScenarioComparable('list').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'list', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('list-reference');
      const vueTarget = pair.vue.page.getByTestId('list-vue');
      await expect(reactTarget).toHaveScreenshot(`list-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`list-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('List React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'list',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([
    expect(pair.react.page.locator('.list-scenario .semi-list')).toHaveCount(3),
    expect(pair.vue.page.locator('.list-scenario .semi-list')).toHaveCount(3),
  ]);
  for (const target of assertScenarioComparable('list').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'list', target.id));
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page.getByTestId('list-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('list-vue').screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Modal 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'modal',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(
    page.locator('[data-parity-target="modal-basic"] .semi-modal-content'),
  ).toBeVisible();
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.modalPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'modal')).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('Modal React/Vue DOM、交互、computed style 与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'modal',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  const dialogs = [pair.react.page, pair.vue.page].map((page) =>
    page.locator('[data-parity-target="modal-basic"] .semi-modal-content'),
  );
  await Promise.all(dialogs.map((dialog) => expect(dialog).toBeVisible()));
  for (const target of assertScenarioComparable('modal').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'modal', target.id));
  }
  const [reactMaskStyle, vueMaskStyle] = await Promise.all([
    captureComputedStyle(
      pair.react.page.locator('[data-parity-target="modal-basic"] > .semi-modal-mask'),
      ['backgroundColor', 'height', 'position', 'width'],
    ),
    captureComputedStyle(
      pair.vue.page.locator('[data-parity-target="modal-basic"] > .semi-modal-mask'),
      ['backgroundColor', 'height', 'position', 'width'],
    ),
  ]);
  expect(vueMaskStyle).toEqual(reactMaskStyle);
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    await expect(page.locator('.semi-modal-title')).toHaveText('发布变更');
    await expect(page.locator('.semi-modal-footer button')).toHaveCount(2);
  }

  await Promise.all([
    pair.react.page.keyboard.press('Escape'),
    pair.vue.page.keyboard.press('Escape'),
  ]);
  await Promise.all(dialogs.map((dialog) => expect(dialog).toBeHidden()));
  await Promise.all([
    pair.react.page.locator('[data-action="open-modal"]').click(),
    pair.vue.page.locator('[data-action="open-modal"]').click(),
  ]);
  await Promise.all(dialogs.map((dialog) => expect(dialog).toBeVisible()));
  await Promise.all([
    pair.react.page
      .locator('[data-parity-target="modal-basic"] .semi-modal-wrap')
      .click({ position: { x: 4, y: 4 } }),
    pair.vue.page
      .locator('[data-parity-target="modal-basic"] .semi-modal-wrap')
      .click({ position: { x: 4, y: 4 } }),
  ]);
  await Promise.all(dialogs.map((dialog) => expect(dialog).toBeHidden()));
  await Promise.all([
    expect(pair.react.page.locator('[data-action="open-modal"]')).toBeFocused(),
    expect(pair.vue.page.locator('[data-action="open-modal"]')).toBeFocused(),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Modal React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'modal',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all([
        expect(
          pair.react.page.locator('[data-parity-target="modal-basic"] .semi-modal-content'),
        ).toBeVisible(),
        expect(
          pair.vue.page.locator('[data-parity-target="modal-basic"] .semi-modal-content'),
        ).toBeVisible(),
      ]);
      for (const target of assertScenarioComparable('modal').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'modal', target.id));
      }
      const reactTarget = pair.react.page.locator(
        '[data-parity-target="modal-basic"] .semi-modal-content',
      );
      const vueTarget = pair.vue.page.locator(
        '[data-parity-target="modal-basic"] .semi-modal-content',
      );
      await expect(reactTarget).toHaveScreenshot(`modal-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`modal-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        pair.react.page
          .locator('[data-parity-target="modal-basic"] .semi-modal-body')
          .screenshot({ animations: 'disabled' }),
        pair.vue.page
          .locator('[data-parity-target="modal-basic"] .semi-modal-body')
          .screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Modal React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'modal',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([
    expect(
      pair.react.page.locator('[data-parity-target="modal-basic"] .semi-modal-content'),
    ).toBeVisible(),
    expect(
      pair.vue.page.locator('[data-parity-target="modal-basic"] .semi-modal-content'),
    ).toBeVisible(),
  ]);
  await expect(
    pair.react.page.locator('[data-parity-target="modal-basic"] .semi-modal-footer'),
  ).toHaveScreenshot('modal-reference-rtl.png');
  await expect(
    pair.vue.page.locator('[data-parity-target="modal-basic"] .semi-modal-footer'),
  ).toHaveScreenshot('modal-vue-rtl.png');
  for (const target of assertScenarioComparable('modal').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'modal', target.id));
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page
      .locator('[data-parity-target="modal-basic"] .semi-modal-body')
      .screenshot({ animations: 'disabled' }),
    pair.vue.page
      .locator('[data-parity-target="modal-basic"] .semi-modal-body')
      .screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('OverflowList 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  test.setTimeout(120_000);
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'overflow-list',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(
    page.locator('[data-parity-target="overflow-list-end"] > .semi-overflow-list'),
  ).toHaveCSS('visibility', 'visible');
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.overflowListPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'overflow-list')).toBe(true);
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.vue.baseUrl, {
      scenarioId: 'overflow-list',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByRole('heading', { name: PARITY_APPLICATIONS.vue.heading })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test('OverflowList React/Vue 折叠、scroll、computed style 与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'overflow-list',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  const endRoots = [pair.react.page, pair.vue.page].map((page) =>
    page.locator('[data-parity-target="overflow-list-end"] > .semi-overflow-list'),
  );
  await Promise.all(endRoots.map((root) => expect(root).toHaveCSS('visibility', 'visible')));
  for (const target of assertScenarioComparable('overflow-list').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'overflow-list', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(
      page.locator('[data-parity-target="overflow-list-end"] .semi-overflow-list-item'),
    ).toHaveCount(2);
    await expect(
      page.locator('[data-parity-target="overflow-list-start"] .semi-overflow-list-item'),
    ).toHaveCount(2);
    await expect(
      page.locator('[data-parity-target="overflow-list-scroll"] [data-scrollkey]'),
    ).toHaveCount(5);
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page.getByTestId('overflow-list-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('overflow-list-vue').screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`OverflowList React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'overflow-list',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all(
        [pair.react.page, pair.vue.page].map((page) =>
          expect(
            page.locator('[data-parity-target="overflow-list-end"] > .semi-overflow-list'),
          ).toHaveCSS('visibility', 'visible'),
        ),
      );
      for (const target of assertScenarioComparable('overflow-list').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'overflow-list', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('overflow-list-reference');
      const vueTarget = pair.vue.page.getByTestId('overflow-list-vue');
      await expect(reactTarget).toHaveScreenshot(
        `overflow-list-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`overflow-list-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('OverflowList React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'overflow-list',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      expect(
        page.locator('[data-parity-target="overflow-list-end"] > .semi-overflow-list'),
      ).toHaveCSS('visibility', 'visible'),
    ),
  );
  for (const target of assertScenarioComparable('overflow-list').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'overflow-list', target.id));
  }
  const reactTarget = pair.react.page.getByTestId('overflow-list-reference');
  const vueTarget = pair.vue.page.getByTestId('overflow-list-vue');
  await expect(reactTarget).toHaveScreenshot('overflow-list-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('overflow-list-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Popover 参考场景来自本地 v2.102.0 并保留 Portal、卡片、箭头与角色', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'popover',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.popoverPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'popover')).toBe(true);
  await expect(page.getByTestId('popover-reference').locator(':scope > .semi-portal')).toHaveCount(
    2,
  );
  await expect(page.locator('.popover-target-bottom')).toHaveAttribute('role', 'dialog');
  await expect(page.locator('.popover-target-bottom')).toHaveAttribute('x-placement', 'bottom');
  await expect(page.locator('.popover-target-right .semi-popover-icon-arrow')).toHaveCount(1);
  await expect(page.locator('.popover-target-right .semi-popover-icon-arrow path')).toHaveCount(2);
  expect(runtimeErrors).toEqual([]);
});

test('Popover React/Vue 定位、click/Escape、焦点与 Element/Document scroll 重定位一致', async ({
  context,
}) => {
  const pair = await openParityPages(context, {
    scenarioId: 'popover',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('popover').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'popover', target.id));
  }

  const pages = [pair.react.page, pair.vue.page];
  await Promise.all(
    pages.map((page) => page.locator('[data-parity-target="popover-trigger-click"]').click()),
  );
  await Promise.all(
    pages.flatMap((page) => [
      expect(page.locator('.popover-target-click')).toBeVisible(),
      expect(page.locator('.popover-target-click')).toHaveAttribute('role', 'dialog'),
      expect(page.locator('[data-parity-target="popover-trigger-click"]')).toHaveAttribute(
        'aria-haspopup',
        'dialog',
      ),
    ]),
  );
  await Promise.all(
    pages.map((page) =>
      page.locator('[data-parity-target="popover-trigger-click"]').press('ArrowDown'),
    ),
  );
  await Promise.all(
    pages.map((page) => expect(page.locator('.popover-scenario__inside-action')).toBeFocused()),
  );
  await Promise.all(
    pages.map((page) => page.locator('.popover-scenario__inside-action').press('Escape')),
  );
  await Promise.all(
    pages.flatMap((page) => [
      expect(page.locator('.popover-target-click')).toHaveCount(0),
      expect(page.locator('[data-parity-target="popover-trigger-click"]')).toBeFocused(),
    ]),
  );

  await Promise.all(
    pages.map((page) => page.locator('[data-parity-target="popover-trigger-hover"]').hover()),
  );
  await Promise.all(
    pages.flatMap((page) => [
      expect(page.locator('.popover-target-hover')).toBeVisible(),
      expect(page.locator('.popover-target-hover')).toHaveAttribute('role', 'tooltip'),
    ]),
  );
  await Promise.all(
    pages.map((page) =>
      page.getByTestId('popover-scroll-host').evaluate((element) => {
        element.scrollLeft = 12;
        element.dispatchEvent(new Event('scroll'));
      }),
    ),
  );
  await Promise.all(
    pages.map((page) =>
      page.evaluate(() => document.dispatchEvent(new Event('scroll', { bubbles: true }))),
    ),
  );
  await Promise.all(pages.map((page) => page.waitForTimeout(50)));

  const captureGeometry = async (page: (typeof pair.react)['page']) =>
    page.locator('.popover-target-bottom').evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { height: rect.height, left: rect.left, top: rect.top, width: rect.width };
    });
  const [reactGeometry, vueGeometry] = await Promise.all(
    pages.map((page) => captureGeometry(page)),
  );
  expect(vueGeometry).toEqual(reactGeometry);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Popover React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'popover',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('popover').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'popover', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('popover-reference');
      const vueTarget = pair.vue.page.getByTestId('popover-vue');
      await expect(reactTarget).toHaveScreenshot(`popover-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`popover-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Popover React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'popover',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      expect(page.locator('.semi-popover-rtl')).toHaveCount(4),
    ),
  );
  for (const target of assertScenarioComparable('popover').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'popover', target.id));
  }
  const reactTarget = pair.react.page.getByTestId('popover-reference');
  const vueTarget = pair.vue.page.getByTestId('popover-vue');
  await expect(reactTarget).toHaveScreenshot('popover-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('popover-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('ScrollList 固定源码场景保留 normal/wheel、循环、禁用、变换与选择契约', async ({
  context,
}) => {
  const pair = await openParityPages(context, {
    scenarioId: 'scroll-list',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('scroll-list').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'scroll-list', target.id));
  }

  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.getByRole('listbox')).toHaveCount(5);
    await expect(
      page.getByRole('listbox', { name: 'Normal period' }).getByRole('option'),
    ).toHaveCount(3);
    await expect(page.getByRole('listbox', { name: 'Wheel hour' }).getByRole('option')).toHaveCount(
      32,
    );
    await expect(
      page.getByRole('listbox', { name: 'Wheel minute' }).getByText('20 min'),
    ).toHaveCount(1);
    await expect(
      page.getByRole('listbox', { name: 'Wheel minute' }).getByText('15'),
    ).toHaveAttribute('aria-disabled', 'true');
  }

  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      page.getByRole('listbox', { name: 'Normal hour' }).getByText('5').click(),
    ),
  );
  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      expect(page.getByRole('listbox', { name: 'Normal hour' }).getByText('5 h')).toHaveClass(
        /semi-scrolllist-item-sel/,
      ),
    ),
  );

  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      page.getByRole('listbox', { name: 'Wheel minute' }).getByText('25').click(),
    ),
  );
  await Promise.all([pair.react.page.waitForTimeout(60), pair.vue.page.waitForTimeout(60)]);
  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      expect(page.getByRole('listbox', { name: 'Wheel minute' }).getByText('25 min')).toHaveCount(
        1,
      ),
    ),
  );
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`ScrollList React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'scroll-list',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('scroll-list').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'scroll-list', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('scroll-list-reference');
      const vueTarget = pair.vue.page.getByTestId('scroll-list-vue');
      await expect(reactTarget).toHaveScreenshot(
        `scroll-list-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`scroll-list-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('ScrollList React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'scroll-list',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('scroll-list').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'scroll-list', target.id));
  }
  const reactTarget = pair.react.page.getByTestId('scroll-list-reference');
  const vueTarget = pair.vue.page.getByTestId('scroll-list-vue');
  await expect(reactTarget).toHaveScreenshot('scroll-list-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('scroll-list-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('SideSheet 参考场景来自本地 v2.102.0 并保留 Portal 与 dialog 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'side-sheet',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.sideSheetPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'side-sheet')).toBe(true);

  const stage = page.getByTestId('side-sheet-reference');
  await expect(stage.locator(':scope > .semi-portal')).toHaveCount(1);
  await expect(stage.getByRole('dialog')).toHaveClass(/semi-sidesheet-inner/);
  await expect(stage.getByRole('heading', { level: 1 })).toContainText('资源详情');
  await expect(stage.locator('.semi-sidesheet-mask')).toHaveAttribute('aria-hidden', 'true');
  await expect(stage.locator('.semi-sidesheet-footer')).toContainText('保存变更');
  expect(runtimeErrors).toEqual([]);
});

test('SideSheet 关闭、重开、computed style 与几何契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'side-sheet',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('side-sheet').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'side-sheet', target.id));
  }

  const pages = [pair.react.page, pair.vue.page];
  await Promise.all(
    pages.map((page) => expect(page.locator('.semi-sidesheet-close')).toHaveCount(1)),
  );
  await Promise.all(pages.map((page) => page.locator('.semi-sidesheet-close').click()));
  await Promise.all(
    pages.map((page) =>
      expect(page.locator('[data-parity-target="side-sheet-basic"]')).toHaveCount(0),
    ),
  );
  await Promise.all(pages.map((page) => page.locator('[data-action="open-side-sheet"]').click()));
  await Promise.all(
    pages.map((page) =>
      expect(page.locator('[data-parity-target="side-sheet-basic"]')).toBeVisible(),
    ),
  );
  await Promise.all(
    pages.map((page) =>
      page.locator('.semi-sidesheet-mask').click({ position: { x: 20, y: 160 } }),
    ),
  );
  await Promise.all(
    pages.map((page) =>
      expect(page.locator('[data-parity-target="side-sheet-basic"]')).toHaveCount(0),
    ),
  );
  for (const page of pages) {
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`SideSheet React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'side-sheet',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('side-sheet').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'side-sheet', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('side-sheet-reference');
      const vueTarget = pair.vue.page.getByTestId('side-sheet-vue');
      await expect(reactTarget).toHaveScreenshot(
        `side-sheet-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`side-sheet-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('SideSheet React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'side-sheet',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('side-sheet').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'side-sheet', target.id));
  }
  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      expect(page.locator('.semi-sidesheet-rtl')).toHaveCount(1),
    ),
  );
  const reactTarget = pair.react.page.getByTestId('side-sheet-reference');
  const vueTarget = pair.vue.page.getByTestId('side-sheet-vue');
  await expect(reactTarget).toHaveScreenshot('side-sheet-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('side-sheet-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Table 参考场景来自本地 v2.102.0 并保留表格、选择与滚动契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'table',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.tablePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'table')).toBe(true);
  const table = page.locator('[data-parity-target="table-basic"]');
  await expect(table.locator('thead th')).toHaveCount(4);
  await expect(table.locator('tbody tr')).toHaveCount(3);
  await expect(table.locator('.semi-table-row-selected')).toContainText('API Gateway');
  await expect(table.locator('input[type="checkbox"]')).toHaveCount(4);
  expect(runtimeErrors).toEqual([]);
});

test('Table React/Vue computed style、几何与公开 DOM 一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'table',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('table').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'table', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const table = page.locator('[data-parity-target="table-basic"]');
    await expect(table.locator('thead th')).toHaveCount(4);
    await expect(table.locator('tbody tr')).toHaveCount(3);
    await expect(table.locator('.semi-table-row-selected')).toHaveCount(1);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Table React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'table',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('table').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'table', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('table-reference');
      const vueTarget = pair.vue.page.getByTestId('table-vue');
      await expect(reactTarget).toHaveScreenshot(`table-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`table-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Table React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'table',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('table').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'table', target.id));
  }
  const reactTarget = pair.react.page.getByTestId('table-reference');
  const vueTarget = pair.vue.page.getByTestId('table-vue');
  await expect(reactTarget).toHaveScreenshot('table-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('table-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Tag 参考场景来自本地 v2.102.0 并保留关闭、Group 与 Split 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'tag',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.tagPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'tag')).toBe(true);
  await expect(page.locator('[data-parity-target="tag-basic"] .semi-tag')).toHaveCount(3);
  await expect(page.locator('[data-parity-target="tag-group"] .semi-tag')).toHaveCount(3);
  await expect(page.locator('[data-parity-target="tag-group"] .semi-tag').last()).toHaveText('+2');
  await expect(page.locator('[data-parity-target="tag-split"] .semi-tag-first')).toHaveCount(1);
  await expect(page.locator('[data-parity-target="tag-split"] .semi-tag-last')).toHaveCount(1);
  expect(runtimeErrors).toEqual([]);
});

test('Tag React/Vue computed style、几何、关闭与公开 DOM 一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tag',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('tag').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'tag', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const closable = page.locator('[data-parity-target="tag-basic"] .semi-tag').nth(1);
    await closable.locator('.semi-tag-close').click();
    await expect(closable).toHaveClass(/semi-tag-invisible/);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Tag React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'tag',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('tag').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'tag', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('tag-reference');
      const vueTarget = pair.vue.page.getByTestId('tag-vue');
      await expect(reactTarget).toHaveScreenshot(`tag-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`tag-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Tag React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tag',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('tag').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'tag', target.id));
  }
  const reactTarget = pair.react.page.getByTestId('tag-reference');
  const vueTarget = pair.vue.page.getByTestId('tag-vue');
  await expect(reactTarget).toHaveScreenshot('tag-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('tag-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
