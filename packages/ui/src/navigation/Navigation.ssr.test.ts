import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it, vi } from 'vitest';

import { ConfigProvider } from '../config-provider';
import { Nav } from './index';

const items = [{ itemKey: 'parent', text: 'Parent', items: [{ itemKey: 'leaf', text: 'Leaf' }] }];

describe('Navigation SSR', () => {
  it('输出模式、选中、展开、header/footer 与 ARIA', async () => {
    const html = await renderToString(
      h(Nav, {
        defaultOpenKeys: ['parent'],
        defaultSelectedKeys: ['leaf'],
        footer: { collapseButton: true },
        header: { text: 'Brand' },
        items,
      }),
    );
    expect(html).toContain('semi-navigation semi-navigation-vertical');
    expect(html).toContain('aria-orientation="vertical"');
    expect(html).toContain('semi-navigation-sub-open');
    expect(html).toContain('semi-navigation-item-selected');
    expect(html).toContain('Brand');
    expect(html).toContain('收起侧边栏');
  });

  it('输出水平、收起和 RTL', async () => {
    const html = await renderToString(
      h(ConfigProvider, { direction: 'rtl' }, () =>
        h(Nav, { defaultIsCollapsed: true, items, mode: 'horizontal' }),
      ),
    );
    expect(html).toContain('semi-rtl');
    expect(html).toContain('semi-navigation-horizontal');
    expect(html).toContain('semi-navigation-collapsed');
  });

  it('hydration 无警告并保留受控 DOM', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = { render: () => h(Nav, { items, openKeys: ['parent'], selectedKeys: ['leaf'] }) };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    const app = createSSRApp(Host);
    app.mount(container);
    expect(container.querySelector('.semi-navigation-item-selected')).not.toBeNull();
    expect(error).not.toHaveBeenCalled();
    app.unmount();
    error.mockRestore();
  });
});
