import { mount } from '@vue/test-utils';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ScrollItem from './ScrollItem.vue';
import ScrollList from './ScrollList.vue';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ScrollList SSR', () => {
  it('无 window/document 时可渲染根、normal 与 wheel 稳定结构', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            ScrollList,
            { header: 'SSR header', footer: 'SSR footer' },
            {
              default: () => [
                h(ScrollItem, { list: [{ value: 'A' }], mode: 'normal' }),
                h(ScrollItem, { list: [{ value: 'B' }], mode: 'wheel' }),
              ],
            },
          ),
      }),
    );

    expect(html).toContain('semi-scrolllist-header-title');
    expect(html).toContain('semi-scrolllist-item');
    expect(html).toContain('semi-scrolllist-item-wheel');
    expect(html).toContain('role="listbox"');
    expect(html).toContain('SSR footer');
  });

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
