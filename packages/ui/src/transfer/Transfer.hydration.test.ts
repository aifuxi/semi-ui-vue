import { describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Transfer from './index';

const data = [
  { key: 'a', label: 'Alpha', value: 'alpha' },
  { key: 'b', label: 'Beta', value: 'beta' },
];

describe('Transfer hydration', () => {
  it('hydration 无警告并保留受控 DOM', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = { render: () => h(Transfer, { dataSource: data, value: ['alpha'] }) };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    const app = createSSRApp(Host);
    app.mount(container);
    expect(container.querySelectorAll('.semi-transfer-right-item')).toHaveLength(1);
    expect(error).not.toHaveBeenCalled();
    app.unmount();
    error.mockRestore();
  });
});
