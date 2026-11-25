import { expect, test } from '@playwright/test';
import { createVueScenarioUrl } from '../parity-harness';

// 仅本规格启用原生占宽滚动条，保留其它表格对照的默认浏览器配置。
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } });

for (const direction of ['ltr', 'rtl'] as const) {
  test(`Table 纵向滚动条占宽时横滚到底仍对齐：${direction}`, async ({ page }) => {
    const url = new URL(
      createVueScenarioUrl({ scenarioId: 'table', theme: 'light', direction, locale: 'zh-CN' }),
    );
    url.searchParams.set('reviewVariant', 'fixed-css');
    await page.goto(url.toString());
    const table = page.getByTestId('table-vue');
    const body = table.locator('.semi-table-body');
    await expect(body.locator('tbody tr')).toHaveCount(3);

    // 让 Chromium 即使在系统使用叠加滚动条时也复现正文占宽 10px 的布局。
    const gutterStyle = await page.addStyleTag({
      content: `
        .table-scenario .semi-table-body { max-height: 80px !important; }
        .table-scenario .semi-table-body::-webkit-scrollbar { width: 10px; height: 10px; }
      `,
    });
    await expect
      .poll(() =>
        body.evaluate((element: HTMLElement) => element.offsetWidth - element.clientWidth),
      )
      .toBe(10);
    const end = await body.evaluate((element, rtl) => {
      const max = element.scrollWidth - element.clientWidth;
      element.scrollLeft = rtl ? -max : max;
      return max;
    }, direction === 'rtl');
    expect(end).toBeGreaterThan(10);
    await expect.poll(() => body.evaluate((element) => Math.abs(element.scrollLeft))).toBe(end);

    async function expectColumnsAligned() {
      await expect
        .poll(() =>
          table.evaluate((root) => {
            const body = root.querySelector('.semi-table-body')!;
            const header = root.querySelector('.semi-table-header')!;
            const cells = body.querySelector('tbody tr')!.children;
            const headers = [...header.querySelectorAll('thead th')];
            return Math.max(
              Math.abs(header.clientWidth - body.clientWidth),
              Math.abs(header.scrollLeft - body.scrollLeft),
              ...headers.map((cell, index) =>
                Math.abs(cell.getBoundingClientRect().x - cells[index]!.getBoundingClientRect().x),
              ),
            );
          }),
        )
        .toBeLessThanOrEqual(0.5);
    }
    await expectColumnsAligned();

    // 行高限制放宽后，正文不再需要纵向滚动条，表头应释放预留空间。
    await gutterStyle.evaluate((element) => (element as HTMLStyleElement).remove());
    await expect
      .poll(() =>
        body.evaluate((element: HTMLElement) => element.offsetWidth - element.clientWidth),
      )
      .toBe(0);
    await expectColumnsAligned();
  });
}
