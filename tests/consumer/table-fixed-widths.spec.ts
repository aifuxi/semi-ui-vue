import { test, expect } from './fixtures';
import { expectFixedColumnAlignment } from '../browser/table-fixed-widths';

// 明暗主题与 RTL 都消费生产 tarball，保留原分页和选择行为。
for (const direction of ['ltr', 'rtl'] as const) {
  for (const theme of ['light', 'dark']) {
    // 不依赖 workspace 别名，也不在业务端将字符串转换成数值。
    test(`真实包 Table 字符串固定列、主题重测及分页：${direction}/${theme}`, async ({
      page,
      packedConsumer,
    }) => {
      await page.goto(packedConsumer.url + `?table-fixed-widths&direction=${direction}`);
      // 使用公开主题入口，不覆盖 sticky 或列宽计算。
      await page.evaluate((value) => document.body.setAttribute('theme-mode', value), theme);
      /** CSS 变量属于 Table 的祖先，切换变量不改动 Table props。 */
      const host = page.getByTestId('packed-fixed-table-host');
      /** 使用安装包实际生成的标准 Table。 */
      const table = host.locator('.semi-table-wrapper');
      await expectFixedColumnAlignment(table, direction, 56, 80);
      await expect(table.locator('tbody tr')).toHaveCount(20);
      // 右侧边界及纵向滚动均使用原生滚动事件。
      await table.locator('.semi-table-body').evaluate((body, rtl) => {
        body.scrollLeft = rtl ? -body.scrollWidth : body.scrollWidth;
        body.scrollTop = body.scrollHeight;
      }, direction === 'rtl');
      // 断言确实发生了横纵滚动，避免没有溢出的场景假装覆盖边界。
      expect(
        await table.locator('.semi-table-body').evaluate((body) => Math.abs(body.scrollLeft)),
      ).toBeGreaterThan(0);
      expect(
        await table.locator('.semi-table-body').evaluate((body) => body.scrollTop),
      ).toBeGreaterThan(0);
      await expectFixedColumnAlignment(table, direction, 56, 80);
      await page.getByRole('button', { name: '切换列宽', exact: true }).click();
      await expect(host).toHaveCSS('width', '600px');
      await expectFixedColumnAlignment(table, direction, 72, 112);
      await page.getByRole('button', { name: '切换容器宽度', exact: true }).click();
      await expect(host).toHaveCSS('width', '560px');
      await expectFixedColumnAlignment(table, direction, 72, 112);
      await table.getByRole('button', { name: 'Next', exact: true }).click();
      await expect(table.locator('tbody tr')).toHaveCount(14);
      await expectFixedColumnAlignment(table, direction, 72, 112);
      // 返回起点后固定选择列仍可操作，不能被名称列遮挡。
      await table.locator('.semi-table-body').evaluate((body) => {
        body.scrollLeft = 0;
        body.scrollTop = 0;
      });
      await expect(table.locator('.semi-table-body')).toHaveJSProperty('scrollLeft', 0);
      await expect(table.locator('.semi-table-body')).toHaveJSProperty('scrollTop', 0);
      await expectFixedColumnAlignment(table, direction, 72, 112);
      /** 通过可访问名称点击当前页第一个选择框，验证真实可点击区域。 */
      const selection = table.locator('tbody tr').first().getByRole('checkbox');
      // Semi 的装饰层覆盖原生 input；点击实际可见的 label，继续验证选择结果。
      await table.locator('tbody tr').first().locator('.semi-checkbox').click();
      await expect(selection).toBeChecked();
      // 表格有内部滚动条，但不应把整页撑出横向溢出。
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
      ).toBe(true);
    });
  }
}
