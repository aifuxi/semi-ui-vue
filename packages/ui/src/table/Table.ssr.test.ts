import { mount } from '@vue/test-utils';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it, vi } from 'vitest';

import { Table } from './index';

const props = {
  columns: [
    { dataIndex: 'name', key: 'name', title: 'Name' },
    { dataIndex: 'value', key: 'value', title: 'Value' },
  ],
  dataSource: [{ key: 'one', name: 'One', value: 1 }],
  pagination: false,
};

describe('Table SSR', () => {
  it('无 DOM 环境输出稳定 table/thead/tbody 与公开内容', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(Table, props) }));
    expect(html).toContain('semi-table-wrapper-ltr');
    expect(html).toContain('role="columnheader"');
    expect(html).toContain('role="gridcell"');
    expect(html).toContain('One');
  });

  it('空态、选择与展开 SSR 不读取浏览器全局', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Table, {
            columns: props.columns,
            dataSource: [],
            empty: 'Empty',
            pagination: false,
            rowSelection: true,
          }),
      }),
    );
    expect(html).toContain('semi-table-placeholder');
    expect(html).toContain('Empty');
    expect(html).toContain('column-selection');
  });

  it('hydration 后无 warning 并初始化虚拟列表 ref', async () => {
    const getVirtualizedListRef = vi.fn();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const wrapper = mount(Table, {
      props: {
        ...props,
        getVirtualizedListRef,
        scroll: { y: 120 },
        virtualized: true,
      },
    });
    expect(wrapper.find('.semi-table-virtualized').exists()).toBe(true);
    expect(getVirtualizedListRef).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.anything() }),
    );
    expect(consoleError).not.toHaveBeenCalled();
    wrapper.unmount();
    expect(getVirtualizedListRef).toHaveBeenLastCalledWith({ current: null });
  });
});
