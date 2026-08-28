// @vitest-environment node

import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import { Breadcrumb, BreadcrumbItem, ConfigProvider } from '../index';

describe('Breadcrumb SSR', () => {
  it('输出 route/slot/collapse/RTL 静态 DOM，不创建 Portal 或访问 browser global', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            ConfigProvider,
            { direction: 'rtl' },
            {
              default: () =>
                h(
                  Breadcrumb,
                  { moreType: 'popover', 'aria-label': 'SSR breadcrumb' },
                  {
                    default: () =>
                      ['一', '二', '三', '四', '五'].map((name, index) =>
                        h(BreadcrumbItem, index === 0 ? { href: '/first' } : {}, {
                          default: () => name,
                        }),
                      ),
                  },
                ),
            },
          ),
      }),
    );
    expect(html).toContain('class="semi-rtl"');
    expect(html).toContain('class="semi-breadcrumb-wrapper semi-breadcrumb-wrapper-compact"');
    expect(html).toContain('aria-label="SSR breadcrumb"');
    expect(html).toContain('semi-breadcrumb-collapse');
    expect(html).toContain('aria-current="page"');
    expect(html).not.toContain('semi-portal-inner');
    expect(html).not.toContain('vendor/semi-design');
  });
});
