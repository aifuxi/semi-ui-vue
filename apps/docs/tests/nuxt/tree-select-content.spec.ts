import { expect, test } from '@playwright/test';

for (const locale of ['zh-cn', 'en-us'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`TreeSelect 文档：${locale} ${theme} 搜索、受控选择与键盘`, async ({ page }) => {
      await page.addInitScript((mode) => localStorage.setItem('semi-docs-theme', mode), theme);
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`/${locale}/components/tree-select/`);
      await expect(page.locator('[data-demo-id]')).toHaveCount(19);
      await expect(page.locator('.demo-loading')).toHaveCount(0);
      await expect(page.locator('.demo-error')).toHaveCount(0);
      await expect(page.locator('[data-api-kind="props"]')).toContainText('loadedKeys');
      await expect(page.locator('[data-api-kind="slots"]')).toContainText('selectedItem');
      const controlled = page.locator(`[data-demo-id="tree-select/${locale}/Controlled"]`);
      const trigger = controlled.getByRole('combobox');
      await expect(trigger).toContainText(locale === 'zh-cn' ? '上海' : 'Shanghai');
      await trigger.click();
      await page
        .getByRole('treeitem', { name: locale === 'zh-cn' ? '北京' : 'Beijing', exact: true })
        .click();
      await expect(trigger).toContainText(locale === 'zh-cn' ? '北京' : 'Beijing');
      await trigger.focus();
      await trigger.press('Enter');
      await expect(page.getByRole('tree')).toBeVisible();
      await trigger.press('Escape');
      await expect(page.getByRole('tree')).toBeHidden();

      const search = page.locator(`[data-demo-id="tree-select/${locale}/SearchExpansion"]`);
      await search.getByRole('combobox').click();
      await page
        .locator('.semi-tree-select-popover input')
        .fill(locale === 'zh-cn' ? '上海' : 'Shanghai');
      await expect(
        page.getByRole('treeitem', { name: locale === 'zh-cn' ? '上海' : 'Shanghai', exact: true }),
      ).toBeVisible();
      await page.keyboard.press('Escape');
      expect(errors).toEqual([]);
    });
  }

  test(`TreeSelect 文档：${locale} 本地异步搜索与按需加载`, async ({ page }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      if (/^https?:/.test(request.url()) && new URL(request.url()).hostname !== '127.0.0.1')
        external.push(request.url());
    });
    await page.goto(`/${locale}/components/tree-select/`);
    await expect(page.locator('.demo-loading')).toHaveCount(0);
    const remote = page.locator(`[data-demo-id="tree-select/${locale}/Remote"]`);
    await remote.getByRole('combobox').click();
    const input = page.locator('.semi-tree-select-popover input');
    await input.fill('first');
    await input.fill('latest');
    await expect(page.getByRole('treeitem').filter({ hasText: 'latest' })).toHaveCount(3);
    await expect(page.getByRole('treeitem').filter({ hasText: 'first' })).toHaveCount(0);
    await input.fill('');
    await expect(page.getByRole('treeitem')).toHaveCount(0);
    await page.keyboard.press('Escape');

    const asyncDemo = page.locator(`[data-demo-id="tree-select/${locale}/AsyncData"]`);
    await asyncDemo.getByRole('combobox').click();
    const first = page.getByRole('treeitem', { name: /Expand to load$/ }).first();
    await first.locator('.semi-tree-option-expand-icon').click();
    await expect(page.getByRole('treeitem', { name: /Child Node$/ })).toHaveCount(2);
    await page
      .getByRole('treeitem', { name: /Child Node$/ })
      .first()
      .click();
    await expect(asyncDemo.getByRole('combobox')).toContainText('Child Node');
    expect(external).toEqual([]);
  });

  test(`TreeSelect 文档：${locale} 大树、动态数据与自定义标签`, async ({ page }) => {
    await page.goto(`/${locale}/components/tree-select/`);
    await expect(page.locator('.demo-loading')).toHaveCount(0);
    const virtual = page.locator(`[data-demo-id="tree-select/${locale}/Virtualized"]`);
    await virtual
      .getByRole('button', { name: locale === 'zh-cn' ? '生成数据:' : 'Generate Data:' })
      .click();
    await expect(virtual.locator('[data-demo-preview]')).toContainText('1705');
    await virtual.getByRole('combobox').click();
    await page.locator('.semi-tree-select-popover input').fill('0-0-0-0-0');
    await expect(page.getByRole('treeitem').filter({ hasText: '0-0-0-0-0' })).not.toHaveCount(0);
    expect(await page.getByRole('treeitem').count()).toBeLessThan(40);
    await page.keyboard.press('Escape');

    const dynamic = page.locator(`[data-demo-id="tree-select/${locale}/DynamicData"]`);
    await dynamic
      .getByRole('button', {
        name: locale === 'zh-cn' ? '动态改变数据' : 'Update data dynamically',
      })
      .click();
    await dynamic.getByRole('combobox').click();
    await expect(page.getByRole('treeitem', { name: /Item-/ })).toHaveCount(2);
    await page.keyboard.press('Escape');

    const custom = page.locator(`[data-demo-id="tree-select/${locale}/CustomTrigger"]`);
    await custom.getByRole('textbox').click();
    await custom.getByRole('textbox').fill(locale === 'zh-cn' ? '上海' : 'Shanghai');
    await page.getByRole('treeitem', { name: locale === 'zh-cn' ? /上海$/ : /Shanghai$/ }).click();
    await expect(custom.locator('.semi-tag')).toContainText(
      locale === 'zh-cn' ? '上海' : 'Shanghai',
    );
    await custom.locator('.semi-tag-close').click();
    await expect(custom.locator('.semi-tag')).toHaveCount(0);
    await expect(page.locator('.demo-error')).toHaveCount(0);
  });
}
