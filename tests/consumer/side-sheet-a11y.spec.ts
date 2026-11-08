import { expect, test } from './fixtures';

// 名称来自浏览器真实可访问性计算，浅深主题均保留组件默认动效。
for (const mode of ['light', 'dark']) {
  // 使用新构建 tarball，避免源码别名或组件 mock 掩盖发布问题。
  test(`真实 tarball SideSheet 名称、动态更新与重开：${mode}`, async ({ page, packedConsumer }) => {
    await page.goto(packedConsumer.url + '?side-sheet-a11y');
    // 主题通过公开属性切换，不覆盖组件样式。
    await page.evaluate((value) => document.body.setAttribute('theme-mode', value), mode);
    /** 用可访问名称定位，属性未透传时会直接失败。 */
    const original = page.getByRole('dialog', { name: '工作项详情', exact: true });
    await expect(original).toBeVisible();
    await original.getByRole('button', { name: '切换工作项', exact: true }).click();
    /** 同一个实例更新名称后应当仍可被辅助技术正确定位。 */
    const updated = page.getByRole('dialog', { name: '更新后的详情', exact: true });
    await expect(updated).toBeVisible();
    await expect(updated).toHaveAttribute('aria-label', '更新后的详情');
    await updated.locator('.semi-sidesheet-close').click();
    await expect(updated).toHaveCount(0);
    await page.getByRole('button', { name: '打开详情', exact: true }).click();
    await expect(updated).toBeVisible();
    await expect(updated.getByRole('heading', { level: 2 })).toHaveText('更新后的详情');
  });
}
