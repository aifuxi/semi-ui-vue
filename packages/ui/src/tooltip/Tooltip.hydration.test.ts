import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Tooltip from './index';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('Tooltip hydration', () => {
  it('服务端与客户端使用相同的 popup ID', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = {
      render: () => h(Tooltip, { content: '提示' }, () => h('button', '触发器')),
    };
    const container = document.createElement('div');
    container.innerHTML = await renderToString(h(Host));
    const serverId = container.querySelector('button')?.getAttribute('aria-describedby');

    const app = createSSRApp(Host);
    app.mount(container);

    expect(serverId).toBeTruthy();
    expect(container.querySelector('button')?.getAttribute('aria-describedby')).toBe(serverId);
    expect(error).not.toHaveBeenCalled();
    app.unmount();
  });

  it('保留模板触发器的 tabindex', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = {
      render: () =>
        h(Tooltip, { content: '提示' }, () => h('a', { tabindex: undefined }, '触发器')),
    };
    const container = document.createElement('div');
    container.innerHTML = await renderToString(h(Host));

    const app = createSSRApp(Host);
    app.mount(container);

    expect(container.querySelector('a')?.getAttribute('tabindex')).toBe('0');
    expect(error).not.toHaveBeenCalled();
    app.unmount();
  });
});
