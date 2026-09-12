import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it } from '@rstest/core';

import { Table } from './index';
import TableDescriptionsExpansion from './test-fixtures/TableDescriptionsExpansion.vue';

describe('Table 公开展开列契约', () => {
  it('编译 SFC 展开 slot 卸载重挂后保留 data 中的 Tag VNode', async () => {
    const wrapper = mount(TableDescriptionsExpansion);
    await wrapper.get('tbody > tr').trigger('mouseenter');
    await wrapper.get('.semi-table-expand-icon').trigger('click');
    await wrapper.get('tbody > tr').trigger('mouseleave');
    expect(wrapper.get('.semi-tag').text()).toBe('Design');
    await wrapper.get('tbody > tr').trigger('mouseenter');
    await wrapper.get('.semi-table-expand-icon').trigger('click');
    expect(wrapper.find('.semi-descriptions').exists()).toBe(false);
    await wrapper.get('.semi-table-expand-icon').trigger('click');
    await wrapper.get('tbody > tr').trigger('mouseleave');
    expect(wrapper.get('.semi-tag').text()).toBe('Design');
    wrapper.unmount();
  });

  for (const hideExpandedColumn of [true, false]) {
    it(`${hideExpandedColumn ? '内嵌三角' : '独立箭头'}只渲染展开控件并支持折叠重开`, async () => {
      const wrapper = mount(Table, {
        props: {
          columns: [{ dataIndex: 'name', title: 'Name' }],
          dataSource: [{ key: 'a', name: 'Alpha' }],
          pagination: false,
          hideExpandedColumn,
          expandedRowRender: () => h('p', 'Expanded details'),
        },
      });
      const icon = wrapper.get('.semi-table-expand-icon .semi-icon');
      expect(icon.classes()).toContain(
        hideExpandedColumn ? 'semi-icon-tree_triangle_right' : 'semi-icon-chevron_right',
      );
      expect(icon.classes()).toContain(
        hideExpandedColumn ? 'semi-icon-small' : 'semi-icon-default',
      );
      expect(wrapper.get('tbody').text()).toBe('Alpha');
      if (!hideExpandedColumn) {
        expect(wrapper.get('tbody .semi-table-column-expand').text()).toBe('');
      }
      await wrapper.get('.semi-table-expand-icon').trigger('click');
      expect(wrapper.get('tbody > tr').attributes('aria-expanded')).toBe('true');
      const expanded = wrapper.get('.semi-table-row-expand');
      expect(expanded.attributes('data-row-key')).toBe('a-expanded-row');
      expect(expanded.attributes('aria-level')).toBe('2');
      expect(expanded.get('td').attributes('aria-colindex')).toBe('1');
      expect(expanded.get('td').attributes('colspan')).toBe(hideExpandedColumn ? '1' : '2');
      expect(expanded.get('.semi-table-expand-inner').text()).toBe('Expanded details');
      await wrapper.get('.semi-table-expand-icon').trigger('click');
      expect(wrapper.find('.semi-table-row-expand').exists()).toBe(false);
      await wrapper.get('.semi-table-expand-icon').trigger('click');
      expect(wrapper.get('.semi-table-expand-inner').text()).toBe('Expanded details');
      wrapper.unmount();
    });
  }
});
