// @vitest-environment node

import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import { Anchor, AnchorLink, ConfigProvider } from '../index';

describe('Anchor SSR', () => {
  it('输出默认、嵌套、禁用、RTL 与 Tooltip 静态 DOM，不创建 Portal 或访问浏览器全局', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            ConfigProvider,
            { direction: 'rtl' },
            {
              default: () =>
                h(
                  Anchor,
                  { showTooltip: true, size: 'small' },
                  {
                    default: () =>
                      h(
                        AnchorLink,
                        { disabled: true, href: '#parent', title: 'Parent' },
                        { default: () => h(AnchorLink, { href: '#child', title: 'Child' }) },
                      ),
                  },
                ),
            },
          ),
      }),
    );
    expect(html).toContain('class="semi-rtl"');
    expect(html).toContain('class="semi-anchor semi-anchor-size-small');
    expect(html).toContain('role="navigation"');
    expect(html).toContain('aria-label="Side navigation"');
    expect(html).toContain('semi-anchor-link-title-disabled');
    expect(html).toContain('padding-right:8px');
    expect(html).toContain('padding-right:16px');
    expect(html).toContain('semi-anchor-link-tooltip-small');
    expect(html).not.toContain('semi-portal');
    expect(html).not.toContain('vendor/semi-design');
  });
});
