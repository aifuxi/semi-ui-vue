import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../../packages/test-infra/src';
import {
  expectComparableTarget,
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
  expect(referenceSourceWasRequested(requestedUrls, 'tree')).toBe(true);
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

for (const viewportName of ['desktop', 'mobile'] as const) {
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
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
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
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
