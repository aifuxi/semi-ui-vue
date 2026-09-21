import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Radio from './index';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('Radio hydration', () => {
  it('服务端与客户端使用相同的内容关联 ID', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = { render: () => h(Radio, { defaultChecked: true }, () => '选项') };
    const container = document.createElement('div');
    container.innerHTML = await renderToString(h(Host));
    const serverId = container.querySelector('.semi-radio-addon')?.id;

    const app = createSSRApp(Host);
    app.mount(container);

    expect(serverId).toBeTruthy();
    expect(container.querySelector('input')?.getAttribute('aria-labelledby')).toBe(serverId);
    expect(error).not.toHaveBeenCalled();
    app.unmount();
  });
});
