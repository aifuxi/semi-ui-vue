import { mount } from '@vue/test-utils';
import { describe, expect, it, rs } from '@rstest/core';

import { Table } from './index';

describe('Table 分页配置回调', () => {
  for (const position of ['top', 'bottom', 'both'] as const) {
    it(`${position} 分页每次操作只通知配置回调一次`, async () => {
      const onChange = rs.fn();
      const wrapper = mount(Table, {
        props: {
          columns: [{ dataIndex: 'name', title: 'Name' }],
          dataSource: Array.from({ length: 12 }, (_, key) => ({ key, name: `Row ${key}` })),
          pagination: { pageSize: 5, position, onChange },
        },
      });
      await wrapper.findAll('.semi-page-next')[0]!.trigger('click');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith(2, 5);
      expect(wrapper.emitted('pageChange')).toEqual([[2, 5]]);
      expect(wrapper.get('tbody > tr').text()).toBe('Row 5');
      await wrapper.findAll('.semi-page-prev')[0]!.trigger('click');
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith(1, 5);
      wrapper.unmount();
    });
  }
});
