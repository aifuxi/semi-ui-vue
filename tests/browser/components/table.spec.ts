import { expect, test } from '@playwright/test';
import { expectFixedColumnAlignment } from '../table-fixed-widths';
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

for (const theme of ['light', 'dark'] as const) {
  /** 结构分支实际渲染后逐帧比较固定参考，补齐普通三行表格看不到的布局。 */
  test(`Table 展开、树、分组、虚拟及列伸缩结构：${theme}`, async ({ context }) => {
    /** 两端复用相同工作台及主题，后续仅更换公开 props query。 */
    const pair = await openParityPages(context, {
      scenarioId: 'table',
      theme,
      direction: 'ltr',
      locale: 'zh-CN',
    });
    /** 捕获真实 Table 根区域，直接对照固定 Semi，避免建立 Vue 自身基线。 */
    async function compare(): Promise<void> {
      /** 页面字体准备与布局由 screenshot 的稳定检查处理。 */
      const react = await pair.react.page
        .locator('.table-scenario')
        .screenshot({ animations: 'disabled' });
      /** 相同区域保留虚拟表格右侧留白，可发现外框错误拉伸。 */
      const vue = await pair.vue.page
        .locator('.table-scenario')
        .screenshot({ animations: 'disabled' });
      await expectScreenshotPixelsToMatch(pair.react.page, vue, react);
    }
    for (const variant of ['expanded', 'tree', 'group', 'virtual', 'resizable']) {
      for (const page of [pair.react.page, pair.vue.page]) {
        /** 同一数据、列宽和展开状态均由两端实际组件管理。 */
        const url = new URL(page.url());
        url.searchParams.set('reviewVariant', variant);
        await page.goto(url.toString());
        await expect(page.locator('.table-scenario')).toBeVisible();
      }
      await compare();
      if (variant === 'virtual') {
        for (const page of [pair.react.page, pair.vue.page]) {
          /** 数值 scroll.x=560 应约束整个虚拟外框，表体列宽保持50/220/120/160。 */
          await expect(page.locator('.table-scenario .semi-table-wrapper')).toHaveCSS(
            'width',
            '560px',
          );
          /** 浏览器原生滚动触发真实窗口切换，不能只验首屏。 */
          await page
            .locator('.table-scenario .semi-table-body')
            .evaluate((body) => body.scrollTo({ top: body.scrollHeight }));
          await expect(
            page.locator('.table-scenario .semi-table-tbody').getByText('资源 40', { exact: true }),
          ).toBeVisible();
        }
        await compare();
      } else if (variant === 'resizable') {
        for (const page of [pair.react.page, pair.vue.page]) {
          /** 第二个句柄是资源名称列；两端都实际拖宽80px。 */
          const handle = await page
            .locator('.table-scenario .react-resizable-handle')
            .nth(1)
            .boundingBox();
          if (!handle) throw new Error('Table resize handle is missing');
          await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
          await page.mouse.down();
          await page.mouse.move(handle.x + handle.width / 2 + 80, handle.y + handle.height / 2, {
            steps: 5,
          });
          await page.mouse.up();
        }
        await compare();
      } else {
        for (const page of [pair.react.page, pair.vue.page]) {
          await page.locator('.table-scenario .semi-table-expand-icon').first().click();
        }
        await compare();
      }
    }
  });

  /** 全局 disabled 只关闭全选，不改变各行 Checkbox 的禁用层级或半选外观。 */
  test(`Table 全选禁用保留半选及行选择：${theme}`, async ({ context }) => {
    /** 同一 query 为固定 React 和 Vue 注入真实 rowSelection.disabled。 */
    const pair = await openParityPages(context, {
      scenarioId: 'table',
      theme,
      direction: 'ltr',
      locale: 'zh-CN',
    });
    for (const page of [pair.react.page, pair.vue.page]) {
      /** 默认场景不变，仅此回归打开专项状态。 */
      const url = new URL(page.url());
      url.searchParams.set('reviewState', 'disabled');
      await page.goto(url.toString());
      /** 选择列应保持首行选中、表头半选，而非所有行都变灰。 */
      const table = page.locator('[data-parity-target="table-basic"]');
      await expect(table.locator('thead input[type="checkbox"]')).toBeDisabled();
      await expect(table.locator('thead .semi-checkbox')).toHaveClass(
        /semi-checkbox-indeterminate/,
      );
      for (const checkbox of await table.locator('tbody input[type="checkbox"]').all()) {
        await expect(checkbox).toBeEnabled();
      }
    }
    /** 像素比较直接锁定固定组件外观，不为该状态建立 Vue 自身快照。 */
    const reactScreenshot = await pair.react.page.locator('.table-scenario').screenshot();
    /** 两端实际截图同时验证禁用透明度、半选标记和行颜色。 */
    const vueScreenshot = await pair.vue.page.locator('.table-scenario').screenshot();
    await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  });
}

test('Table 参考场景来自本地 v2.102.0 并保留表格、选择与滚动契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'table',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.tablePublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'table')).toBe(true);
  const table = page.locator('[data-parity-target="table-basic"]');
  await expect(table.locator('thead th')).toHaveCount(4);
  await expect(table.locator('tbody tr')).toHaveCount(3);
  await expect(table.locator('.semi-table-row-selected')).toContainText('API Gateway');
  await expect(table.locator('input[type="checkbox"]')).toHaveCount(4);
  expect(runtimeErrors).toEqual([]);
});

test('Table React/Vue computed style、几何与公开 DOM 一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'table',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('table').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'table', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const table = page.locator('[data-parity-target="table-basic"]');
    await expect(table.locator('thead th')).toHaveCount(4);
    await expect(table.locator('tbody tr')).toHaveCount(3);
    await expect(table.locator('.semi-table-row-selected')).toHaveCount(1);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Table React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'table',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('table').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'table', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('table-reference');
      const vueTarget = pair.vue.page.getByTestId('table-vue');
      await expect(reactTarget).toHaveScreenshot(`table-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`table-vue-${viewportName}-${theme}.png`);
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

test('Table React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'table',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('table').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'table', target.id));
  }
  const reactTarget = pair.react.page.getByTestId('table-reference');
  const vueTarget = pair.vue.page.getByTestId('table-vue');
  await expect(reactTarget).toHaveScreenshot('table-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('table-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

// 固定 React 的缓存会将字符串列宽转换为实测数值，Vue 必须沿用同一偏移结果。
for (const direction of ['ltr', 'rtl'] as const) {
  // 默认结构/快照保持原样，专项 query 只改变公开 Table 输入。
  test(`Table CSS 字符串宽度初始对照及动态重测差异：${direction}`, async ({ context }) => {
    /** 两端使用完全一致的 CSS 变量与 var/calc 列宽。 */
    const pair = await openParityPages(context, {
      scenarioId: 'table',
      theme: 'light',
      direction,
      locale: 'zh-CN',
    });
    for (const page of [pair.react.page, pair.vue.page]) {
      /** 使用当前已核验的来源 URL 切换专项场景。 */
      const url = new URL(page.url());
      url.searchParams.set('reviewVariant', 'fixed-css');
      await page.goto(url.toString());
      /** 实际组件根节点，无业务 sticky 或数值列宽转换。 */
      const table = page.locator('.table-scenario .semi-table-wrapper');
      await expectFixedColumnAlignment(table, direction, 56, 80);
      // 原生横向滚动会同步独立表头，RTL 原生 scrollLeft 使用负值。
      await table.locator('.semi-table-body').evaluate((body, rtl) => {
        body.scrollLeft = rtl ? -body.scrollWidth : body.scrollWidth;
      }, direction === 'rtl');
      await expectFixedColumnAlignment(table, direction, 56, 80);
      // 固定 React 只在列对象更新时刷新表头缓存；动态 CSS 的已知限制必须明确记录。
      await page.locator('.table-scenario').evaluate((host) => {
        host.style.setProperty('--table-selection-width', '72px');
        host.style.setProperty('--table-end-width', '112px');
        host.style.width = '560px';
      });
      if (page === pair.react.page) {
        // 实际 CSS 宽度已变化，但固定基线仍保存初始偏移；不把此结果当作正确预期交给 Vue。
        // 表头有 padding/border，以 border-box 实测宽度核对 CSS 变量的结果。
        await expect
          .poll(
            // 与固定缓存读取 getBoundingClientRect 的方式一致。
            async () =>
              table
                .locator('thead th')
                .first()
                .evaluate((head) => head.getBoundingClientRect().width),
          )
          .toBe(72);
        await expect(table.locator('thead th').nth(1)).toHaveCSS(
          direction === 'rtl' ? 'right' : 'left',
          '56px',
        );
      } else {
        // Vue 补充表头 ResizeObserver，按新几何满足工单的主题重测要求。
        await expectFixedColumnAlignment(table, direction, 72, 112);
      }
    }
    expect(pair.react.runtimeErrors).toEqual([]);
    expect(pair.vue.runtimeErrors).toEqual([]);
  });
}
