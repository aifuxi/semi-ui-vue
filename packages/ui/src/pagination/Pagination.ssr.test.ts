// @vitest-environment node

import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import { ConfigProvider, Pagination } from '../index';

describe('Pagination SSR', () => {
  it('输出 default/small/disabled/locale/RTL 静态 DOM，不创建 Portal 或访问 browser global', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            ConfigProvider,
            {
              direction: 'rtl',
              locale: {
                code: 'en-US',
                Pagination: {
                  pageSize: 'Items per page: ${pageSize}',
                  total: 'Total pages: ${total}',
                  jumpTo: 'Jump to',
                  page: ' page',
                },
              },
            },
            {
              default: () => [
                h(Pagination, {
                  currentPage: 3,
                  showQuickJumper: true,
                  showTotal: true,
                  total: 80,
                }),
                h(Pagination, { disabled: true, size: 'small', total: 90 }),
              ],
            },
          ),
      }),
    );
    expect(html).toContain('class="semi-rtl"');
    expect(html).toContain('class="semi-page"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('Total pages: 8');
    expect(html).toContain('semi-page-small');
    expect(html).toContain('semi-page-disabled');
    expect(html).not.toContain('semi-portal-inner');
    expect(html).not.toContain('vendor/semi-design');
  });
});
