import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
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
