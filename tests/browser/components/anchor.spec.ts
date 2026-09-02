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
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'anchor')).toBe(true);
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

for (const viewportName of ['desktop'] as const) {
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
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
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
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
