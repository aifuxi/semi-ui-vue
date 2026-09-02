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

test('IconButton 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'icon-button',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.iconButtonPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'icon-button')).toBe(true);
  await expect(page.getByTestId('icon-button-reference').getByRole('button')).toHaveCount(7);
  expect(runtimeErrors).toEqual([]);
});

test('IconButton React/Vue 行为、样式、几何、ARIA 与图标优先级一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'icon-button',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('icon-button').targets).toHaveLength(7);
  for (const target of assertScenarioComparable('icon-button').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'icon-button', target.id);
    });
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const iconOnly = parityPage.locator('[data-parity-target="icon-button-default"]');
    await expect(iconOnly).toHaveClass(/semi-button-with-icon-only/);
    await expect(iconOnly).toHaveAttribute('aria-label', '收藏');
    await expect(parityPage.locator('[data-parity-target="icon-button-disabled"]')).toBeDisabled();
    await expect(parityPage.locator('[data-parity-target="icon-button-loading"]')).toHaveClass(
      /semi-button-loading/,
    );
    await expect(
      parityPage.locator('[data-parity-target="icon-button-loading"] [data-icon="spin"]'),
    ).toBeVisible();
    await expect(
      parityPage.locator(
        '[data-parity-target="icon-button-ai-loading"] .semi-button-content-loading-icon',
      ),
    ).toBeVisible();
  }

  const reactDefault = pair.react.page.locator('[data-parity-target="icon-button-default"]');
  const vueDefault = pair.vue.page.locator('[data-parity-target="icon-button-default"]');
  await Promise.all([reactDefault.click(), vueDefault.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近操作：收藏'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近操作：收藏'),
  ]);

  const reactDisabled = pair.react.page.locator('[data-parity-target="icon-button-disabled"]');
  const vueDisabled = pair.vue.page.locator('[data-parity-target="icon-button-disabled"]');
  await Promise.all([reactDisabled.click({ force: true }), vueDisabled.click({ force: true })]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近操作：收藏'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近操作：收藏'),
  ]);

  await Promise.all([reactDefault.focus(), vueDefault.focus()]);
  await Promise.all([
    pair.react.page.keyboard.press('Enter'),
    pair.vue.page.keyboard.press('Enter'),
  ]);
  const [reactFocus, vueFocus] = await Promise.all([
    captureComputedStyle(reactDefault, ['outlineStyle', 'outlineWidth']),
    captureComputedStyle(vueDefault, ['outlineStyle', 'outlineWidth']),
  ]);
  expect(vueFocus).toEqual(reactFocus);
  expect(reactFocus).toEqual({ outlineStyle: 'solid', outlineWidth: '2px' });
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`IconButton React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'icon-button',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        viewport,
      );
      const reactTarget = pair.react.page.getByTestId('icon-button-reference');
      const vueTarget = pair.vue.page.getByTestId('icon-button-vue');
      await expect(reactTarget).toHaveScreenshot(
        `icon-button-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`icon-button-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('IconButton React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'icon-button',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('icon-button-reference');
  const vueTarget = pair.vue.page.getByTestId('icon-button-vue');
  await expect(reactTarget).toHaveScreenshot('icon-button-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('icon-button-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
