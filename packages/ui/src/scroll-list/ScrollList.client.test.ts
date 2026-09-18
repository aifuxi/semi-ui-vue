import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import { ScrollItem } from './index';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ScrollList client mount', () => {
  it('客户端挂载后初始化滚动并安全卸载', async () => {
    const wrapper = mount(ScrollItem, {
      props: { list: [{ value: 'A' }, { value: 'B' }], mode: 'wheel', motion: false },
    });
    await nextTick();
    await nextTick();

    expect(wrapper.findAll('[role="option"]')).toHaveLength(2);
    wrapper.unmount();
  });
});
