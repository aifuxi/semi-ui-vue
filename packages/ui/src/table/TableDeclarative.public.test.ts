import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import TableDeclarativeColumns from './test-fixtures/TableDeclarativeColumns.vue';
import TableDeclarativeFullRender from './test-fixtures/TableDeclarativeFullRender.vue';

describe('Table 声明式列的 Vue 模板属性', () => {
  it('嵌套列支持 kebab-case 数据、排序与过滤，并区分裸 fixed、false 与缺省', async () => {
    const wrapper = mount(TableDeclarativeColumns);
    const rows = () =>
      wrapper.findAll('tbody > tr').map((row) => row.findAll('td').map((cell) => cell.text()));
    expect(rows()).toEqual([
      ['Beta', '1', 'Pending'],
      ['Alpha', '2', 'Ready'],
    ]);
    const headingRows = wrapper.findAll('thead > tr');
    expect(headingRows[0]!.findAll('th').map((heading) => heading.text())).toEqual([
      'Details',
      'State',
    ]);
    expect(headingRows[0]!.get('th').attributes('colspan')).toBe('2');
    expect(headingRows[0]!.findAll('th')[1]!.attributes('rowspan')).toBe('2');
    const cells = wrapper.findAll('tbody > tr')[0]!.findAll('td');
    expect(cells.map((cell) => cell.classes().includes('semi-table-cell-fixed-left'))).toEqual([
      true,
      false,
      false,
    ]);
    await wrapper.get('.semi-table-column-sorter-wrapper').trigger('click');
    expect(rows()[0]).toEqual(['Alpha', '2', 'Ready']);
    await wrapper.get('button').trigger('click');
    expect(rows()).toEqual([['Alpha', '2', 'Ready']]);
    await wrapper.get('button').trigger('click');
    expect(rows()).toHaveLength(2);
    wrapper.unmount();
  });

  it('裸 use-full-render 将可交互选择控件传入自定义头部与单元格', async () => {
    const wrapper = mount(TableDeclarativeFullRender);
    expect(
      wrapper.findAll('thead .custom-title > .semi-table-selection-wrap > .semi-checkbox'),
    ).toHaveLength(1);
    expect(
      wrapper.findAll('tbody .custom-cell > .semi-table-selection-wrap > .semi-checkbox'),
    ).toHaveLength(2);
    expect(wrapper.findAll('thead .custom-title input[type="checkbox"]')).toHaveLength(1);
    expect(wrapper.findAll('tbody .custom-cell input[type="checkbox"]')).toHaveLength(2);
    expect(wrapper.findAll('tbody .custom-cell').map((cell) => cell.text())).toEqual([
      'Alpha',
      'Beta',
    ]);
    await wrapper.get('thead .custom-title .semi-checkbox').trigger('click');
    expect(
      wrapper.findAll('tbody input').map((input) => (input.element as HTMLInputElement).checked),
    ).toEqual([true, true]);
    await wrapper.findAll('tbody .semi-checkbox')[0]!.trigger('click');
    expect(wrapper.get('thead .semi-checkbox').classes()).toContain('semi-checkbox-indeterminate');
    wrapper.unmount();
  });
});
