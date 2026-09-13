import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import OverflowList from './OverflowList.vue';
import type { OverflowItem } from './types';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('OverflowList SSR', () => {
  it('无 DOM observer 时可导入并渲染稳定 collapse 结构', async () => {
    vi.stubGlobal('ResizeObserver', undefined);
    vi.stubGlobal('IntersectionObserver', undefined);
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            OverflowList,
            { items: [{ key: 'a' }] },
            {
              visibleItem: ({ item }: { item: OverflowItem }) => h('span', String(item.key)),
              overflow: ({ items }: { items: unknown[] }) => h('span', `+${items.length}`),
            },
          ),
      }),
    );

    expect(html).toContain('semi-overflow-list');
    expect(html).toContain('semi-overflow-list-item');
    expect(html).toContain('visibility:hidden');
  });
});
