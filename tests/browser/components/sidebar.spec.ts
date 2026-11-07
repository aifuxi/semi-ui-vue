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
  waitForStableRendering,
} from '../parity-harness';

async function expectSidebarReady(page: Page): Promise<void> {
  await expect(page.locator('.sidebar-scenario .semi-sidebar-container')).toHaveCount(1);
  await expect(page.locator('.sidebar-scenario .semi-sidebar-options-button')).toHaveCount(2);
  await expect(page.locator('.sidebar-scenario .semi-sidebar-code-content')).toContainText('ready');
  await waitForStableRendering(page);
}

test('Sidebar 参考场景来自本地 v2.102.0 且无运行时错误', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'sidebar',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expectSidebarReady(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.sidebarPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'sidebar')).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('Sidebar React/Vue 基础 DOM、样式、几何与受控选项一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'sidebar',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([expectSidebarReady(pair.react.page), expectSidebarReady(pair.vue.page)]);
  expect(assertScenarioComparable('sidebar').targets).toHaveLength(4);
  for (const target of assertScenarioComparable('sidebar').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'sidebar', target.id));
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const buttons = parityPage.locator('.sidebar-scenario .semi-sidebar-options-button');
    await buttons.nth(1).click();
    await expect(buttons.nth(1)).not.toHaveClass(/semi-sidebar-options-normal/);
    await expect(buttons.nth(0)).toHaveClass(/semi-sidebar-options-normal/);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Sidebar React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        { scenarioId: 'sidebar', theme, direction: 'ltr', locale: 'zh-CN' },
        PARITY_VIEWPORTS[viewportName],
      );
      await Promise.all([expectSidebarReady(pair.react.page), expectSidebarReady(pair.vue.page)]);
      const reactTarget = pair.react.page.getByTestId('sidebar-reference');
      const vueTarget = pair.vue.page.getByTestId('sidebar-vue');
      await expect(reactTarget).toHaveScreenshot(`sidebar-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`sidebar-vue-${viewportName}-${theme}.png`);
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

test('Sidebar en-US Locale 与 RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'sidebar',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([expectSidebarReady(pair.react.page), expectSidebarReady(pair.vue.page)]);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('.sidebar-scenario .semi-sidebar-container')).toHaveCSS(
      'direction',
      'rtl',
    );
    await expect(parityPage.locator('.sidebar-scenario')).toContainText('Developer resources');
  }
  const reactTarget = pair.react.page.getByTestId('sidebar-reference');
  const vueTarget = pair.vue.page.getByTestId('sidebar-vue');
  await expect(reactTarget).toHaveScreenshot('sidebar-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('sidebar-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const theme of ['light', 'dark'] as const) {
  /** 编辑工具栏与真实边缘 resize 保护实看发现的 CSS 顺序及按钮状态。 */
  test(`Sidebar 文件编辑与调整宽度保持固定视觉：${theme}`, async ({ context }) => {
    /** 采用现有来源核验，query 只打开真实公开 props。 */
    const pair = await openParityPages(
      context,
      { scenarioId: 'sidebar', theme, direction: 'ltr', locale: 'zh-CN' },
      PARITY_VIEWPORTS.desktop,
    );
    for (const entry of [pair.react, pair.vue]) {
      /** 文件模式显示真实 Tiptap 工具栏。 */
      const url = new URL(entry.page.url());
      url.searchParams.set('sidebarMode', 'file');
      url.searchParams.set('reviewEditable', '1');
      await entry.page.goto(url.toString());
      /** CB 依赖 Sidebar 样式覆盖默认 Button，入口顺序错误会改成14px/6px12px。 */
      const codeBlock = entry.page.locator('.semi-sidebar-file-menu-bar-btn-codeblock');
      await expect(codeBlock).toHaveCSS('font-size', '12px');
      await expect(codeBlock).toHaveCSS('padding', '8px');
      await expect(
        entry.page
          .locator('.semi-sidebar-file-menu-bar button')
          .filter({ has: entry.page.locator('.semi-icon-link') }),
      ).toBeEnabled();
      await entry.page.locator('.tiptap[contenteditable="true"]').fill('编辑后的说明');
      await waitForStableRendering(entry.page);
    }
    /** 编辑后的像素包含按钮分行与正文首行布局。 */
    let screenshots = await Promise.all([
      pair.react.page.locator('.sidebar-scenario').screenshot({ animations: 'disabled' }),
      pair.vue.page.locator('.sidebar-scenario').screenshot({ animations: 'disabled' }),
    ]);
    await expectScreenshotPixelsToMatch(pair.react.page, screenshots[1], screenshots[0]);
    for (const entry of [pair.react, pair.vue]) {
      /** 主面板边缘通过鼠标拖动真实 Resizable handle。 */
      const url = new URL(entry.page.url());
      url.searchParams.delete('sidebarMode');
      url.searchParams.delete('reviewEditable');
      url.searchParams.set('reviewResizable', '1');
      await entry.page.goto(url.toString());
      /** 坐标来自真实 handle 几何，两个页面使用同一80px位移。 */
      const handle = entry.page.locator('.sidebar-scenario .semi-resizable-resizableHandler-left');
      await expect(handle).toBeVisible();
      /** 无坐标时立即失败，避免静默跳过 resize。 */
      const box = await handle.boundingBox();
      expect(box).not.toBeNull();
      await entry.page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
      await entry.page.mouse.down();
      await entry.page.mouse.move(box!.x + box!.width / 2 - 80, box!.y + box!.height / 2, {
        steps: 5,
      });
      await entry.page.mouse.up();
      await waitForStableRendering(entry.page);
    }
    screenshots = await Promise.all([
      pair.react.page.locator('.sidebar-scenario').screenshot({ animations: 'disabled' }),
      pair.vue.page.locator('.sidebar-scenario').screenshot({ animations: 'disabled' }),
    ]);
    await expectScreenshotPixelsToMatch(pair.react.page, screenshots[1], screenshots[0]);
    expect(pair.react.runtimeErrors).toEqual([]);
    expect(pair.vue.runtimeErrors).toEqual([]);
  });
}
