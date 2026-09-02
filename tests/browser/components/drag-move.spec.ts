import { expect, test, type Page } from '@playwright/test';
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

test('DragMove 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'drag-move',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.dragMovePublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'drag-move')).toBe(true);
  await expect(page.getByTestId('drag-move-reference').locator('[data-parity-target]')).toHaveCount(
    5,
  );
  await expect(page.locator('[data-parity-target="drag-move-basic"]')).toHaveCSS(
    'position',
    'absolute',
  );
  await expect(page.locator('[data-parity-target="drag-move-relative"]')).toHaveCSS(
    'position',
    'relative',
  );
  expect(runtimeErrors).toEqual([]);
});

async function dragBy(page: Page, selector: string, deltaX: number, deltaY: number): Promise<void> {
  const target = page.locator(selector);
  const box = await target.boundingBox();
  if (!box) throw new Error(`DragMove 目标不可测量：${selector}`);
  const clientX = box.x + box.width / 2;
  const clientY = box.y + box.height / 2;
  await target.dispatchEvent('mousedown', {
    button: 0,
    buttons: 1,
    clientX,
    clientY,
  });
  await page.mouse.move(clientX + deltaX, clientY + deltaY);
  await page.mouse.up();
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
}

test('DragMove 鼠标、约束、handler、relative、input guard 与 customMove 一致', async ({
  context,
}) => {
  const pair = await openParityPages(context, {
    scenarioId: 'drag-move',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('drag-move').targets).toHaveLength(5);
  for (const target of assertScenarioComparable('drag-move').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'drag-move', target.id));
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const basic = parityPage.locator('[data-parity-target="drag-move-basic"]');
    const basicBefore = await basic.boundingBox();
    await dragBy(parityPage, '[data-parity-target="drag-move-basic"]', 34, 26);
    const basicAfter = await basic.boundingBox();
    expect((basicAfter?.x ?? 0) - (basicBefore?.x ?? 0)).toBeCloseTo(34, 0);
    expect((basicAfter?.y ?? 0) - (basicBefore?.y ?? 0)).toBeCloseTo(26, 0);

    const handlerRoot = parityPage.locator('[data-parity-target="drag-move-handler"]');
    const handlerBefore = await handlerRoot.boundingBox();
    await dragBy(parityPage, '[data-parity-target="drag-move-handler"] > span', 28, 20);
    expect(await handlerRoot.boundingBox()).toEqual(handlerBefore);
    await dragBy(parityPage, '.drag-move-scenario__handle', 28, 20);
    const handlerAfter = await handlerRoot.boundingBox();
    expect((handlerAfter?.x ?? 0) - (handlerBefore?.x ?? 0)).toBeCloseTo(28, 0);
    expect((handlerAfter?.y ?? 0) - (handlerBefore?.y ?? 0)).toBeCloseTo(20, 0);

    const relative = parityPage.locator('[data-parity-target="drag-move-relative"]');
    const relativeBefore = await relative.boundingBox();
    await dragBy(parityPage, '[data-parity-target="drag-move-relative"]', 24, 18);
    const relativeAfter = await relative.boundingBox();
    expect((relativeAfter?.x ?? 0) - (relativeBefore?.x ?? 0)).toBeCloseTo(24, 0);
    expect((relativeAfter?.y ?? 0) - (relativeBefore?.y ?? 0)).toBeCloseTo(18, 0);

    const blocked = parityPage.locator('[data-parity-target="drag-move-input-blocked"]');
    const blockedBefore = await blocked.boundingBox();
    await dragBy(parityPage, 'input[aria-label="Blocked drag input"]', 36, 22);
    expect(await blocked.boundingBox()).toEqual(blockedBefore);

    const allowed = parityPage.locator('[data-parity-target="drag-move-input-allowed"]');
    const allowedBefore = await allowed.boundingBox();
    await dragBy(parityPage, 'input[aria-label="Allowed drag input"]', 30, 16);
    const allowedAfter = await allowed.boundingBox();
    expect((allowedAfter?.x ?? 0) - (allowedBefore?.x ?? 0)).toBeCloseTo(30, 0);
    expect((allowedAfter?.y ?? 0) - (allowedBefore?.y ?? 0)).toBeCloseTo(16, 0);
    await expect(allowed).toHaveAttribute('data-custom-position', /\d+,\d+/);
  }

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`DragMove React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'drag-move',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        PARITY_VIEWPORTS[viewportName],
      );
      const reactTarget = pair.react.page.getByTestId('drag-move-reference');
      const vueTarget = pair.vue.page.getByTestId('drag-move-vue');
      await expect(reactTarget).toHaveScreenshot(
        `drag-move-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`drag-move-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('DragMove React/Vue RTL 保持物理 left/top 与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'drag-move',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="drag-move-basic"]')).toHaveCSS(
      'left',
      '44px',
    );
    await expect(parityPage.locator('[data-parity-target="drag-move-basic"]')).toHaveCSS(
      'position',
      'absolute',
    );
  }
  const reactTarget = pair.react.page.getByTestId('drag-move-reference');
  const vueTarget = pair.vue.page.getByTestId('drag-move-vue');
  await expect(reactTarget).toHaveScreenshot('drag-move-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('drag-move-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
