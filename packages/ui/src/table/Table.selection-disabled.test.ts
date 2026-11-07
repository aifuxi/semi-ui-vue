import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { Table } from './index';

/** 固定 Semi 将全选禁用、逐行禁用和行点击选择分开处理。 */
describe('Table 选择禁用边界', () => {
  /** 视觉 review 发现全局 disabled 误把所有行 Checkbox 置灰，此例同时保护真实选择行为。 */
  it('全选禁用保留行 Checkbox 的逐行配置与半选状态，并禁止 clickRow', async () => {
    /** 三行覆盖已选、逐行禁用和未选，确保表头应保留半选。 */
    const data = [
      { key: 'a', name: 'Alpha' },
      { key: 'b', name: 'Beta' },
      { key: 'c', name: 'Gamma' },
    ];
    /** 直接观察组件公开选择回调，不读取组件内部状态。 */
    const onChange = vi.fn();
    /** 行点击禁用但 Checkbox 仍可单独选择，和固定 Table.renderSelection 一致。 */
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name', key: 'name', title: 'Name' }],
        dataSource: data,
        pagination: false,
        rowSelection: {
          selectedRowKeys: ['a'],
          disabled: true,
          clickRow: true,
          /** Beta 的禁用属于逐行公开配置，不能被全选开关替代。 */
          getCheckboxProps: (record) => ({ disabled: record.key === 'b' }),
          onChange,
        },
      },
    });
    /** 表头禁用仍显示 a 已选、c 未选产生的半选状态。 */
    const header = wrapper.get('thead .semi-checkbox');
    expect(header.classes()).toContain('semi-checkbox-disabled');
    expect(header.classes()).toContain('semi-checkbox-indeterminate');
    /** 行控件由各自 getCheckboxProps 决定，不继承表头禁用。 */
    const inputs = wrapper.findAll('tbody input[type="checkbox"]');
    expect(
      inputs.map(
        /** 浏览器 disabled 属性是最终可交互状态，不由 CSS 类推断。 */
        (input) => (input.element as HTMLInputElement).disabled,
      ),
    ).toEqual([false, true, false]);
    await wrapper.get('tbody tr[data-row-key="c"]').trigger('click');
    expect(onChange).not.toHaveBeenCalled();
    await wrapper.get('tbody tr[data-row-key="c"] .semi-checkbox').trigger('click');
    expect(onChange).toHaveBeenLastCalledWith(['a', 'c'], [data[0], data[2]]);
    wrapper.unmount();
  });
});
