import { flushPromises, mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, it, rs } from '@rstest/core';

import { Table, TableColumn, type TableColumnProps, type TableVirtualizedListRef } from './index';

const dataSource = [
  { key: 'a', name: 'Alpha', rank: 2 },
  { key: 'b', name: 'Beta', rank: 1 },
];
const columns: TableColumnProps[] = [
  {
    dataIndex: 'name',
    title: 'Name',
    width: 120,
    sorter: (a, b) => Number(a.rank) - Number(b.rank),
  },
];

afterEach(() => {
  document.body.innerHTML = '';
  rs.restoreAllMocks();
});

describe('Table resizable mode boundary', () => {
  it('recreates on false → true → false and retains the instance for true → object', async () => {
    const onSelectChange = rs.fn();
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        pagination: false,
        rowSelection: true,
        resizable: false,
        onSelectChange,
      },
    });
    const original = wrapper.get('.semi-table-wrapper').element;
    const exposed = wrapper.vm;
    await wrapper.get('[data-row-key="a"] .semi-checkbox').trigger('click');
    expect(onSelectChange).toHaveBeenCalledTimes(1);
    await wrapper.setProps({ rowSelection: false });
    expect(wrapper.get('[data-row-key="a"]').classes()).toContain('semi-table-row-selected');
    await wrapper.setProps({ resizable: true });
    const resizableRoot = wrapper.get('.semi-table-wrapper').element;
    expect(resizableRoot).not.toBe(original);
    expect(wrapper.find('.semi-table-row-selected').exists()).toBe(false);
    expect(wrapper.vm).toBe(exposed);

    await wrapper.setProps({ rowSelection: true });
    await wrapper.get('[data-row-key="b"] .semi-checkbox').trigger('click');
    await wrapper.setProps({ resizable: { handlerClassName: 'dragging' } });
    expect(wrapper.get('.semi-table-wrapper').element).toBe(resizableRoot);
    expect(wrapper.get('[data-row-key="b"]').classes()).toContain('semi-table-row-selected');
    await wrapper.setProps({ resizable: false });
    expect(wrapper.get('.semi-table-wrapper').element).not.toBe(resizableRoot);
    expect(wrapper.find('.semi-table-row-selected').exists()).toBe(false);
    expect(onSelectChange).toHaveBeenCalledTimes(2);
    expect(wrapper.emitted('selectChange')).toHaveLength(2);
    wrapper.unmount();
  });

  it('reinitializes uncontrolled query, selection, expansion and pagination from current defaults', async () => {
    const rows = Array.from({ length: 12 }, (_, key) => ({
      key: String(key),
      name: `Row ${key}`,
      rank: key,
      group: key < 10 ? 'keep' : 'other',
    }));
    const onChange = rs.fn();
    const defaultColumns: TableColumnProps[] = [
      {
        dataIndex: 'name',
        title: 'Name',
        width: 120,
        sorter: (a, b) => Number(a.rank) - Number(b.rank),
        defaultSortOrder: 'descend',
        defaultFilteredValue: ['keep'],
        filters: [{ text: 'Keep', value: 'keep' }],
        onFilter: (value, row) => row?.group === value,
        filterDropdownVisible: true,
        renderFilterDropdown: (controls) =>
          h(
            'button',
            {
              onClick: () => (controls!.clear as () => void)(),
            },
            'Clear',
          ),
      },
    ];
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        columns: defaultColumns,
        dataSource: rows,
        pagination: { pageSize: 2 },
        rowSelection: { defaultSelectedRowKeys: ['8'] },
        defaultExpandedRowKeys: ['9'],
        expandedRowRender: (record) => h('p', { class: 'expanded-content' }, String(record?.key)),
        onChange,
      },
    });
    await flushPromises();
    expect(wrapper.vm.getCurrentPageData().map((row) => row.key)).toEqual(['9', '8']);
    expect(wrapper.get('.expanded-content').text()).toBe('9');
    await wrapper.get('[data-row-key="9"] .semi-table-expand-icon').trigger('click');
    await wrapper.get('[data-row-key="8"] .semi-checkbox').trigger('click');
    await wrapper.get('[data-row-key="9"] .semi-checkbox').trigger('click');
    await wrapper.get('.semi-table-column-sorter-wrapper').trigger('click');
    document.querySelector<HTMLButtonElement>('.semi-table-column-filter-dropdown button')!.click();
    await flushPromises();
    await wrapper.get('.semi-page-next').trigger('click');
    expect(wrapper.vm.getCurrentPageData().map((row) => row.key)).toEqual(['2', '3']);
    const notifications = onChange.mock.calls.length;

    await wrapper.setProps({ resizable: true });
    await flushPromises();
    expect(wrapper.vm.getCurrentPageData().map((row) => row.key)).toEqual(['9', '8']);
    expect(wrapper.get('[data-row-key="8"]').classes()).toContain('semi-table-row-selected');
    expect(wrapper.get('[data-row-key="9"]').classes()).not.toContain('semi-table-row-selected');
    expect(wrapper.get('.expanded-content').text()).toBe('9');
    expect(wrapper.get('.semi-table-column-sorter-wrapper').attributes('aria-label')).toBe(
      'Current sort order is descending',
    );
    expect(onChange).toHaveBeenCalledTimes(notifications);
    expect(document.querySelectorAll('.semi-table-column-filter-dropdown')).toHaveLength(1);
    wrapper.unmount();
  });

  it('preserves controlled state through both mode transitions without extra change events', async () => {
    const onChange = rs.fn();
    const wrapper = mount(Table, {
      props: {
        columns: [
          { ...columns[0]!, sortOrder: 'ascend', filteredValue: ['all'], onFilter: () => true },
        ],
        dataSource,
        pagination: { currentPage: 2, pageSize: 2, total: 20 },
        rowSelection: { selectedRowKeys: ['a'] },
        expandedRowKeys: ['b'],
        expandedRowRender: (record) => h('p', { class: 'expanded-content' }, String(record?.key)),
        onChange,
      },
    });
    for (const resizable of [true, false]) {
      await wrapper.setProps({ resizable });
      expect(wrapper.vm.getCurrentPageData().map((row) => row.key)).toEqual(['b', 'a']);
      expect(wrapper.get('[data-row-key="a"]').classes()).toContain('semi-table-row-selected');
      expect(wrapper.get('.expanded-content').text()).toBe('b');
      expect(wrapper.get('.semi-page-item-active').text()).toBe('2');
    }
    expect(onChange).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('forwards raw Boolean presence, attributes, slots and each event once while retaining the public ref', async () => {
    const onChange = rs.fn();
    const onChangeOnce = rs.fn();
    const onVnodeMounted = rs.fn();
    const wrapper = mount(Table, {
      attrs: {
        'data-probe': 'public',
        class: 'caller-table',
        style: { color: 'red' },
        onChangeOnce,
        onVnodeMounted,
      },
      props: { dataSource, pagination: false, onChange },
      slots: {
        default: () => h(Table.Column, columns[0]!),
        title: ({ pageData }) => h('p', { class: 'slot-title' }, `Count ${pageData.length}`),
        cell: ({ text }) => h('strong', { class: 'slot-cell' }, String(text)),
        footer: ({ pageData }) => h('p', { class: 'slot-footer' }, String(pageData.length)),
        expandedRow: ({ record }) => h('small', { class: 'slot-expanded' }, String(record.name)),
        empty: () => h('span', { class: 'slot-empty' }, 'Nothing'),
      },
    });
    const exposed = wrapper.vm;
    expect(Table.Column).toBe(TableColumn);
    expect(Table.DEFAULT_KEY_COLUMN_SELECTION).toBeDefined();
    expect(Table.DEFAULT_KEY_COLUMN_EXPAND).toBeDefined();
    expect(wrapper.find('thead').exists()).toBe(true);
    expect(wrapper.find('.semi-table-expand-icon').exists()).toBe(true);
    expect(wrapper.findAll('.semi-table-column-expand')).toHaveLength(0);
    expect(wrapper.get('.slot-title').text()).toBe('Count 2');
    expect(wrapper.get('.slot-cell').text()).toBe('Alpha');
    await wrapper.get('[data-row-key="a"] .semi-table-expand-icon').trigger('click');
    expect(wrapper.get('.slot-expanded').text()).toBe('Alpha');
    await wrapper.get('th.semi-table-row-head-clickSort').trigger('click');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChangeOnce).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ resizable: true });
    expect(wrapper.vm).toBe(exposed);
    expect(wrapper.get('.semi-table-wrapper').attributes('data-probe')).toBe('public');
    expect(wrapper.get('.semi-table-wrapper').classes()).toContain('caller-table');
    expect((wrapper.get('.semi-table-wrapper').element as HTMLElement).style.color).toBe('red');
    expect(wrapper.get('.slot-footer').text()).toBe('2');
    await wrapper.get('th.semi-table-row-head-clickSort').trigger('click');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChangeOnce).toHaveBeenCalledTimes(1);
    expect(onVnodeMounted).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted('change')).toHaveLength(2);

    await wrapper.setProps({ resizable: false, showHeader: false, expandIcon: false });
    expect(wrapper.find('thead').exists()).toBe(false);
    expect(wrapper.find('.semi-table-expand-icon').exists()).toBe(false);
    await wrapper.setProps({ dataSource: [], resizable: true });
    expect(wrapper.get('.slot-empty').text()).toBe('Nothing');
    expect(exposed.getCurrentPageData()).toEqual([]);
    wrapper.unmount();
  });

  it.each([false, true])(
    'forwards expansion events once for grouped=%s before and after recreation',
    async (grouped) => {
      const onExpand = rs.fn();
      const onExpandedRowsChange = rs.fn();
      const wrapper = mount(Table, {
        props: {
          columns,
          dataSource,
          pagination: false,
          onExpand,
          onExpandedRowsChange,
          ...(grouped
            ? {
                groupBy: 'name',
                defaultExpandAllGroupRows: true,
                renderGroupSection: (key?: string | number) => String(key),
              }
            : {
                expandedRowRender: (record?: Record<string, unknown>) =>
                  h('p', String(record?.name)),
              }),
        },
      });
      for (const resizable of [false, true]) {
        await wrapper.setProps({ resizable });
        const before = onExpand.mock.calls.length;
        await wrapper.get('.semi-table-expand-icon').trigger('click');
        expect(onExpand).toHaveBeenCalledTimes(before + 1);
        expect(onExpandedRowsChange).toHaveBeenCalledTimes(before + 1);
      }
      expect(wrapper.emitted('expand')).toHaveLength(2);
      expect(wrapper.emitted('expandedRowsChange')).toHaveLength(2);
      wrapper.unmount();
    },
  );

  it('replaces virtual refs and scroll state, and ignores requests through the disposed ref', async () => {
    const refs: Array<TableVirtualizedListRef | null> = [];
    const onScroll = rs.fn();
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name', width: 400 }],
        dataSource: Array.from({ length: 1000 }, (_, key) => ({
          key: String(key),
          name: `Row ${key}`,
        })),
        pagination: false,
        virtualized: { onScroll },
        scroll: { x: 400, y: 400 },
        getVirtualizedListRef: ({ current }) => refs.push(current),
      },
    });
    await nextTick();
    const original = refs[0]!;
    original.scrollToItem(100);
    await nextTick();
    expect(wrapper.find('[data-row-key="100"]').exists()).toBe(true);
    const body = wrapper.get('.semi-table-body').element;
    await wrapper.setProps({ resizable: true });
    await nextTick();
    expect(refs).toHaveLength(3);
    expect(refs[1]).toBeNull();
    expect(refs[2]).not.toBe(original);
    expect(wrapper.get('.semi-table-body').element).not.toBe(body);
    expect(wrapper.find('[data-row-key="0"]').exists()).toBe(true);
    const notifications = onScroll.mock.calls.length;
    original.scrollToItem(800);
    await nextTick();
    expect(onScroll).toHaveBeenCalledTimes(notifications);
    expect(wrapper.find('[data-row-key="800"]').exists()).toBe(false);
    await wrapper.setProps({ resizable: {} });
    expect(refs).toHaveLength(3);
    wrapper.unmount();
    expect(refs.at(-1)).toBeNull();
  });

  it('discards resized widths and active drag listeners when leaving the mode', async () => {
    const onResize = rs.fn(() => ({ title: 'Resized', className: 'resize-feedback' }));
    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: false, resizable: { onResize } },
    });
    await wrapper
      .get('.react-resizable-handle')
      .trigger('pointerdown', { clientX: 100, button: 0 });
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 140 }));
    await nextTick();
    expect(wrapper.get('th').text()).toBe('Resized');
    expect(wrapper.get('col').attributes('style')).toContain('160px');
    await wrapper.setProps({ resizable: false });
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 180 }));
    await nextTick();
    expect(onResize).toHaveBeenCalledTimes(1);
    expect(wrapper.get('th').text()).toBe('Name');
    expect(wrapper.get('col').attributes('style')).toContain('120px');
    await wrapper.setProps({ resizable: true });
    expect(wrapper.get('th').classes()).not.toContain('resize-feedback');
    expect(wrapper.get('col').attributes('style')).toContain('120px');
    wrapper.unmount();
  });
});
