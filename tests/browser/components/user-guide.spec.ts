import { expect, test, type Page } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../../packages/test-infra/src';
import {
  captureComparableGeometry,
  captureComputedStyle,
  expectComparableGeometry,
  expectComparableTarget,
  expectScreenshotPixelsToMatch,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
  waitForStableRendering,
  waitForTargetStable,
} from '../parity-harness';

async function expectUserGuideReady(page: Page): Promise<void> {
  await expect(page.locator('.semi-userGuide-popover')).toBeVisible();
  await expect(page.locator('.semi-userGuide-spotlight')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('发现协作入口');
  await page.locator('.semi-userGuide-popup-content-cover img').evaluate(async (image) => {
    const element = image as HTMLImageElement;
    if (!element.complete) await element.decode();
  });
  await page.waitForTimeout(240);
}

async function readSpotlightMetrics(page: Page) {
  return page.locator('.semi-userGuide-spotlight').evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const cutout = element.querySelector('.semi-userGuide-spotlight-rect');
    return {
      box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      style: {
        left: style.left,
        pointerEvents: style.pointerEvents,
        position: style.position,
        top: style.top,
        zIndex: style.zIndex,
      },
      cutout: cutout
        ? ['x', 'y', 'width', 'height', 'rx'].map((name) => cutout.getAttribute(name))
        : null,
    };
  });
}

async function readPopoverMetrics(page: Page) {
  return page.locator('.semi-userGuide-popover').evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      style: {
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        boxSizing: style.boxSizing,
        maxWidth: style.maxWidth,
        padding: style.padding,
        width: style.width,
      },
    };
  });
}

async function expectOverlayMetricsEqual(reactPage: Page, vuePage: Page): Promise<void> {
  expect(await readSpotlightMetrics(vuePage)).toEqual(await readSpotlightMetrics(reactPage));
  expect(await readPopoverMetrics(vuePage)).toEqual(await readPopoverMetrics(reactPage));
}

async function expectMobileTargetComparable(
  pair: Awaited<ReturnType<typeof openParityPages>>,
  target: ReturnType<typeof assertScenarioComparable>['targets'][number],
): Promise<void> {
  const reactTarget = pair.react.page.locator(target.selector);
  const vueTarget = pair.vue.page.locator(target.selector);
  await Promise.all([expect(reactTarget).toBeVisible(), expect(vueTarget).toBeVisible()]);
  await Promise.all([waitForTargetStable(reactTarget), waitForTargetStable(vueTarget)]);
  await Promise.all([
    waitForStableRendering(pair.react.page),
    waitForStableRendering(pair.vue.page),
  ]);

  const [reactStyle, vueStyle, reactGeometry, vueGeometry, reactBox] = await Promise.all([
    captureComputedStyle(reactTarget, target.computedStyleProperties),
    captureComputedStyle(vueTarget, target.computedStyleProperties),
    captureComparableGeometry(reactTarget),
    captureComparableGeometry(vueTarget),
    reactTarget.boundingBox(),
  ]);
  expect(vueStyle).toEqual(reactStyle);
  expectComparableGeometry(vueGeometry, reactGeometry, `user-guide/${target.id}`);
  if (!reactBox) throw new Error(`${target.id} 缺少可见边界`);

  const viewport = pair.react.page.viewportSize();
  if (!viewport) throw new Error('UserGuide 移动端场景缺少 viewport');
  const x = Math.max(0, Math.floor(reactBox.x));
  const y = Math.max(0, Math.floor(reactBox.y));
  const right = Math.min(viewport.width, Math.ceil(reactBox.x + reactBox.width));
  const bottom = Math.min(viewport.height, Math.ceil(reactBox.y + reactBox.height));
  const clip = { x, y, width: right - x, height: bottom - y };
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page.screenshot({ animations: 'disabled', clip }),
    pair.vue.page.screenshot({ animations: 'disabled', clip }),
  ]);
  await expectScreenshotPixelsToMatch(
    pair.react.page,
    vueScreenshot,
    reactScreenshot,
    `user-guide/${target.id}/mobile-visible-viewport`,
  );
}

test('UserGuide 参考场景来自本地 v2.102.0 并保留 spotlight 与 Portal', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'user-guide',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expectUserGuideReady(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.userGuidePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'user-guide')).toBe(true);
  const stage = page.getByTestId('user-guide-reference');
  await expect(page.locator('body > .semi-portal')).toHaveCount(1);
  await expect(stage.locator('.semi-userGuide-spotlight-transparent-rect')).toHaveCount(4);
  await expect(page.locator('.semi-popover-icon-arrow')).toHaveCount(1);
  expect(runtimeErrors).toEqual([]);
});

test('UserGuide React/Vue 步骤、主题、箭头、完成与 modal 行为一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'user-guide',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([expectUserGuideReady(pair.react.page), expectUserGuideReady(pair.vue.page)]);
  for (const target of assertScenarioComparable('user-guide').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'user-guide', target.id));
  }
  await expectOverlayMetricsEqual(pair.react.page, pair.vue.page);

  for (const page of [pair.react.page, pair.vue.page]) {
    await page.getByRole('button', { name: '下一步' }).click();
    await expect(page.getByRole('status')).toHaveText('步骤 2');
    await expect(page.getByRole('dialog')).toContainText('查看任务进度');
    await expect(page.locator('.semi-userGuide-popup-content')).toHaveClass(/-primary/);

    await page.getByRole('button', { name: '上一步' }).click();
    await expect(page.getByRole('status')).toHaveText('步骤 1');
    await page.getByRole('button', { name: '下一步' }).click();
    await page.getByRole('button', { name: '下一步' }).click();
    await expect(page.getByRole('dialog')).toContainText('完成设置');
    await expect(page.locator('.semi-popover-icon-arrow')).toHaveCount(0);
    await page.getByRole('button', { name: '完成' }).click();
    await expect(page.getByRole('status')).toHaveText('已完成');
    await expect(page.locator('.semi-userGuide-spotlight')).toHaveCount(0);

    await page.locator('[data-action="open-user-guide-modal"]').click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.semi-userGuide-modal-indicator-item')).toHaveCount(3);
    await expect(modal).toContainText('发现协作入口');
    await modal.getByRole('button', { name: '下一步' }).click();
    await expect(modal).toContainText('查看任务进度');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`UserGuide React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        { scenarioId: 'user-guide', theme, direction: 'ltr', locale: 'zh-CN' },
        PARITY_VIEWPORTS[viewportName],
      );
      await Promise.all([
        expectUserGuideReady(pair.react.page),
        expectUserGuideReady(pair.vue.page),
      ]);
      for (const target of assertScenarioComparable('user-guide').targets) {
        await test.step(target.id, () =>
          viewportName === 'mobile'
            ? expectMobileTargetComparable(pair, target)
            : expectComparableTarget(pair, 'user-guide', target.id),
        );
      }
      await expectOverlayMetricsEqual(pair.react.page, pair.vue.page);
      const reactTarget = pair.react.page.getByTestId('user-guide-reference');
      const vueTarget = pair.vue.page.getByTestId('user-guide-vue');
      await expect(reactTarget).toHaveScreenshot(
        `user-guide-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`user-guide-vue-${viewportName}-${theme}.png`);
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

test('UserGuide React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'user-guide',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([expectUserGuideReady(pair.react.page), expectUserGuideReady(pair.vue.page)]);
  for (const target of assertScenarioComparable('user-guide').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'user-guide', target.id));
  }
  await expectOverlayMetricsEqual(pair.react.page, pair.vue.page);
  const reactTarget = pair.react.page.getByTestId('user-guide-reference');
  const vueTarget = pair.vue.page.getByTestId('user-guide-vue');
  await expect(reactTarget).toHaveScreenshot('user-guide-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('user-guide-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
