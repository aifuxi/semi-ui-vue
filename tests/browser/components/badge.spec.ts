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
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'badge')).toBe(true);
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
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
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
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
