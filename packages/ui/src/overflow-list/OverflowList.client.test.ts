import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

import OverflowList from './index';
import type { OverflowItem } from './types';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('OverflowList client mount', () => {
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
