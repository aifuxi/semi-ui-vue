import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';

import HotKeys from './HotKeys.vue';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('HotKeys hydration', () => {
  it('hydration 后注册 body 监听，卸载后完整清理且无 warning', async () => {
    const onHotKey = vi.fn();
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = {
      render: () => h(HotKeys, { hotKeys: ['control', 'k'], onHotKey }),
    };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    const app = createSSRApp(Host);
    app.mount(container);
    await nextTick();

    document.body.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        code: 'KeyK',
        ctrlKey: true,
        key: 'k',
      }),
    );
    expect(onHotKey).toHaveBeenCalledOnce();
    expect(error).not.toHaveBeenCalled();

    app.unmount();
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, code: 'KeyK', ctrlKey: true, key: 'k' }),
    );
    expect(onHotKey).toHaveBeenCalledOnce();
  });
});
