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
