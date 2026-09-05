import { expect, test } from '@playwright/test';

for (const locale of ['zh-cn', 'en-us'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Table 文档：${locale} ${theme} 选择、删除与展开`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('semi-docs-theme', value), theme);
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`/${locale}/components/table/`);
      await expect(page.locator('[data-demo-id]')).toHaveCount(37);
      await expect(page.locator('.demo-loading')).toHaveCount(0);
      await expect(page.locator('.demo-error')).toHaveCount(0);
      const demo = (name: string) =>
        page.locator(`[data-demo-id="table/${locale}/${name}"] [data-demo-preview]`);
      const selection = demo('Selection');
      const rowChecks = selection.locator('tbody').getByRole('checkbox');
      await expect(rowChecks).toHaveCount(3);
      await expect(rowChecks.nth(2)).toBeDisabled();
      await rowChecks.first().focus();
      await rowChecks.first().press('Space');
      await expect(rowChecks.first()).toBeChecked();
      await selection.getByLabel('Page 2', { exact: true }).click();
      await expect(selection.locator('tbody')).toContainText('3.fig');
      await selection.getByLabel('Page 1', { exact: true }).click();
      await expect(rowChecks.first()).toBeChecked();

      const custom = demo('CustomRendering');
      const remove = custom.getByRole('button', {
        name: locale === 'zh-cn' ? '删除' : 'Delete',
        exact: true,
      });
      for (let index = 0; index < 4; index++) await remove.first().click();
      await expect(custom).toContainText(locale === 'zh-cn' ? '搜索无结果' : 'No search results');
      await custom
        .getByRole('button', { name: locale === 'zh-cn' ? '重置' : 'Reset', exact: true })
        .click();
      await expect(remove).toHaveCount(4);

      const expand = demo('SeparateExpand');
      const control = expand.getByRole('button', { name: 'Expand this row', exact: true }).first();
      await control.click();
      await expect(control).toHaveAttribute('aria-expanded', 'true');
      await expect(expand.locator('article')).toHaveCount(1);
      await control.click();
      await expect(expand.locator('article')).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  }

  test(`Table 文档：${locale} 异步分页、表头筛选、排序与虚拟滚动`, async ({ page }) => {
    await page.goto(`/${locale}/components/table/`);
    await expect(page.locator('.demo-loading')).toHaveCount(0);
    const demo = (name: string) =>
      page.locator(`[data-demo-id="table/${locale}/${name}"] [data-demo-preview]`);
    const remote = demo('RemoteData');
    await expect(remote.locator('tbody tr')).toHaveCount(5);
    await remote.getByLabel('Page 2', { exact: true }).click();
    await expect(remote.locator('tbody')).toContainText('5.fig');
    await expect(remote.locator('tbody')).not.toContainText('0.fig');

    const filter = demo('HeaderFilter');
    await filter.getByRole('textbox').fill('D2C');
    await expect(filter.locator('tbody tr')).toHaveCount(10);
    await expect(filter.locator('tbody')).not.toContainText('Semi Design');
    await filter.getByRole('textbox').fill('no-matching-record');
    await expect(filter.locator('tbody tr[data-row-key]')).toHaveCount(0);
    await expect(filter.locator('.semi-table-empty')).toBeVisible();

    const sorting = demo('UndefinedSort');
    const sortButton = sorting.getByRole('button', { name: /Current sort order/ });
    await sortButton.click();
    await expect(sorting.getByRole('columnheader', { name: /Current sort order/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await expect(sorting.locator('tbody tr').last()).toContainText(
      locale === 'zh-cn' ? '未知' : 'Unknown',
    );
    await sortButton.click();
    await expect(sorting.getByRole('columnheader', { name: /Current sort order/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    await expect(sorting.locator('tbody tr').last()).toContainText(
      locale === 'zh-cn' ? '未知' : 'Unknown',
    );

    const virtual = demo('Virtualized');
    await virtual.getByRole('button', { name: 'Scroll to 100', exact: true }).click();
    await expect(virtual.locator('tbody')).toContainText('100.fig');
    expect(await virtual.locator('tbody tr[data-row-key]').count()).toBeLessThan(40);
    await expect(page.locator('.demo-error')).toHaveCount(0);
  });
}
