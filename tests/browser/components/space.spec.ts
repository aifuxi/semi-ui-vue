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

test('Space 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'space',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.spacePublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'space')).toBe(true);
  await expect(page.getByTestId('space-reference').locator('.semi-space')).toHaveCount(10);
  await expect(page.locator('[data-parity-target="space-tight"]')).toHaveAttribute(
    'x-semi-prop',
    'children',
  );
  await expect(page.locator('[data-parity-target="space-array-wrap"]')).toHaveClass(
    /semi-space-wrap/,
  );
  await expect(page.locator('[data-parity-target="space-vertical"]')).toHaveClass(
    /semi-space-vertical/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Space 间距、方向、换行、对齐与 RTL 契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'space',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('space').targets).toHaveLength(10);
  for (const target of assertScenarioComparable('space').targets) {
    await expectComparableTarget(pair, 'space', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="space-tight"]')).toHaveCSS(
      'column-gap',
      '8px',
    );
    await expect(parityPage.locator('[data-parity-target="space-medium"]')).toHaveCSS(
      'row-gap',
      '16px',
    );
    await expect(parityPage.locator('[data-parity-target="space-loose"]')).toHaveCSS(
      'column-gap',
      '24px',
    );
    await expect(parityPage.locator('[data-parity-target="space-number"]')).toHaveCSS(
      'row-gap',
      '12px',
    );
    await expect(parityPage.locator('[data-parity-target="space-array-wrap"]')).toHaveCSS(
      'row-gap',
      '20px',
    );
    await expect(parityPage.locator('[data-parity-target="space-vertical"]')).toHaveCSS(
      'flex-direction',
      'column',
    );
    await expect(parityPage.locator('[data-parity-target="space-align-baseline"]')).toHaveCSS(
      'align-items',
      'baseline',
    );
    await expect(parityPage.locator('[data-parity-target="space-align-start"]')).toHaveCSS(
      'direction',
      'rtl',
    );
  }

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Space React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'space',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('space-reference');
      const vueTarget = pair.vue.page.getByTestId('space-vue');
      await expect(reactTarget).toHaveScreenshot(`space-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`space-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Space React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'space',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('space-reference');
  const vueTarget = pair.vue.page.getByTestId('space-vue');
  await expect(reactTarget).toHaveScreenshot('space-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('space-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot(),
    vueTarget.screenshot(),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
