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

test('Divider 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'divider',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.dividerPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'divider')).toBe(true);
  await expect(page.getByTestId('divider-reference').locator('.semi-divider')).toHaveCount(8);
  await expect(page.getByRole('separator', { name: '章节分隔' })).toHaveClass(
    /semi-divider-horizontal/,
  );
  await expect(page.getByRole('separator', { name: '操作分隔' })).toHaveAttribute(
    'aria-orientation',
    'vertical',
  );
  await expect(page.locator('[data-parity-target="divider-content-left"]')).toHaveClass(
    /semi-divider-with-text-left/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Divider 水平、垂直、虚线、内容与 RTL 契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'divider',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('divider').targets) {
    await expectComparableTarget(pair, 'divider', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-scenario="divider"]')).toHaveClass(/semi-rtl/);
    await expect(parityPage.locator('[data-parity-target="divider-horizontal-dashed"]')).toHaveCSS(
      'border-bottom-style',
      'dashed',
    );
    await expect(parityPage.locator('[data-parity-target="divider-vertical-dashed"]')).toHaveCSS(
      'border-left-style',
      'dashed',
    );
    await expect(parityPage.getByRole('separator', { name: '章节分隔' })).toBeVisible();
    await expect(parityPage.getByRole('separator', { name: '操作分隔' })).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  }

  const readPseudoLineWidths = (selector: string) => {
    const read = (page: typeof pair.react.page) =>
      page.locator(selector).evaluate((element) => ({
        afterWidth: getComputedStyle(element, '::after').width,
        beforeWidth: getComputedStyle(element, '::before').width,
      }));
    return Promise.all([read(pair.react.page), read(pair.vue.page)]);
  };
  const [reactLeft, vueLeft] = await readPseudoLineWidths(
    '[data-parity-target="divider-content-left"]',
  );
  const [reactRight, vueRight] = await readPseudoLineWidths(
    '[data-parity-target="divider-content-right"]',
  );
  expect(vueLeft).toEqual(reactLeft);
  expect(vueRight).toEqual(reactRight);
  expect(reactLeft.beforeWidth).toBe('40px');
  expect(reactRight.afterWidth).toBe('40px');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Divider React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'divider',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('divider-reference');
      const vueTarget = pair.vue.page.getByTestId('divider-vue');
      await expect(reactTarget).toHaveScreenshot(`divider-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`divider-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Divider React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'divider',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('divider-reference');
  const vueTarget = pair.vue.page.getByTestId('divider-vue');
  await expect(reactTarget).toHaveScreenshot('divider-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('divider-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot(),
    vueTarget.screenshot(),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
