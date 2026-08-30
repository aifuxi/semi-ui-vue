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
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
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
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
