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
