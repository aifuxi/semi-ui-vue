import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Collapsible from './index';

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
});
