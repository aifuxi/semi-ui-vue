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

test('Resizable 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'resizable',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.resizablePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'resizable')).toBe(true);
  const scenario = page.getByTestId('resizable-reference');
  await expect(scenario.locator('.semi-resizable-resizable')).toHaveCount(1);
  await expect(scenario.locator('.semi-resizable-resizableHandler')).toHaveCount(8);
  await expect(scenario.locator('.semi-resizable-group')).toHaveCount(2);
  await expect(scenario.locator('.semi-resizable-item')).toHaveCount(4);
  await expect(scenario.locator('.semi-resizable-handler')).toHaveCount(2);
  for (const handle of await scenario.locator('.semi-resizable-resizableHandler').all()) {
    await expect(handle).not.toHaveAttribute('role');
    await expect(handle).not.toHaveAttribute('tabindex');
  }
  expect(runtimeErrors).toEqual([]);
});

test('Resizable 单体与组合拖拽、约束、回调、样式和几何契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'resizable',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('resizable').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('resizable').targets) {
    await expectComparableTarget(pair, 'resizable', target.id);
  }

  async function dragSingle(page: typeof pair.react.page): Promise<number> {
    const root = page.locator('[data-parity-target="resizable-single"]');
    const handle = root.locator('.semi-resizable-resizableHandler-right');
    const box = await handle.boundingBox();
    if (!box) throw new Error('Resizable 右侧手柄不可测量');
    await handle.dispatchEvent('mousedown', {
      button: 0,
      clientX: box.x + box.width / 2,
      clientY: box.y + box.height / 2,
    });
    await expect(root.locator('.semi-resizable-background')).toBeVisible();
    await page.mouse.move(box.x + box.width / 2 + 48, box.y + box.height / 2);
    await expect(root).toContainText('Resizing');
    await page.mouse.up();
    await expect(root).toContainText('Drag edge to resize');
    return (await root.boundingBox())?.width ?? 0;
  }

  const [reactSingleWidth, vueSingleWidth] = await Promise.all([
    dragSingle(pair.react.page),
    dragSingle(pair.vue.page),
  ]);
  expect(Math.abs(vueSingleWidth - reactSingleWidth)).toBeLessThanOrEqual(0.5);

  async function dragGroup(page: typeof pair.react.page): Promise<readonly [number, number]> {
    const group = page.locator('[data-parity-target="resize-group-horizontal"]');
    const handler = page.locator('.resizable-target-handler-horizontal');
    const items = group.locator('.semi-resizable-item');
    const box = await handler.boundingBox();
    if (!box) throw new Error('ResizeGroup 水平手柄不可测量');
    await handler.dispatchEvent('mousedown', {
      button: 0,
      clientX: box.x + box.width / 2,
      clientY: box.y + box.height / 2,
    });
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    );
    await page.mouse.move(box.x + box.width / 2 + 36, box.y + box.height / 2);
    await expect(items.first()).toContainText('Resizing');
    await page.mouse.up();
    await expect(items.first()).toContainText('Drag divider to resize');
    const [first, second] = await Promise.all([
      items.nth(0).boundingBox(),
      items.nth(1).boundingBox(),
    ]);
    return [first?.width ?? 0, second?.width ?? 0];
  }

  const [reactGroupWidths, vueGroupWidths] = await Promise.all([
    dragGroup(pair.react.page),
    dragGroup(pair.vue.page),
  ]);
  expect(Math.abs(vueGroupWidths[0] - reactGroupWidths[0])).toBeLessThanOrEqual(0.5);
  expect(Math.abs(vueGroupWidths[1] - reactGroupWidths[1])).toBeLessThanOrEqual(0.5);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Resizable React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'resizable',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('resizable-reference');
      const vueTarget = pair.vue.page.getByTestId('resizable-vue');
      await expect(reactTarget).toHaveScreenshot(
        `resizable-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`resizable-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}
