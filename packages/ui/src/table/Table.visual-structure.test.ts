import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';
import { Table } from './index';

/** 实际视觉 review 发现的结构分支回归，预期均取自固定 Table/SectionRow。 */
describe('Table 可见结构边界', () => {
  /** 虚拟外框使用 scroll.x，只有数值 style.width 能覆盖固定基线的选择规则。 */
  it('虚拟表格宽度遵守 scroll.x 与显式数值 style.width 的优先级', async () => {
    /** 一行即可验证外框规则，滚动上下部的视觉由浏览器场景覆盖。 */
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', width: 200 }],
        dataSource: [{ key: 'one', name: 'First' }],
        pagination: false,
        virtualized: { itemSize: 45 },
        scroll: { x: 560, y: 240 },
      },
    });
    expect((wrapper.get('.semi-table-wrapper').element as HTMLElement).style.width).toBe('560px');
    await wrapper.setProps({ style: { width: 700 } });
    expect((wrapper.get('.semi-table-wrapper').element as HTMLElement).style.width).toBe('700px');
    await wrapper.setProps({ style: { width: '80%' } });
    expect((wrapper.get('.semi-table-wrapper').element as HTMLElement).style.width).toBe('560px');
    await wrapper.setProps({ virtualized: false });
    expect((wrapper.get('.semi-table-wrapper').element as HTMLElement).style.width).toBe('80%');
    wrapper.unmount();
  });

  /** 固定 SectionRow 只识别元素与 children 对象；缺省或原始文本都不作为组标题。 */
  it('分组标题忽略缺省与原始文本，保留节点和 children 对象', async () => {
    /** 同一组在不同公开回调下重渲染，避免将 Vue 现状当基线。 */
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: [{ key: 'one', name: 'First', owner: 'Team' }],
        groupBy: 'owner',
        defaultExpandAllGroupRows: true,
        pagination: false,
      },
    });
    expect(wrapper.get('.semi-table-section-inner').text()).toBe('');
    /** 上游原始文本返回值不会被 SectionRow 当作 React 元素。 */
    await wrapper.setProps({ renderGroupSection: () => 'ignored title' });
    expect(wrapper.get('.semi-table-section-inner').text()).toBe('');
    /** Vue 元素是 React 元素公开行为的原生映射。 */
    await wrapper.setProps({ renderGroupSection: () => h('strong', 'Node title') });
    expect(wrapper.get('.semi-table-section-inner strong').text()).toBe('Node title');
    /** 对象返回值公开的 children 仍然显示。 */
    await wrapper.setProps({ renderGroupSection: () => ({ children: 'Object title' }) });
    expect(wrapper.get('.semi-table-section-inner').text()).toBe('Object title');
    wrapper.unmount();
  });
});
