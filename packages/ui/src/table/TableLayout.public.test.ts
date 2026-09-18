import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';
import { Table, type TableColumnProps } from './index';

describe('Table 布局公开契约', () => {
  it('动态固定选择与展开列保留自动表格布局，声明列和固定表头决定固定布局', async () => {
    const columns: TableColumnProps[] = [{ title: 'Name', dataIndex: 'name' }];
    const wrapper = mount(Table, {
      props: { columns, dataSource: [{ key: 'a', name: 'Alpha' }], pagination: false },
    });
    const bodyTable = () => wrapper.find('.semi-table-body > table');
    expect(bodyTable().classes()).not.toContain('semi-table-fixed');
    await wrapper.setProps({ rowSelection: { fixed: true, width: 48 } });
    await wrapper.find('tbody .semi-checkbox').trigger('click');
    expect(wrapper.find('tbody input').element).toHaveProperty('checked', true);
    expect(wrapper.find('tbody .semi-table-cell-fixed-left').exists()).toBe(true);
    expect(bodyTable().classes()).not.toContain('semi-table-fixed');
    expect((bodyTable().element as HTMLElement).style.tableLayout).toBe('');

    await wrapper.setProps({
      hideExpandedColumn: false,
      expandCellFixed: true,
      expandedRowRender: () => h('p', 'Detail'),
    });
    await wrapper.find('tbody .semi-table-expand-icon').trigger('click');
    expect(wrapper.find('.semi-table-row-expand').text()).toBe('Detail');
    expect(bodyTable().classes()).not.toContain('semi-table-fixed');

    await wrapper.setProps({ columns: [{ ...columns[0], fixed: true }] });
    expect(bodyTable().classes()).toContain('semi-table-fixed');
    await wrapper.setProps({ columns });
    expect(bodyTable().classes()).not.toContain('semi-table-fixed');
    await wrapper.setProps({ scroll: { y: 300 } });
    expect(wrapper.find('.semi-table-header > table').classes()).toContain('semi-table-fixed');
    expect(bodyTable().classes()).toContain('semi-table-fixed');
    await wrapper.setProps({ scroll: {} });
    expect(bodyTable().classes()).not.toContain('semi-table-fixed');
    await wrapper.setProps({ columns: [{ ...columns[0], ellipsis: true }] });
    expect(bodyTable().classes()).toContain('semi-table-fixed');
    wrapper.unmount();
  });
});
