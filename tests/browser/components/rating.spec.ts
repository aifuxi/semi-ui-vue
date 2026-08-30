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

test('Rating 参考场景来自本地 v2.102.0 并保留整星、半星、空值项、ARIA 与尺寸 DOM', async ({
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
      scenarioId: 'rating',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.ratingPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'rating')).toBe(true);
  const scenario = page.getByTestId('rating-reference');
  await expect(scenario.locator('.semi-rating')).toHaveCount(6);
  await expect(scenario.locator('.semi-rating-star')).toHaveCount(36);
  await expect(scenario.locator('[role="radio"]')).toHaveCount(41);
  await expect(
    scenario.locator('[data-parity-target="rating-half"] .semi-rating-star-half'),
  ).toHaveCount(1);
  await expect(scenario.locator('[data-parity-target="rating-disabled"]')).toHaveClass(
    /semi-rating-disabled/,
  );
  await expect(
    scenario.locator('[data-parity-target="rating-small"] .semi-rating-star-small'),
  ).toHaveCount(5);
  await expect(scenario.locator('[data-parity-target="rating-custom"]')).toHaveAttribute(
    'aria-label',
    /S/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Rating React/Vue 样式、几何、清空、Tooltip、键盘与焦点一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'rating',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('rating').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('rating').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'rating', target.id);
    });
  }

  const reactDefault = pair.react.page.locator('[data-parity-target="rating-default"]');
  const vueDefault = pair.vue.page.locator('[data-parity-target="rating-default"]');
  await Promise.all([
    reactDefault.locator('.semi-rating-star-second').nth(3).click(),
    vueDefault.locator('.semi-rating-star-second').nth(3).click(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：change:4'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：change:4'),
  ]);
  await Promise.all([
    reactDefault.locator('.semi-rating-star-second').nth(3).click(),
    vueDefault.locator('.semi-rating-star-second').nth(3).click(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：change:0'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：change:0'),
  ]);

  const reactTooltip = pair.react.page.locator('[data-parity-target="rating-tooltip"]');
  const vueTooltip = pair.vue.page.locator('[data-parity-target="rating-tooltip"]');
  await Promise.all([
    reactTooltip.locator('.semi-rating-star-second').nth(1).hover(),
    vueTooltip.locator('.semi-rating-star-second').nth(1).hover(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：hover:2'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：hover:2'),
    expect(pair.react.page.locator('.semi-tooltip-wrapper-show')).toContainText('bad'),
    expect(pair.vue.page.locator('.semi-tooltip-wrapper-show')).toContainText('bad'),
  ]);

  await Promise.all([
    reactDefault.locator('.semi-rating-star-second').nth(1).focus(),
    vueDefault.locator('.semi-rating-star-second').nth(1).focus(),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('ArrowRight'),
    pair.vue.page.keyboard.press('ArrowRight'),
  ]);
  await Promise.all([
    expect(reactDefault.locator('.semi-rating-star-second').nth(0)).toBeFocused(),
    expect(vueDefault.locator('.semi-rating-star-second').nth(0)).toBeFocused(),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Rating React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'rating',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('rating-reference');
      const vueTarget = pair.vue.page.getByTestId('rating-vue');
      await expect(reactTarget).toHaveScreenshot(`rating-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`rating-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Rating React/Vue RTL 样式、几何与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'rating',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('rating').targets) {
    await expectComparableTarget(pair, 'rating', target.id);
  }
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="rating-default"]')).toHaveCSS(
      'direction',
      'rtl',
    );
  }
  const reactTarget = pair.react.page.getByTestId('rating-reference');
  const vueTarget = pair.vue.page.getByTestId('rating-vue');
  await expect(reactTarget).toHaveScreenshot('rating-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('rating-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});
