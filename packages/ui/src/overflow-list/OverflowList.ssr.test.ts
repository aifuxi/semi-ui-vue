import { mount } from '@vue/test-utils';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

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

  it('observer 不可用时客户端挂载安全降级并保持 slot 内容', async () => {
    vi.stubGlobal('ResizeObserver', undefined);
    vi.stubGlobal('IntersectionObserver', undefined);
    const wrapper = mount(OverflowList, {
      props: { items: [{ key: 'a' }], renderMode: 'scroll' },
      slots: {
        visibleItem: ({ item }: { item: OverflowItem }) => h('button', String(item.key)),
      },
    });
    await nextTick();

    expect(wrapper.find('button[data-scrollkey="a"]').text()).toBe('a');
    wrapper.unmount();
  });
});
