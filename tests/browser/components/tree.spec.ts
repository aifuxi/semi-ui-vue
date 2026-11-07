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

test('Tree 参考场景来自本地 v2.102.0 并保留节点、选择、搜索与目录 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'tree',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.treePublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'tree')).toBe(true);
  const scenario = page.getByTestId('tree-reference');
  await expect(scenario.locator('[role="tree"]')).toHaveCount(4);
  await expect(scenario.locator('[data-key="beijing"]')).toHaveCount(4);
  await expect(scenario.locator('[data-key="shanghai"]').first()).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(scenario.locator('.semi-tree-option-selected')).toHaveCount(1);
  await expect(scenario.locator('.semi-checkbox-checked')).toHaveCount(2);
  await expect(scenario.getByRole('textbox', { name: 'Filter Tree' })).toHaveAttribute(
    'placeholder',
    '搜索',
  );
  await expect(scenario.locator('.semi-tree-option-indent-show-line')).not.toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
});

test('Tree React/Vue 选择、禁用、搜索、键盘、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tree',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('tree').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('tree').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'tree', target.id);
    });
  }

  const reactBasic = pair.react.page.locator('[data-parity-target="tree-basic"]');
  const vueBasic = pair.vue.page.locator('[data-parity-target="tree-basic"]');
  await Promise.all([
    reactBasic.locator('[data-key="japan"]').click(),
    vueBasic.locator('[data-key="japan"]').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('选择：Japan'),
    expect(pair.vue.page.getByRole('status')).toHaveText('选择：Japan'),
    expect(reactBasic.locator('[data-key="japan"]')).toHaveClass(/semi-tree-option-selected/),
    expect(vueBasic.locator('[data-key="japan"]')).toHaveClass(/semi-tree-option-selected/),
  ]);

  await Promise.all([
    reactBasic.locator('[data-key="shanghai"]').dispatchEvent('click'),
    vueBasic.locator('[data-key="shanghai"]').dispatchEvent('click'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('选择：Japan'),
    expect(pair.vue.page.getByRole('status')).toHaveText('选择：Japan'),
  ]);

  const reactSearch = pair.react.page.locator('[data-parity-target="tree-search"]');
  const vueSearch = pair.vue.page.locator('[data-parity-target="tree-search"]');
  await Promise.all([
    reactSearch.getByRole('textbox', { name: 'Filter Tree' }).fill('北京'),
    vueSearch.getByRole('textbox', { name: 'Filter Tree' }).fill('北京'),
  ]);
  await Promise.all([
    expect(reactSearch.locator('.semi-tree-option-highlight')).toHaveText('北京'),
    expect(vueSearch.locator('.semi-tree-option-highlight')).toHaveText('北京'),
  ]);

  await Promise.all([
    reactBasic
      .locator('[data-key="america"]')
      .dispatchEvent('keypress', { charCode: 13, key: 'Enter', keyCode: 13 }),
    vueBasic
      .locator('[data-key="america"]')
      .dispatchEvent('keypress', { charCode: 13, key: 'Enter', keyCode: 13 }),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('选择：America'),
    expect(pair.vue.page.getByRole('status')).toHaveText('选择：America'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Tree React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'tree',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('tree-reference');
      const vueTarget = pair.vue.page.getByTestId('tree-vue');
      await expect(reactTarget).toHaveScreenshot(`tree-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`tree-vue-${viewportName}-${theme}.png`);
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

test('Tree React/Vue RTL 与 en-US 搜索文案、样式、几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tree',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('tree').targets) {
    await expectComparableTarget(pair, 'tree', target.id);
  }
  await Promise.all([
    expect(pair.react.page.getByRole('textbox', { name: 'Filter Tree' })).toHaveAttribute(
      'placeholder',
      'Search',
    ),
    expect(pair.vue.page.getByRole('textbox', { name: 'Filter Tree' })).toHaveAttribute(
      'placeholder',
      'Search',
    ),
  ]);
  const reactTarget = pair.react.page.getByTestId('tree-reference');
  const vueTarget = pair.vue.page.getByTestId('tree-vue');
  await expect(reactTarget).toHaveScreenshot('tree-reference-light-rtl-en.png');
  await expect(vueTarget).toHaveScreenshot('tree-vue-light-rtl-en.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const theme of ['light', 'dark'] as const) {
  /** 专项页面通过公开 props 驱动异步与虚拟状态，保护实看发现的两个回归。 */
  test(`Tree 加载图标与虚拟滚动父容器测高一致：${theme}`, async ({ context }) => {
    /** 两端共用固定来源与相同桌面 viewport。 */
    const pair = await openParityPages(
      context,
      { scenarioId: 'tree', theme, direction: 'ltr', locale: 'zh-CN' },
      PARITY_VIEWPORTS.desktop,
    );
    for (const variant of ['loading', 'virtual']) {
      for (const entry of [pair.react, pair.vue]) {
        /** 仅补充状态 query，保留来源、语言、主题与方向。 */
        const url = new URL(entry.page.url());
        url.searchParams.set('reviewTree', variant);
        await entry.page.goto(url.toString());
        /** 场景中的第一个树才受专项 query 影响。 */
        const root = entry.page.locator('[data-parity-target="tree-basic"]');
        if (variant === 'loading') {
          await root.locator('.semi-tree-option-expand-icon').click();
          await expect(root.locator('.semi-tree-option-spin-icon')).toHaveClass(/semi-spin-middle/);
          await expect(root.locator('.semi-tree-option-spin-icon svg linearGradient')).toHaveCount(
            1,
          );
          // 固定旋转相位，只消除不同时启动的动画时间差。
          await entry.page.addStyleTag({
            content:
              '.semi-tree-option-spin-icon svg { animation: none !important; transform: rotate(0deg) !important; }',
          });
        } else {
          await expect(root.locator('.semi-tree-auto-wrapper')).toHaveCount(1);
          // 包装层保持默认高度，子 viewport 才使用父列表的实际可用高度。
          await expect(root.locator('.semi-tree-auto-wrapper')).toHaveAttribute(
            'style',
            /height:\s*180px;/,
          );
          await expect(root.locator('.semi-tree-auto-wrapper')).toHaveCSS('height', '180px');
          await expect(root.locator('.semi-tree-virtual-list')).toHaveCSS('height', '232px');
          await root
            .locator('.semi-tree-virtual-list')
            .evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
          await expect(root.getByText('节点 80', { exact: true })).toBeVisible();
        }
      }
      /** 同一真实状态使用固定 React 当轮渲染作为像素比较来源。 */
      const screenshots = await Promise.all([
        pair.react.page.locator('.tree-scenario').screenshot({ animations: 'disabled' }),
        pair.vue.page.locator('.tree-scenario').screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, screenshots[1], screenshots[0]);
    }
    expect(pair.react.runtimeErrors).toEqual([]);
    expect(pair.vue.runtimeErrors).toEqual([]);
  });
}
