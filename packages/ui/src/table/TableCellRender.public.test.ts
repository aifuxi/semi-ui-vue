import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it } from '@rstest/core';

import { Table } from './index';

describe('Table 单元格渲染对象', () => {
  it('props 可缺省，children 仍按 VNode 渲染并保留后续合并跨度', () => {
    const wrapper = mount(Table, {
      props: {
        dataSource: [
          { key: 'a', name: 'Alpha' },
          { key: 'b', name: 'Beta' },
        ],
        pagination: false,
        columns: [
          {
            dataIndex: 'name',
            render: (value, _record, index) => ({
              children: h('strong', String(value)),
              ...(index === 1 ? { props: { colSpan: 2 } } : {}),
            }),
          },
          {
            dataIndex: 'name',
            render: (value, _record, index) =>
              index === 1 ? { children: null, props: { colSpan: 0 } } : (value as string),
          },
        ],
      },
    });
    expect(wrapper.findAll('tbody > tr strong').map((node) => node.text())).toEqual([
      'Alpha',
      'Beta',
    ]);
    expect(wrapper.findAll('tbody > tr')[0]!.findAll('td')).toHaveLength(2);
    expect(wrapper.findAll('tbody > tr')[1]!.findAll('td')).toHaveLength(1);
    expect(wrapper.findAll('tbody > tr')[1]!.get('td').attributes('colspan')).toBe('2');
    wrapper.unmount();
  });
});
