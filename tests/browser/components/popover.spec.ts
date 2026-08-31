import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
  VISUAL_THRESHOLDS,
} from '../../../packages/test-infra/src';
import {
  captureComparableGeometry,
  expectComparableTarget,
  expectComparableGeometry,
  expectScreenshotPixelsToMatch,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
  waitForStableRendering,
} from '../parity-harness';

test('Popover 参考场景来自本地 v2.102.0 并保留 Portal、卡片、箭头与角色', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'popover',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.popoverPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'popover')).toBe(true);
  await expect(page.getByTestId('popover-reference').locator(':scope > .semi-portal')).toHaveCount(
    2,
  );
  await expect(page.locator('.popover-target-bottom')).toHaveAttribute('role', 'dialog');
  await expect(page.locator('.popover-target-bottom')).toHaveAttribute('x-placement', 'bottom');
  await expect(page.locator('.popover-target-right .semi-popover-icon-arrow')).toHaveCount(1);
  await expect(page.locator('.popover-target-right .semi-popover-icon-arrow path')).toHaveCount(2);
  expect(runtimeErrors).toEqual([]);
});

test('Popover React/Vue 定位、click/Escape、焦点与 Element/Document scroll 重定位一致', async ({
  context,
}) => {
  const pair = await openParityPages(context, {
    scenarioId: 'popover',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('popover').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'popover', target.id));
  }

  const pages = [pair.react.page, pair.vue.page];
  await Promise.all(
    pages.map((page) => page.locator('[data-parity-target="popover-trigger-click"]').click()),
  );
  await Promise.all(
    pages.flatMap((page) => [
      expect(page.locator('.popover-target-click')).toBeVisible(),
      expect(page.locator('.popover-target-click')).toHaveAttribute('role', 'dialog'),
      expect(page.locator('[data-parity-target="popover-trigger-click"]')).toHaveAttribute(
        'aria-haspopup',
        'dialog',
      ),
    ]),
  );
  await Promise.all(
    pages.map((page) =>
      page.locator('[data-parity-target="popover-trigger-click"]').press('ArrowDown'),
    ),
  );
  await Promise.all(
    pages.map((page) => expect(page.locator('.popover-scenario__inside-action')).toBeFocused()),
  );
  await Promise.all(
    pages.map((page) => page.locator('.popover-scenario__inside-action').press('Escape')),
  );
  await Promise.all(
    pages.flatMap((page) => [
      expect(page.locator('.popover-target-click')).toHaveCount(0),
      expect(page.locator('[data-parity-target="popover-trigger-click"]')).toBeFocused(),
    ]),
  );

  await Promise.all(
    pages.map((page) => page.locator('[data-parity-target="popover-trigger-hover"]').hover()),
  );
  await Promise.all(
    pages.flatMap((page) => [
      expect(page.locator('.popover-target-hover')).toBeVisible(),
      expect(page.locator('.popover-target-hover')).toHaveAttribute('role', 'tooltip'),
    ]),
  );
  const captureBottomGeometry = (page: (typeof pair.react)['page']) =>
    captureComparableGeometry(page.locator('.popover-target-bottom'));
  const initialGeometry = await Promise.all(pages.map((page) => captureBottomGeometry(page)));
  await Promise.all(
    pages.map((page) =>
      page.getByTestId('popover-scroll-host').evaluate((element) => {
        element.scrollLeft = 12;
        element.dispatchEvent(new Event('scroll'));
      }),
    ),
  );
  await Promise.all(
    pages.map((page) =>
      page.evaluate(() => document.dispatchEvent(new Event('scroll', { bubbles: true }))),
    ),
  );
  await Promise.all(
    pages.map((page, index) =>
      expect
        .poll(async () => {
          const geometry = await captureBottomGeometry(page);
          return Math.abs(geometry.x - initialGeometry[index]!.x);
        })
        .toBeGreaterThan(VISUAL_THRESHOLDS.boundingRectToleranceCssPx),
    ),
  );
  await Promise.all(pages.map((page) => waitForStableRendering(page)));
  const [reactGeometry, vueGeometry] = await Promise.all([
    captureBottomGeometry(pair.react.page),
    captureBottomGeometry(pair.vue.page),
  ]);
  expectComparableGeometry(vueGeometry, reactGeometry, 'popover/bottom-scroll-reposition');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Popover React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'popover',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('popover').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'popover', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('popover-reference');
      const vueTarget = pair.vue.page.getByTestId('popover-vue');
      await expect(reactTarget).toHaveScreenshot(`popover-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`popover-vue-${viewportName}-${theme}.png`);
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

test('Popover React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'popover',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      expect(page.locator('.semi-popover-rtl')).toHaveCount(4),
    ),
  );
  for (const target of assertScenarioComparable('popover').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'popover', target.id));
  }
  const reactTarget = pair.react.page.getByTestId('popover-reference');
  const vueTarget = pair.vue.page.getByTestId('popover-vue');
  await expect(reactTarget).toHaveScreenshot('popover-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('popover-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
