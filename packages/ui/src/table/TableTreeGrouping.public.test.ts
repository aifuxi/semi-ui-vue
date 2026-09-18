import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { Table } from './index';

describe('Table 树形和分组公开契约', () => {
  it('整份数据分组后分页，组标题回调接收当前页的键，折叠重开不改变分页成员', async () => {
    const renderGroupSection = vi.fn((key, keys) => h('strong', `${key}: ${keys.join(',')}`));
    const onExpand = vi.fn();
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: Array.from({ length: 46 }, (_, index) => ({
          key: String(index),
          name: `File ${index}`,
          size: ((index * 1000) % 19) + 100,
        })),
        groupBy: 'size',
        defaultExpandAllGroupRows: true,
        renderGroupSection,
        onExpand,
      },
    });
    const keys = () =>
      wrapper.findAll('tbody > .semi-table-row').map((row) => row.attributes('data-row-key'));
    expect(keys()).toEqual(['0', '19', '38', '1', '20', '39', '2', '21', '40', '3']);
    expect(wrapper.findAll('.semi-table-row-section').length).toBe(4);
    expect(renderGroupSection).toHaveBeenCalledWith(100, ['0', '19', '38']);
    const firstGroup = wrapper.get('.semi-table-row-section');
    expect(firstGroup.classes()).toEqual(['semi-table-row-section', 'on']);
    expect(firstGroup.attributes()).toMatchObject({
      'data-row-key': '100',
      'aria-rowindex': '1',
      'aria-level': '1',
      'aria-expanded': 'true',
    });
    expect(firstGroup.get('td').attributes('aria-colindex')).toBe('1');
    const sectionInner = firstGroup.get('td > .semi-table-section-inner');
    expect(sectionInner.get('strong').text()).toBe('100: 0,19,38');
    expect(sectionInner.find('.semi-table-expand-icon').exists()).toBe(true);
    expect(wrapper.find('tbody > .semi-table-row .semi-table-section-inner').exists()).toBe(false);
    expect(firstGroup.find('.semi-icon-chevron_right.semi-icon-default').exists()).toBe(true);
    await firstGroup.get('.semi-table-expand-icon').trigger('click');
    expect(onExpand.mock.calls[0]?.slice(0, 2)).toEqual([false, { groupKey: 100 }]);
    expect(keys()).toEqual(['1', '20', '39', '2', '21', '40', '3']);
    await firstGroup.get('.semi-table-expand-icon').trigger('click');
    expect(keys()).toEqual(['0', '19', '38', '1', '20', '39', '2', '21', '40', '3']);
    await wrapper.get('.semi-page-next').trigger('click');
    expect(keys()).toEqual(['22', '41', '4', '23', '42', '5', '24', '43', '6', '25']);
    expect(renderGroupSection).toHaveBeenCalledWith(117, ['22', '41']);
    expect(
      wrapper
        .findAll('tbody > .semi-table-row')
        .slice(0, 3)
        .map((row) => row.attributes('aria-rowindex')),
    ).toEqual(['1', '2', '1']);
    wrapper.unmount();
  });

  it('每一层树数据使用同级索引，叶子保留图标占位并沿用同级索引后备键', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        pagination: false,
        defaultExpandAllRows: true,
        dataSource: [
          {
            key: 'a',
            name: 'A',
            children: [
              { key: 'a1', name: 'A1' },
              { key: 'a2', name: 'A2', children: [{ name: 'A21' }] },
            ],
          },
          { key: 'b', name: 'B', children: [{ key: 'b1', name: 'B1' }] },
        ],
      },
    });
    const rows = wrapper.findAll('tbody > tr');
    expect(rows.map((row) => row.attributes('aria-rowindex'))).toEqual([
      '1',
      '1',
      '2',
      '1',
      '2',
      '1',
    ]);
    expect(rows[3]?.attributes('data-row-key')).toBe('0');
    expect(rows[1]!.get('.semi-table-row-indent').classes()).toContain('indent-level-2');
    expect(rows[2]!.get('.semi-table-row-indent').classes()).toContain('indent-level-1');
    expect(rows[3]!.get('.semi-table-row-indent').classes()).toContain('indent-level-3');
    await wrapper.setProps({ expandIcon: false });
    expect(wrapper.findAll('.semi-table-expand-icon')).toHaveLength(0);
    expect(wrapper.findAll('tbody > tr')[1]!.get('.semi-table-row-indent').classes()).toContain(
      'indent-level-1',
    );
    expect(wrapper.findAll('tbody > tr')[3]!.get('.semi-table-row-indent').classes()).toContain(
      'indent-level-2',
    );
    wrapper.unmount();
  });
});
