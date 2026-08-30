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

test('SideSheet 参考场景来自本地 v2.102.0 并保留 Portal 与 dialog 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'side-sheet',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.sideSheetPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'side-sheet')).toBe(true);

  const stage = page.getByTestId('side-sheet-reference');
  await expect(stage.locator(':scope > .semi-portal')).toHaveCount(1);
  await expect(stage.getByRole('dialog')).toHaveClass(/semi-sidesheet-inner/);
  await expect(stage.getByRole('heading', { level: 1 })).toContainText('资源详情');
  await expect(stage.locator('.semi-sidesheet-mask')).toHaveAttribute('aria-hidden', 'true');
  await expect(stage.locator('.semi-sidesheet-footer')).toContainText('保存变更');
  expect(runtimeErrors).toEqual([]);
});

test('SideSheet 关闭、重开、computed style 与几何契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'side-sheet',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('side-sheet').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'side-sheet', target.id));
  }

  const pages = [pair.react.page, pair.vue.page];
  await Promise.all(
    pages.map((page) => expect(page.locator('.semi-sidesheet-close')).toHaveCount(1)),
  );
  await Promise.all(pages.map((page) => page.locator('.semi-sidesheet-close').click()));
  await Promise.all(
    pages.map((page) =>
      expect(page.locator('[data-parity-target="side-sheet-basic"]')).toHaveCount(0),
    ),
  );
  await Promise.all(pages.map((page) => page.locator('[data-action="open-side-sheet"]').click()));
  await Promise.all(
    pages.map((page) =>
      expect(page.locator('[data-parity-target="side-sheet-basic"]')).toBeVisible(),
    ),
  );
  await Promise.all(
    pages.map((page) =>
      page.locator('.semi-sidesheet-mask').click({ position: { x: 20, y: 160 } }),
    ),
  );
  await Promise.all(
    pages.map((page) =>
      expect(page.locator('[data-parity-target="side-sheet-basic"]')).toHaveCount(0),
    ),
  );
  for (const page of pages) {
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`SideSheet React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'side-sheet',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('side-sheet').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'side-sheet', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('side-sheet-reference');
      const vueTarget = pair.vue.page.getByTestId('side-sheet-vue');
      await expect(reactTarget).toHaveScreenshot(
        `side-sheet-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`side-sheet-vue-${viewportName}-${theme}.png`);
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

test('SideSheet React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'side-sheet',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('side-sheet').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'side-sheet', target.id));
  }
  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      expect(page.locator('.semi-sidesheet-rtl')).toHaveCount(1),
    ),
  );
  const reactTarget = pair.react.page.getByTestId('side-sheet-reference');
  const vueTarget = pair.vue.page.getByTestId('side-sheet-vue');
  await expect(reactTarget).toHaveScreenshot('side-sheet-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('side-sheet-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
