import { describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { Nav } from './index';

const items = [{ itemKey: 'parent', text: 'Parent', items: [{ itemKey: 'leaf', text: 'Leaf' }] }];

describe('Navigation hydration', () => {
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
