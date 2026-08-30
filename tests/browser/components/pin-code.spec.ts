import { expect, test } from '@playwright/test';
import { assertScenarioComparable, PARITY_VIEWPORTS } from '../../../packages/test-infra/src';
import { expectComparableTarget, openParityPages } from '../parity-harness';

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
