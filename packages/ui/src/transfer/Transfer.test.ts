import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { ConfigProvider } from '../config-provider';
import Tree from '../tree/Tree.vue';
import Transfer from './Transfer.vue';
import type { TransferDataItem, TransferExposed, TransferLocale } from './types';

const items: TransferDataItem[] = [
  { key: 'a', label: 'Alpha', value: 'alpha' },
  { key: 'b', label: 'Beta', value: 'beta' },
  { key: 'c', label: 'Gamma', value: 'gamma', disabled: true },
];

describe('Transfer', () => {
  it('渲染固定 DOM/class/data/style/ARIA，并按 select -> change 顺序更新非受控值', async () => {
    const order: string[] = [];
    const wrapper = mount(Transfer, {
      attrs: { class: 'attr-transfer', 'data-kind': 'members' },
      props: {
        className: 'named-transfer',
        dataSource: items,
        defaultValue: ['alpha'],
        style: { width: '560px' },
        onSelect: () => order.push('select'),
        onChange: () => order.push('change'),
      },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-transfer', 'attr-transfer', 'named-transfer']),
    );
    expect(wrapper.attributes('data-kind')).toBe('members');
    expect((wrapper.element as HTMLElement).style.width).toBe('560px');
    expect(wrapper.get('[role="search"]').attributes('aria-label')).toBe('Transfer filter');
    expect(wrapper.get('[aria-label="Option list"]').attributes('role')).toBe('list');
    expect(wrapper.get('[aria-label="Selected list"]').attributes('role')).toBe('list');
    expect(wrapper.findAll('.semi-transfer-right-item')).toHaveLength(1);
    expect(wrapper.get('.semi-transfer-right-item').text()).toContain('Alpha');

    await wrapper.findAll('.semi-transfer-left-list .semi-checkbox')[1]!.trigger('click');
    expect(order).toEqual(['select', 'change']);
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual(['alpha', 'beta']);
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['alpha', 'beta']);
    expect(wrapper.findAll('.semi-transfer-right-item')).toHaveLength(2);

    await wrapper.findAll('.semi-transfer-left-list .semi-checkbox')[1]!.trigger('click');
    expect(order).toEqual(['select', 'change', 'change']);
    expect(wrapper.emitted('deselect')).toHaveLength(1);
  });

  it('value/modelValue 显式出现时受控，只发事件并等待父级提交', async () => {
    const wrapper = mount(Transfer, { props: { dataSource: items, value: ['alpha'] } });
    await wrapper.findAll('.semi-transfer-left-list .semi-checkbox')[1]!.trigger('click');
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual(['alpha', 'beta']);
    expect(wrapper.findAll('.semi-transfer-right-item')).toHaveLength(1);

    await wrapper.setProps({ value: ['alpha', 'beta'] });
    expect(wrapper.findAll('.semi-transfer-right-item')).toHaveLength(2);

    const model = mount(Transfer, { props: { dataSource: items, modelValue: [] } });
    await model.find('.semi-transfer-left-list .semi-checkbox').trigger('click');
    expect(model.emitted('update:modelValue')?.[0]?.[0]).toEqual(['alpha']);
    expect(model.findAll('.semi-transfer-right-item')).toHaveLength(0);
  });

  it('输入搜索通知并重置分页，暴露 search 不通知，数据更新会重算结果', async () => {
    const onSearch = vi.fn();
    const onPageChange = vi.fn();
    const wrapper = mount(Transfer, {
      props: {
        dataSource: Array.from({ length: 12 }, (_, index) => ({
          key: index,
          label: `Item ${index}`,
          value: index,
        })),
        pagination: { defaultCurrentPage: 2, pageSize: 5, onPageChange },
        onSearch,
      },
    });
    expect(wrapper.get('.semi-transfer-left-list').text()).toContain('Item 5');

    await wrapper.get('.semi-transfer-filter input').setValue('Item 1');
    expect(onSearch).toHaveBeenLastCalledWith('Item 1');
    expect(wrapper.get('.semi-transfer-left-list').text()).toContain('Item 1');
    expect(wrapper.get('.semi-transfer-left-list').text()).not.toContain('Item 5');

    (wrapper.vm as unknown as TransferExposed).search('Fresh');
    await nextTick();
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(wrapper.get('.semi-transfer-filter input').attributes('value')).toBe('Fresh');
    await wrapper.setProps({
      dataSource: [{ key: 'fresh', label: 'Fresh result', value: 'fresh' }],
    });
    expect(wrapper.text()).toContain('Fresh result');
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('filter=false 隐藏搜索；全选当前结果，清空时保留 disabled 已选项', async () => {
    const hidden = mount(Transfer, { props: { dataSource: items, filter: false } });
    expect(hidden.find('.semi-transfer-filter').exists()).toBe(false);

    const wrapper = mount(Transfer, {
      props: { dataSource: items, defaultValue: ['gamma'] },
    });
    await wrapper.findAll('.semi-transfer-header-all')[0]!.trigger('click');
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual(['gamma', 'alpha', 'beta']);
    expect(wrapper.findAll('.semi-transfer-right-item')).toHaveLength(3);
    await wrapper.findAll('.semi-transfer-header-all')[1]!.trigger('click');
    expect(wrapper.emitted('change')?.[1]?.[0]).toEqual(['gamma']);
    expect(wrapper.findAll('.semi-transfer-right-item')).toHaveLength(1);
    expect(wrapper.text()).toContain('Gamma');
  });

  it('groupList 保持组顺序，pagination 支持受控页码', async () => {
    const onPageChange = vi.fn();
    const wrapper = mount(Transfer, {
      props: {
        type: 'groupList',
        dataSource: [
          { title: 'Group A', children: items.slice(0, 2) },
          { title: 'Group B', children: items.slice(2) },
        ],
        pagination: { currentPage: 1, pageSize: 2, onPageChange },
      },
    });
    expect(wrapper.findAll('.semi-transfer-group-title').map((node) => node.text())).toEqual([
      'Group A',
    ]);
    wrapper.findComponent({ name: 'Pagination' }).vm.$emit('pageChange', 2);
    await nextTick();
    expect(onPageChange).toHaveBeenCalledWith(2);
    await wrapper.setProps({ pagination: { currentPage: 2, pageSize: 2, onPageChange } });
    expect(wrapper.get('.semi-transfer-group-title').text()).toBe('Group B');
  });

  it('treeList 复用 Tree、仅选叶子，并为展示与回调提供克隆 fullPath', async () => {
    const treeData = [
      {
        key: 'asia',
        label: 'Asia',
        value: 'Asia',
        children: [{ key: 'shanghai', label: 'Shanghai', value: 'Shanghai' }],
      },
    ];
    const wrapper = mount(Transfer, {
      props: { dataSource: treeData, defaultValue: ['Shanghai'], showPath: true, type: 'treeList' },
    });
    expect(wrapper.findComponent(Tree).exists()).toBe(true);
    expect(wrapper.text()).toContain('Asia > Shanghai');
    wrapper.findComponent(Tree).vm.$emit('change', []);
    await nextTick();
    const itemsArg = wrapper.emitted('change')?.[0]?.[1] as TransferDataItem[];
    expect(itemsArg).toEqual([]);
    wrapper.findComponent(Tree).vm.$emit('change', ['Shanghai']);
    await nextTick();
    const selected = wrapper.emitted('change')?.[1]?.[1] as TransferDataItem[];
    expect(selected[0]?.fullPath?.map((entry) => entry.value)).toEqual(['Asia', 'Shanghai']);
    expect(treeData[0]).not.toHaveProperty('path');
  });

  it('函数 render 与 scoped slots 均获得公开 actions，自定义双面板应用 class', async () => {
    const renderSourcePanel = vi.fn((panel) =>
      h('button', { class: 'render-source', onClick: panel.onAllClick }, 'source'),
    );
    const renderSelectedPanel = vi.fn((panel) =>
      h('button', { class: 'render-selected', onClick: panel.onClear }, 'selected'),
    );
    const rendered = mount(Transfer, {
      props: { dataSource: items, renderSelectedPanel, renderSourcePanel },
    });
    expect(rendered.classes()).toContain('semi-transfer-custom-panel');
    expect(rendered.find('.render-source').exists()).toBe(true);
    expect(rendered.find('.render-selected').exists()).toBe(true);
    expect(renderSourcePanel.mock.calls[0]?.[0].filterData).toHaveLength(3);

    const slotted = mount(Transfer, {
      props: { dataSource: items, defaultValue: ['alpha'] },
      slots: {
        sourceItem: ({ label, checked, onChange }) =>
          h('button', { class: 'slot-source', onClick: onChange }, `${String(label)}:${checked}`),
        selectedItem: ({ label, onRemove }) =>
          h('button', { class: 'slot-selected', onClick: onRemove }, String(label)),
      },
    });
    await slotted.findAll('.slot-source')[1]!.trigger('click');
    expect(slotted.findAll('.slot-selected')).toHaveLength(2);
    await slotted.findAll('.slot-selected')[0]!.trigger('click');
    expect(slotted.findAll('.slot-selected')).toHaveLength(1);
  });

  it('draggable 通过 handle 重排并发送最终顺序，virtualize 保留 list/listitem 语义', async () => {
    const draggable = mount(Transfer, {
      props: { dataSource: items, defaultValue: ['alpha', 'beta'], draggable: true },
    });
    const handles = draggable.findAll('.semi-transfer-right-item-drag-handler');
    await handles[0]!.trigger('dragstart', {
      dataTransfer: { effectAllowed: '', setData: vi.fn() },
    });
    await draggable.findAll('.semi-transfer-right-item')[1]!.trigger('drop');
    expect(draggable.emitted('change')?.[0]?.[0]).toEqual(['beta', 'alpha']);
    expect(draggable.findAll('.semi-transfer-right-item').map((node) => node.text())).toEqual([
      'Beta',
      'Alpha',
    ]);

    const virtual = mount(Transfer, {
      props: {
        dataSource: Array.from({ length: 30 }, (_, index) => ({
          key: index,
          label: `Virtual ${index}`,
          value: index,
        })),
        defaultValue: Array.from({ length: 30 }, (_, index) => index),
        virtualize: { height: 72, itemSize: 36 },
      },
    });
    const list = virtual.get('.semi-transfer-right-virtual-list');
    expect(list.attributes('role')).toBe('list');
    expect(list.findAll('[role="listitem"]').length).toBeGreaterThan(0);
    expect(list.findAll('[role="listitem"]').length).toBeLessThan(30);
    (list.element as HTMLElement).scrollTop = 720;
    await list.trigger('scroll');
    expect(list.text()).toContain('Virtual 20');
  });

  it('ConfigProvider locale 与 RTL、disabled/loading/empty slot 保持公开契约', () => {
    const english: TransferLocale = {
      emptyLeft: 'Nothing left',
      emptySearch: 'Nothing found',
      emptyRight: 'Nothing selected',
      placeholder: 'Find',
      clear: 'Remove all',
      selectAll: 'Choose all',
      clearSelectAll: 'Choose none',
      total: 'Count ${total}',
      selected: 'Chosen ${total}',
    };
    const Host = defineComponent({
      setup: () => () =>
        h(ConfigProvider, { direction: 'rtl', locale: { code: 'en-US', Transfer: english } }, () =>
          h(Transfer, { dataSource: [], disabled: true }),
        ),
    });
    const wrapper = mount(Host);
    expect(wrapper.find('.semi-rtl').exists()).toBe(true);
    expect(wrapper.get('.semi-transfer').classes()).toContain('semi-transfer-disabled');
    expect(wrapper.get('input').attributes('placeholder')).toBe('Find');
    expect(wrapper.text()).toContain('Nothing left');

    const loading = mount(Transfer, {
      props: { dataSource: items, loading: true },
      slots: { emptyRight: () => h('strong', 'Custom right') },
    });
    expect(loading.findComponent({ name: 'Spin' }).exists()).toBe(true);
    expect(loading.text()).toContain('Custom right');
  });
});
