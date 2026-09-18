import { afterEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import HotKeys from './index';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
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
      '<!---->',
    );
  });
});
