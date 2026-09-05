import { expect, test } from '@playwright/test';

for (const [routeLocale, demoLocale] of [
  ['zh-cn', 'zh-CN'],
  ['en-us', 'en-US'],
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Tree 文档：${routeLocale} ${theme} 搜索、完整行、异步和拖拽`, async ({ page }) => {
      await page.addInitScript((mode) => localStorage.setItem('semi-docs-theme', mode), theme);
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`/${routeLocale}/components/tree/`);
      await expect(page.locator('[data-demo-id]')).toHaveCount(27);
      await expect(page.locator('.demo-loading')).toHaveCount(0);
      await expect(page.locator('.demo-error')).toHaveCount(0);
      const demo = (name: string) =>
        page.locator(`[data-demo-id="tree/${demoLocale}/${name}"] [data-demo-preview]`);

      const search = demo('ControlledSearch');
      await search.getByRole('textbox').fill(routeLocale === 'zh-cn' ? '上海' : 'Shanghai');
      await expect(search.locator('li[data-key="0-0-1"]')).toBeVisible();

      const checkbox = demo('FullLabelCheckbox');
      await checkbox.getByText('Asia', { exact: true }).click();
      await checkbox.getByText('China', { exact: true }).click();
      const beijing = checkbox.locator('li[data-key="0-0-0"]');
      await beijing.getByText('Beijing', { exact: true }).click();
      await expect(beijing.locator('input[type="checkbox"]')).toBeChecked();
      const checkboxTrigger = beijing.locator('div[role="checkbox"]');
      await checkboxTrigger.focus();
      await checkboxTrigger.press('Space');
      await expect(beijing.locator('input[type="checkbox"]')).not.toBeChecked();

      const single = demo('FullLabelSingle');
      await single.getByText('Asia', { exact: true }).click();
      await single.getByText('China', { exact: true }).click();
      await single.getByText('Beijing', { exact: true }).click();
      await expect(single.getByRole('status')).toHaveText('Beijing');

      const asyncTree = demo('AsyncData');
      await asyncTree.locator('li[data-key="0"] .semi-tree-option-expand-icon').click();
      await expect(asyncTree.locator('li[data-key="0-0"]')).toBeVisible();

      const drag = demo('Draggable');
      await drag.locator('li[data-key="1"]').dragTo(drag.locator('li[data-key="2"]'));
      await expect(drag.locator('li[data-key="1"][aria-level="1"]')).toHaveCount(0);
      await drag.locator('li[data-key="2"] .semi-tree-option-expand-icon').click();
      await expect(drag.locator('li[data-key="1"]')).toHaveAttribute('aria-level', '2');

      const customDrag = demo('FullLabelDraggable');
      await customDrag
        .locator('li[data-key="fix-btn-0"]')
        .dragTo(customDrag.locator('li[data-key="module-1"]'), {
          targetPosition: { x: 120, y: 2 },
        });
      await expect
        .poll(() =>
          customDrag
            .locator('li[aria-level="1"]')
            .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-key'))),
        )
        .toEqual(['module-0', 'fix-btn-0', 'module-1']);

      const virtual = demo('Virtualized');
      await virtual
        .getByRole('button', { name: routeLocale === 'zh-cn' ? '生成数据' : 'Generate data' })
        .click();
      await expect(virtual.getByRole('status')).toContainText('1705');
      await virtual.getByRole('textbox').fill('0-0-0-0-0');
      await expect(
        virtual.getByRole('treeitem').filter({ hasText: '0-0-0-0-0' }).first(),
      ).toBeVisible();
      expect(await virtual.getByRole('treeitem').count()).toBeLessThan(40);
      expect(errors).toEqual([]);
    });
  }
}
