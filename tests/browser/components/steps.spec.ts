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
  expectScreenshotPixelsToMatch,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

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
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
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
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
