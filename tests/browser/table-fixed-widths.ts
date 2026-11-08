import { expect, type Locator } from '@playwright/test';

/** 检查真实 sticky 偏移和表头/正文的水平几何，不以 Vue 当前输出作为预期。 */
export async function expectFixedColumnAlignment(
  table: Locator,
  direction: 'ltr' | 'rtl',
  selectionWidth: number,
  lastWidth: number,
): Promise<void> {
  /** RTL 的物理左右互换，固定列的逻辑次序保持原契约。 */
  const left = direction === 'rtl' ? 'right' : 'left';
  /** 右侧倒数第二列应累加最末列实际宽度。 */
  const right = direction === 'rtl' ? 'left' : 'right';
  await expect(table.locator('thead th').nth(1)).toHaveCSS(left, `${selectionWidth}px`);
  await expect(table.locator('thead th').nth(3)).toHaveCSS(right, `${lastWidth}px`);
  await expect(table.locator('tbody tr').first().locator('td').nth(1)).toHaveCSS(
    left,
    `${selectionWidth}px`,
  );
  await expect(table.locator('tbody tr').first().locator('td').nth(3)).toHaveCSS(
    right,
    `${lastWidth}px`,
  );
  // 等待真实测量完成；0.5 CSS px 沿用项目的几何比较阈值。
  await expect
    .poll(
      // 所有当前页固定单元格都应与对应表头同宽且处于同一横坐标。
      async () =>
        table.evaluate((root) => {
          /** 固定列是选择/名称/右侧两列，不纳入随滚动移动的中间列。 */
          const indices = [0, 1, 3, 4];
          /** 独立表头不包含虚构的测量结果。 */
          const headers = root.querySelectorAll('thead th');
          let delta = 0;
          for (const row of root.querySelectorAll('tbody tr')) {
            for (const index of indices) {
              /** 使用真实浏览器矩形，同时检查错误偏移和列宽分摊。 */
              const header = headers[index]!.getBoundingClientRect();
              /** 各行相同列序对应自己的 sticky 单元格。 */
              const body = row.children[index]!.getBoundingClientRect();
              delta = Math.max(
                delta,
                Math.abs(header.x - body.x),
                Math.abs(header.width - body.width),
              );
            }
          }
          return delta;
        }),
    )
    .toBeLessThanOrEqual(0.5);
}
