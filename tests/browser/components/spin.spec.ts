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

test('Spin 参考场景来自本地 v2.102.0 并保留三尺寸、包装与 hidden', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'spin',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.spinPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'spin')).toBe(true);
  const scenario = page.getByTestId('spin-reference');
  await expect(scenario.locator('.semi-spin-small')).toHaveCount(1);
  await expect(scenario.locator('.semi-spin-middle')).toHaveCount(4);
  await expect(scenario.locator('.semi-spin-large')).toHaveCount(1);
  await expect(scenario.locator('.semi-spin-animate')).toHaveCount(1);
  await expect(scenario.locator('.semi-spin-block')).toHaveCount(2);
  await expect(scenario.locator('.semi-spin-hidden')).toHaveCount(1);
  await expect(scenario.getByText('Content ready')).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test('Spin React/Vue DOM、样式、几何、动画与 spinning 默认值一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'spin',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('spin').targets).toHaveLength(7);
  for (const target of assertScenarioComparable('spin').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'spin', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const scenario = page.locator('.spin-scenario');
    await expect(scenario.locator('[data-parity-target="spin-small"] svg')).toHaveCSS(
      'animation-duration',
      '0.6s',
    );
    await expect(scenario.locator('[data-parity-target="spin-small"] svg')).toHaveCSS(
      'animation-name',
      'semi-animation-rotate',
    );
    await expect(scenario.locator('[data-parity-target="spin-small"] svg')).toHaveCSS(
      'width',
      '14px',
    );
    await expect(scenario.locator('[data-parity-target="spin-middle"] svg')).toHaveCSS(
      'width',
      '20px',
    );
    await expect(scenario.locator('[data-parity-target="spin-large"] svg')).toHaveCSS(
      'width',
      '32px',
    );
    await expect(
      scenario.locator('[data-parity-target="spin-custom"] .semi-spin-animate'),
    ).toHaveCSS('animation-duration', '1.6s');
    await expect(scenario.locator('[data-parity-target="spin-block"]')).toHaveClass(
      /semi-spin-block/,
    );
    await expect(scenario.locator('[data-parity-target="spin-hidden"]')).toHaveClass(
      /semi-spin-hidden/,
    );
    await expect(
      scenario.locator('[data-parity-target="spin-hidden"] .semi-spin-wrapper'),
    ).toHaveCount(0);
    await expect(scenario.getByText('Content ready')).toBeVisible();
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Spin React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'spin',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('spin').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'spin', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('spin-reference');
      const vueTarget = pair.vue.page.getByTestId('spin-vue');
      await expect(reactTarget).toHaveScreenshot(`spin-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`spin-vue-${viewportName}-${theme}.png`);
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

test('Spin React/Vue RTL 方向、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'spin',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('spin').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'spin', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('[data-parity-target="spin-small"]')).toHaveCSS('direction', 'rtl');
  }
  const reactTarget = pair.react.page.getByTestId('spin-reference');
  const vueTarget = pair.vue.page.getByTestId('spin-vue');
  await expect(reactTarget).toHaveScreenshot('spin-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('spin-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
