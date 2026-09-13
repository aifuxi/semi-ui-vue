import { mount } from '@vue/test-utils';
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

describe('Table client mount', () => {
  it('客户端挂载无 warning 并初始化虚拟列表 ref', async () => {
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
