import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it, vi } from 'vitest';

import Collapsible from './Collapsible.vue';

describe('Collapsible SSR', () => {
  it('默认关闭时输出固定空内容结构且不访问 browser global', async () => {
    vi.stubGlobal('ResizeObserver', undefined);
    const html = await renderToString(
      h(
        Collapsible,
        {
          className: 'ssr-collapsible',
          'data-kind': 'ssr',
          id: 'ssr-content',
        },
        { default: () => h('p', 'hidden') },
      ),
    );
    expect(html).toContain('semi-collapsible-wrapper ssr-collapsible');
    expect(html).toContain('data-kind="ssr"');
    expect(html).toContain('height:0px');
    expect(html).toContain('transition-duration:0ms');
    expect(html).toContain('id="ssr-content"');
    expect(html).not.toContain('<p>hidden</p>');
    vi.unstubAllGlobals();
  });

  it('打开、keepDOM 与非零折叠高度按固定条件服务端渲染 slot', async () => {
    const open = await renderToString(
      h(Collapsible, { isOpen: true }, { default: () => h('p', 'open') }),
    );
    expect(open).toContain('<p>open</p>');
    expect(open).toContain('height:0px');

    const retained = await renderToString(
      h(Collapsible, { keepDOM: true, lazyRender: false }, { default: () => h('p', 'retained') }),
    );
    expect(retained).toContain('<p>retained</p>');

    const lazy = await renderToString(
      h(Collapsible, { keepDOM: true, lazyRender: true }, { default: () => h('p', 'lazy') }),
    );
    expect(lazy).not.toContain('<p>lazy</p>');

    const preview = await renderToString(
      h(Collapsible, { collapseHeight: 24 }, { default: () => h('p', 'preview') }),
    );
    expect(preview).toContain('<p>preview</p>');
    expect(preview).toContain('height:24px');
  });

  it('hydration 后无警告并在无 ResizeObserver 环境继续响应开关', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = {
      data: () => ({ open: false }),
      render(this: { open: boolean }) {
        return h(
          Collapsible,
          { isOpen: this.open, motion: false },
          { default: () => h('p', 'hydrated') },
        );
      },
    };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    vi.stubGlobal('ResizeObserver', undefined);
    const app = createSSRApp(Host);
    const vm = app.mount(container) as unknown as { open: boolean };
    vm.open = true;
    await nextTick();
    expect(container.textContent).toContain('hydrated');
    expect(error).not.toHaveBeenCalled();
    app.unmount();
    error.mockRestore();
    vi.unstubAllGlobals();
  });
});
