import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import HotKeys from './HotKeys.vue';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('HotKeys SSR', () => {
  it('服务端输出固定键帽 DOM 且不访问 browser global', async () => {
    vi.stubGlobal('document', undefined);
    const html = await renderToString(
      h(HotKeys, {
        'aria-label': 'Shortcut',
        content: ['Ctrl', 'K'],
        hotKeys: ['control', 'k'],
      }),
    );
    expect(html).toContain('class="semi-hotKeys"');
    expect(html).toContain('class="semi-hotKeys-content">Ctrl</span>');
    expect(html).toContain('class="semi-hotKeys-split">+</span>');
    expect(html).toContain('aria-label="Shortcut"');
  });

  it('服务端 slot 覆盖键帽，空 slot 输出注释节点', async () => {
    const custom = await renderToString(
      h(HotKeys, { hotKeys: ['r'] }, { default: () => h('strong', 'Run') }),
    );
    expect(custom).toContain('<strong>Run</strong>');
    expect(custom).not.toContain('semi-hotKeys-content');
    expect(await renderToString(h(HotKeys, { hotKeys: ['r'] }, { default: () => null }))).toBe(
      '<!--v-if-->',
    );
  });

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
