/* eslint-disable vue/one-component-per-file -- test hosts cover template Column syntax, controlled props, and custom render inputs. */
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, shallowRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ConfigProvider from '../config-provider/ConfigProvider.vue';
import LocaleProvider from '../locale/LocaleProvider.vue';
import enUS from '../locale/source/en_US';
import { Tag } from '../tag';
import DefaultTable, {
  DEFAULT_KEY_COLUMN_EXPAND,
  DEFAULT_KEY_COLUMN_SELECTION,
  Table,
  TableColumn,
  type TableColumnProps as TableColumnConfig,
} from './index';

const columns: TableColumnConfig[] = [
  { dataIndex: 'name', key: 'name', title: 'Name' },
  {
    dataIndex: 'score',
    key: 'score',
    sorter: (a, b) => Number(a.score) - Number(b.score),
    title: 'Score',
  },
];
const data = [
  { key: 'a', name: 'Alpha', score: 2 },
  { key: 'b', name: 'Beta', score: 1 },
];

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Table', () => {
  it('公开入口保持 default、named、复合 Column 与固定键常量一致', () => {
    expect(DefaultTable).toBe(Table);
    expect(Table.Column).toBe(TableColumn);
    expect(Table.DEFAULT_KEY_COLUMN_SELECTION).toBe(DEFAULT_KEY_COLUMN_SELECTION);
    expect(Table.DEFAULT_KEY_COLUMN_EXPAND).toBe(DEFAULT_KEY_COLUMN_EXPAND);
  });

  it('LocaleProvider 提供表格文案，跨页选择保留表头半选状态', async () => {
    const wrapper = mount(LocaleProvider, {
      props: { locale: enUS },
      slots: {
        default: () =>
          h(Table, { columns, dataSource: data, pagination: { pageSize: 1 }, rowSelection: {} }),
      },
    });
    expect(wrapper.text()).toContain('Showing 1 to 1 of 2');
    await wrapper.get('tbody .semi-checkbox').trigger('click');
    await wrapper.get('.semi-page-next').trigger('click');
    expect(wrapper.text()).toContain('Showing 2 to 2 of 2');
    expect(wrapper.get('thead .semi-checkbox').classes()).toContain('semi-checkbox-indeterminate');
    expect(wrapper.get('tbody input').element).toHaveProperty('checked', false);
    wrapper.unmount();
  });
  it('保留 onCell 对齐，显式列对齐覆盖 onCell，render 样式最终优先', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          {
            dataIndex: 'name',
            onCell: () => ({ style: { textAlign: 'right', justifyContent: 'flex-end' } }),
          },
          { dataIndex: 'name', align: 'center', onCell: () => ({ style: { textAlign: 'right' } }) },
          {
            dataIndex: 'name',
            align: 'center',
            render: (text) => ({
              children: String(text),
              props: { style: { textAlign: 'left', justifyContent: 'flex-start' } },
            }),
          },
        ],
        dataSource: [data[0]!],
        pagination: false,
      },
    });
    const cells = wrapper.findAll('tbody td').map((cell) => (cell.element as HTMLElement).style);
    expect(cells[0]!.textAlign).toBe('right');
    expect(cells[0]!.justifyContent).toBe('flex-end');
    expect(cells[1]!.textAlign).toBe('center');
    expect(cells[2]!.textAlign).toBe('left');
    expect(cells[2]!.justifyContent).toBe('flex-start');
    wrapper.unmount();
  });
  it('RTL 固定列镜像定位和边界类，align 同步文字与弹性布局', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'name', title: 'Name', fixed: 'left', width: 120, align: 'left' }],
        dataSource: data,
        pagination: false,
        direction: 'rtl',
        scroll: { x: 400 },
      },
    });
    const cell = wrapper.get('tbody td');
    expect(cell.classes()).toEqual(
      expect.arrayContaining(['semi-table-cell-fixed-right', 'semi-table-cell-fixed-right-first']),
    );
    expect((cell.element as HTMLElement).style.right).toBe('0px');
    expect((cell.element as HTMLElement).style.textAlign).toBe('right');
    expect((cell.element as HTMLElement).style.justifyContent).toBe('flex-end');
    wrapper.unmount();
  });
  it('选择框保留 name 并随行和全选状态更新可访问名称', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: { getCheckboxProps: (record) => ({ name: String(record.name) }) },
      },
    });
    expect(wrapper.get('tbody input').attributes()).toMatchObject({
      name: 'Alpha',
      'aria-label': 'Select this row',
    });
    await wrapper.get('thead .semi-checkbox').trigger('click');
    expect(wrapper.get('thead input').attributes('aria-label')).toBe('Deselect all rows');
    expect(wrapper.get('tbody input').attributes('aria-label')).toBe('Deselect this row');
    wrapper.unmount();
  });
  it('分组列计数保留顶层列数，展开父行层级不随展开切换，自定义title优先', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          {
            title: 'Group',
            children: [
              { dataIndex: 'name', title: 'Name', onCell: () => ({ title: 'Custom title' }) },
              { dataIndex: 'score', title: 'Score' },
            ],
          },
        ],
        dataSource: data,
        pagination: false,
        expandedRowRender: () => 'Details',
      },
    });
    expect(wrapper.find('table').attributes('aria-colcount')).toBe('1');
    expect(wrapper.find('tbody tr').attributes('aria-level')).toBe('1');
    expect(wrapper.find('tbody tr').attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('.semi-table-expand-icon').attributes('aria-expanded')).toBeUndefined();
    expect(wrapper.find('td').attributes('title')).toBe('Custom title');
    await wrapper.find('.semi-table-expand-icon').trigger('click');
    expect(wrapper.find('tbody tr').attributes('aria-level')).toBe('1');
    expect(wrapper.find('tbody tr').attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('.semi-table-row-expand').attributes('data-row-key')).toBe('a-expanded-row');
    expect(wrapper.get('.semi-table-row-expand td').attributes('aria-colindex')).toBe('1');
    wrapper.unmount();
  });
  it('普通表格输出行列计数及索引，title 使用最终字符串且不冒充树层级', () => {
    const wrapper = mount(Table, { props: { columns, dataSource: data, pagination: false } });
    expect(wrapper.find('table').attributes()).toMatchObject({
      'aria-rowcount': '2',
      'aria-colcount': '2',
    });
    expect(wrapper.find('thead tr').attributes('aria-rowindex')).toBe('1');
    expect(wrapper.find('th').attributes()).toMatchObject({ 'aria-colindex': '1', title: 'Name' });
    expect(wrapper.find('tbody tr').attributes('aria-level')).toBeUndefined();
    expect(wrapper.find('td').attributes()).toMatchObject({ 'aria-colindex': '1', title: 'Alpha' });
    wrapper.unmount();
  });
  it('sorter 接收实际方向，可在升降序都将空值保留在末尾', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          {
            dataIndex: 'score',
            title: 'Score',
            sorter: (a, b, order) => {
              if (a.score === undefined) return order === 'descend' ? -1 : 1;
              if (b.score === undefined) return order === 'descend' ? 1 : -1;
              return Number(a.score) - Number(b.score);
            },
          },
        ],
        dataSource: [{ key: 'empty' }, { key: 'two', score: 2 }, { key: 'one', score: 1 }],
        pagination: false,
      },
    });
    const rows = () => wrapper.findAll('tbody tr').map((row) => row.text());
    await wrapper.find('.semi-table-column-sorter-wrapper').trigger('click');
    expect(rows()).toEqual(['1', '2', '']);
    await wrapper.find('.semi-table-column-sorter-wrapper').trigger('click');
    expect(rows()).toEqual(['2', '1', '']);
    wrapper.unmount();
  });
  it('受控远程分页直接展示当前页，移除 currentPage 后恢复本地切片', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: { currentPage: 2, pageSize: 1, total: 4 } },
    });
    expect(wrapper.findAll('tbody tr')).toHaveLength(2);
    expect(wrapper.findAll('tbody tr')[0]!.text()).toContain('Alpha');
    await wrapper.setProps({ pagination: { pageSize: 1, total: 4 } });
    expect(wrapper.findAll('tbody tr')).toHaveLength(1);
    wrapper.unmount();
  });

  it('受控排序通知下一方向与取消状态，只有回写后才改变行序', async () => {
    const onChange = vi.fn();
    const sortable = { ...columns[1]!, sortOrder: false as const };
    const wrapper = mount(Table, {
      props: { columns: [columns[0]!, sortable], dataSource: data, pagination: false, onChange },
    });
    await wrapper.find('.semi-table-column-sorter-wrapper').trigger('click');
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sorter: expect.objectContaining({ dataIndex: 'score', sortOrder: 'ascend' }),
      }),
    );
    expect(wrapper.findAll('tbody tr')[0]!.text()).toContain('Alpha');
    await wrapper.setProps({ columns: [columns[0]!, { ...sortable, sortOrder: 'ascend' }] });
    expect(wrapper.findAll('tbody tr')[0]!.text()).toContain('Beta');
    await wrapper.find('.semi-table-column-sorter-wrapper').trigger('click');
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ sorter: expect.objectContaining({ sortOrder: 'descend' }) }),
    );
    await wrapper.setProps({ columns: [columns[0]!, { ...sortable, sortOrder: 'descend' }] });
    await wrapper.find('.semi-table-column-sorter-wrapper').trigger('click');
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ sorter: expect.objectContaining({ sortOrder: false }) }),
    );
    wrapper.unmount();
  });

  it('保留默认 showHeader/hideExpandedColumn，并区分显式 false/true', () => {
    const Host = defineComponent({
      components: { Table },
      setup: () => ({ columns, data }),
      template: `
        <div>
          <Table data-testid="default" :columns="columns" :data-source="data" :pagination="false" />
          <Table data-testid="false" :columns="columns" :data-source="data" :pagination="false" :show-header="false" :hide-expanded-column="false" />
          <Table data-testid="true" :columns="columns" :data-source="data" :pagination="false" show-header hide-expanded-column />
        </div>
      `,
    });
    const wrapper = mount(Host);
    const tables = wrapper.findAll('.semi-table-wrapper');
    expect(tables[0]!.findAll('thead')).toHaveLength(1);
    expect(tables[0]!.find('.semi-table-column-expand').exists()).toBe(false);
    expect(tables[1]!.find('thead').exists()).toBe(false);
    expect(tables[1]!.find('.semi-table-column-expand').exists()).toBe(true);
    expect(tables[2]!.findAll('thead')).toHaveLength(1);
    expect(tables[2]!.find('.semi-table-column-expand').exists()).toBe(false);
  });

  it('只读取真实 Table.Column VNode，并覆盖模板裸 Boolean 与 h() 输入', () => {
    const TemplateHost = defineComponent({
      components: { Table, TableColumn },
      setup: () => ({ data }),
      template: `
        <Table :data-source="data" :pagination="false" resizable>
          ignored text
          <TableColumn title="Name" data-index="name" :width="120" resize />
          <span>not a column</span>
          <TableColumn title="Score" data-index="score" :width="120" :resize="false" />
        </Table>
      `,
    });
    const template = mount(TemplateHost);
    expect(template.findAll('th')).toHaveLength(2);
    expect(template.findAll('.react-resizable-handle')).toHaveLength(1);

    const RenderHost = defineComponent(
      () => () =>
        h(
          Table,
          { dataSource: data, pagination: false, resizable: true },
          {
            default: () => [
              h(TableColumn, { dataIndex: 'name', width: 120, resize: true, title: 'Name' }),
              h(TableColumn, { dataIndex: 'score', width: 120, resize: false, title: 'Score' }),
            ],
          },
        ),
    );
    const render = mount(RenderHost);
    expect(render.findAll('th')).toHaveLength(2);
    expect(render.findAll('.react-resizable-handle')).toHaveLength(1);
  });

  it('执行 render/onCell/span，排序不修改调用方数据并按事件顺序通知', async () => {
    const source = data.map((item) => ({ ...item }));
    const onChange = vi.fn();
    const renderColumns: TableColumnConfig[] = [
      {
        dataIndex: 'name',
        key: 'name',
        onCell: (_record, index) => ({ 'data-cell': index, className: 'custom-cell' }),
        render: (text, _record, index) =>
          index === 0 ? { children: `render:${text}`, props: { colSpan: 2 } } : String(text),
        title: 'Name',
      },
      columns[1]!,
    ];
    const wrapper = mount(Table, {
      props: { columns: renderColumns, dataSource: source, onChange, pagination: false },
    });
    expect(wrapper.find('td.custom-cell').attributes('data-cell')).toBe('0');
    expect(wrapper.find('td.custom-cell').attributes('colspan')).toBe('2');
    expect(wrapper.find('td.custom-cell').text()).toBe('render:Alpha');

    await wrapper.find('.semi-table-column-sorter-wrapper').trigger('click');
    expect(wrapper.findAll('tbody tr')[0]!.text()).toContain('Beta');
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ extra: { changeType: 'sorter' } }),
    );
    expect(source).toEqual(data);
  });

  it('展示非受控排序提示，并由 shouldCellUpdate 接管单元格更新', async () => {
    vi.useFakeTimers();
    try {
      const shouldCellUpdate = vi.fn(() => false);
      const wrapper = mount(Table, {
        attachTo: document.body,
        props: {
          columns: [
            {
              dataIndex: 'name',
              key: 'name',
              shouldCellUpdate,
              showSortTip: true,
              sorter: true,
              title: 'Name',
            },
          ],
          dataSource: [{ key: 'a', name: 'Alpha' }],
          pagination: false,
        },
      });

      const sorter = wrapper.find('th');
      vi.spyOn(sorter.element, 'matches').mockImplementation((selector) => selector === ':hover');
      await sorter.trigger('mouseenter');
      await vi.advanceTimersByTimeAsync(100);
      await flushPromises();
      expect(document.body.textContent).toContain('点击升序');

      await wrapper.setProps({ dataSource: [{ key: 'a', name: 'Changed' }] });
      await nextTick();
      expect(shouldCellUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Changed' }),
        expect.objectContaining({ name: 'Alpha' }),
      );
      expect(wrapper.find('td').text()).toBe('Alpha');
    } finally {
      vi.useRealTimers();
    }
  });

  it('覆盖 checkbox/radio 选择、disabled 全选与受控 keys', async () => {
    const onSelect = vi.fn();
    const onSelectAll = vi.fn();
    const onChange = vi.fn();
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: {
          getCheckboxProps: (record) => ({ disabled: record.key === 'b' }),
          onChange,
          onSelect,
          onSelectAll,
        },
      },
    });
    const inputs = wrapper.findAll('input[type="checkbox"]');
    inputs[1]!.element
      .closest('.semi-checkbox')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();
    expect(onSelect).toHaveBeenCalledWith(data[0], true, [data[0]], expect.anything());
    expect(onChange).toHaveBeenLastCalledWith(['a'], [data[0]]);
    inputs[0]!.element
      .closest('.semi-checkbox')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();
    expect(onSelectAll).toHaveBeenCalledWith(false, [], [data[0]]);
    expect(inputs[2]!.attributes('disabled')).toBeDefined();

    await wrapper.setProps({
      rowSelection: { selectedRowKeys: ['b'], type: 'radio' },
    });
    expect((wrapper.findAll('input[type="radio"]')[1]!.element as HTMLInputElement).checked).toBe(
      true,
    );
  });

  it('覆盖树展开、expandedRow、keepDOM 与事件顺序', async () => {
    const onExpand = vi.fn();
    const onExpandedRowsChange = vi.fn();
    const tree = [
      { key: 'p', name: 'Parent', score: 1, children: [{ key: 'c', name: 'Child', score: 2 }] },
    ];
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: tree,
        expandedRowRender: (record) => `detail:${record?.name}`,
        keepDOM: true,
        onExpand,
        onExpandedRowsChange,
        pagination: false,
      },
    });
    await wrapper.find('.semi-table-expand-icon').trigger('click');
    expect(wrapper.text()).toContain('Child');
    expect(wrapper.text()).toContain('detail:Parent');
    expect(onExpand).toHaveBeenCalledWith(true, tree[0], expect.any(MouseEvent));
    expect(onExpandedRowsChange).toHaveBeenCalledWith([tree[0]]);
    await wrapper.find('.semi-table-expand-icon').trigger('click');
    expect(wrapper.find('.semi-table-row-expand').classes()).toContain('semi-table-row-hidden');
  });

  it('覆盖分页、fixed/scroll、virtualized ref 与 resize 回调', async () => {
    const virtualRef = vi.fn();
    const onResizeStart = vi.fn((column) => column);
    const onResize = vi.fn((column) => column);
    const onResizeStop = vi.fn((column) => column);
    const many = Array.from({ length: 30 }, (_, index) => ({
      key: index,
      name: `row-${index}`,
      score: index,
    }));
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: {
        columns: [
          { ...columns[0]!, fixed: 'left', width: 120 },
          { ...columns[1]!, width: 120 },
        ],
        dataSource: many,
        getVirtualizedListRef: virtualRef,
        pagination: { pageSize: 10 },
        resizable: { onResize, onResizeStart, onResizeStop },
        scroll: { x: 400, y: 160 },
        virtualized: { itemSize: 40 },
      },
    });
    expect(wrapper.find('.semi-table-fixed-header').exists()).toBe(true);
    expect(wrapper.find('.semi-table-cell-fixed-left').exists()).toBe(true);
    expect(wrapper.findAll('tbody tr').length).toBeLessThan(10);
    expect(virtualRef).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.anything() }),
    );

    const handle = wrapper.find('.react-resizable-handle');
    await handle.trigger('pointerdown', { clientX: 100, button: 0 });
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 130 }));
    window.dispatchEvent(new MouseEvent('pointerup', { clientX: 130 }));
    await nextTick();
    expect(onResizeStart).toHaveBeenCalled();
    expect(onResize).toHaveBeenCalled();
    expect(onResizeStop).toHaveBeenCalled();

    const exposed = virtualRef.mock.calls[0]![0].current;
    exposed.scrollToItem(5, 'start');
    await nextTick();
    expect((wrapper.find('.semi-table-body').element as HTMLElement).scrollTop).toBe(200);
  });

  it('ConfigProvider locale/RTL 与 header/cell slots 生效', async () => {
    const Host = defineComponent({
      components: { ConfigProvider, Table },
      setup: () => ({ columns: shallowRef(columns), data: shallowRef([]) }),
      template: `
        <ConfigProvider direction="rtl" :locale="{ code: 'en-US', Table: { emptyText: 'Nothing' } }">
          <Table :columns="columns" :data-source="data" :pagination="false">
            <template #headerCell="{ column }">H:{{ column.title }}</template>
            <template #cell="{ text }">C:{{ text }}</template>
          </Table>
        </ConfigProvider>
      `,
    });
    const wrapper = mount(Host);
    await flushPromises();
    expect(wrapper.find('.semi-table-wrapper-rtl').exists()).toBe(true);
    expect(wrapper.text()).toContain('Nothing');
    expect(wrapper.find('th').text()).toContain('H:Name');
  });

  it('按列控制树过滤，并在 confirm 模式确认前保留当前数据', async () => {
    const tree = [
      {
        children: [{ key: 'child', name: 'matched child', score: 2 }],
        key: 'parent',
        name: 'parent',
        score: 1,
      },
    ];
    const recursive = mount(Table, {
      props: {
        columns: [
          {
            dataIndex: 'name',
            defaultFilteredValue: ['matched'],
            filterChildrenRecord: true,
            filters: [{ text: 'Matched', value: 'matched' }],
            onFilter: (value, record) => String(record?.name).includes(String(value)),
            title: 'Name',
          },
        ],
        dataSource: tree,
        defaultExpandAllRows: true,
        pagination: false,
      },
    });
    expect(recursive.text()).toContain('matched child');
    const topLevelOnly = mount(Table, {
      props: {
        columns: [
          {
            dataIndex: 'name',
            defaultFilteredValue: ['matched'],
            filters: [{ text: 'Matched', value: 'matched' }],
            onFilter: (value, record) => String(record?.name).includes(String(value)),
            title: 'Name',
          },
        ],
        dataSource: tree,
        pagination: false,
      },
    });
    expect(topLevelOnly.find('.semi-table-placeholder').exists()).toBe(true);

    const confirmed = mount(Table, {
      attachTo: document.body,
      props: {
        columns: [
          {
            dataIndex: 'name',
            filterConfirmMode: 'confirm',
            filterDropdownProps: { motion: false },
            filters: [{ text: 'Alpha only', value: 'Alpha' }],
            onFilter: (value, record) => String(record?.name).includes(String(value)),
            title: 'Name',
          },
        ],
        dataSource: data,
        pagination: false,
      },
    });
    await confirmed.find('.semi-table-column-filter').trigger('click');
    await flushPromises();
    const filterItem = document.body.querySelector<HTMLElement>('.semi-dropdown-item');
    filterItem?.click();
    await nextTick();
    expect(confirmed.findAll('tbody tr')).toHaveLength(2);
    const confirmButton = [...document.body.querySelectorAll<HTMLButtonElement>('button')].find(
      (button) => button.textContent?.trim() === '确定',
    );
    confirmButton?.click();
    await nextTick();
    expect(confirmed.findAll('tbody tr')).toHaveLength(1);
    expect(confirmed.text()).toContain('Alpha');
  });

  it('向 full render 传递 selection/expand/indent，并合并全局 headerStyle', () => {
    const fullColumns: TableColumnConfig[] = [
      {
        dataIndex: 'name',
        key: 'name',
        render: (text, _record, _index, options) =>
          h('span', { class: 'full-render' }, [
            options?.indentText,
            options?.expandIcon,
            options?.selection,
            String(text),
          ]),
        title: 'Name',
        useFullRender: true,
      },
    ];
    const wrapper = mount(Table, {
      props: {
        columns: fullColumns,
        dataSource: [{ children: [{ key: 'c', name: 'Child' }], key: 'p', name: 'Parent' }],
        defaultExpandAllRows: true,
        headerStyle: { backgroundColor: 'rgb(1, 2, 3)' },
        pagination: false,
        rowSelection: { hidden: true },
      },
    });
    const rendered = wrapper.find('.full-render');
    expect(rendered.find('.semi-table-expand-icon').exists()).toBe(true);
    expect(rendered.find('.semi-checkbox').exists()).toBe(true);
    expect(wrapper.find('th').attributes('style')).toContain('background-color: rgb(1, 2, 3)');
  });

  it('related 选择级联子节点并为部分选择输出 indeterminate', async () => {
    const onChange = vi.fn();
    const tree = [
      {
        children: [
          { key: 'c1', name: 'Child 1' },
          { key: 'c2', name: 'Child 2' },
        ],
        key: 'p',
        name: 'Parent',
      },
    ];
    const wrapper = mount(Table, {
      props: {
        columns: [columns[0]!],
        dataSource: tree,
        defaultExpandAllRows: true,
        pagination: false,
        rowSelection: { checkRelation: 'related', onChange },
      },
    });
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    checkboxes[1]!.element
      .closest('.semi-checkbox')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();
    expect(onChange).toHaveBeenLastCalledWith(
      ['p', 'c1', 'c2'],
      tree.flatMap((row) => [row, ...row.children]),
    );

    checkboxes[2]!.element
      .closest('.semi-checkbox')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();
    expect(wrapper.findAll('.semi-checkbox-indeterminate')).not.toHaveLength(0);
  });

  it('rowSpanHover 同时标记跨行单元格覆盖的行', async () => {
    const spanColumns: TableColumnConfig[] = [
      {
        dataIndex: 'name',
        render: (text, _record, index) => ({
          children: String(text),
          props: index === 0 ? { rowSpan: 2 } : { rowSpan: 0 },
        }),
        title: 'Name',
      },
      { dataIndex: 'score', title: 'Score' },
    ];
    const wrapper = mount(Table, {
      props: { columns: spanColumns, dataSource: data, pagination: false, rowSpanHover: true },
    });
    const rows = wrapper.findAll('tbody tr[data-row-key]');
    await rows[1]!.trigger('mouseenter');
    expect(rows[0]!.classes()).toContain('semi-table-row-hovered');
    expect(rows[1]!.classes()).toContain('semi-table-row-hovered');
  });

  it('render 中 h(组件, 插槽) 的内容随记录原地更新', async () => {
    // The reported case replaces a record without changing row keys, sorting, or pagination.
    const rows = shallowRef([{ key: 'a', role: '访客' }]);
    const wrapper = mount(Table, {
      props: {
        columns: [
          {
            dataIndex: 'role',
            key: 'role',
            render: (_text, record) =>
              h(Tag, { color: 'blue' }, { default: () => String(record?.role) }),
            title: 'Role',
          },
        ],
        dataSource: rows.value,
        pagination: false,
        rowKey: 'key',
      },
    });
    expect(wrapper.get('td').text()).toBe('访客');

    await wrapper.setProps({ dataSource: [{ key: 'a', role: '管理员' }] });
    await nextTick();
    expect(wrapper.get('td').text()).toBe('管理员');
  });

  it('#cell 插槽内容随记录原地更新', async () => {
    const rows = shallowRef([{ key: 'a', role: '访客' }]);
    const wrapper = mount(Table, {
      props: {
        columns: [{ dataIndex: 'role', key: 'role', title: 'Role' }],
        dataSource: rows.value,
        pagination: false,
        rowKey: 'key',
      },
      slots: {
        cell: (slotProps: { text?: unknown }) =>
          h(Tag, { color: 'blue' }, { default: () => String(slotProps.text) }),
      },
    });
    expect(wrapper.get('td').text()).toBe('访客');

    await wrapper.setProps({ dataSource: [{ key: 'a', role: '管理员' }] });
    await nextTick();
    expect(wrapper.get('td').text()).toBe('管理员');
  });

  it('声明式 Table.Column 在父级重渲染后刷新表头', async () => {
    const title = shallowRef('First');
    const host = defineComponent(
      () => () =>
        h(Table, { dataSource: [{ key: 'a', name: 'Alpha' }], pagination: false }, () => [
          h(TableColumn, { dataIndex: 'name', title: title.value }),
        ]),
    );
    const wrapper = mount(host);
    expect(wrapper.get('th').text()).toBe('First');

    title.value = 'Second';
    await nextTick();
    expect(wrapper.get('th').text()).toBe('Second');
  });

  it('同 dataIndex 的多列各自渲染标题与单元格', () => {
    const build = (withKey: boolean) =>
      mount(Table, {
        props: {
          columns: [
            { dataIndex: 'name', title: 'A', ...(withKey ? { key: 'a' } : {}) },
            { dataIndex: 'name', title: 'B', ...(withKey ? { key: 'b' } : {}) },
            { dataIndex: 'role', title: 'C', ...(withKey ? { key: 'c' } : {}) },
            { dataIndex: 'role', title: 'D', ...(withKey ? { key: 'd' } : {}) },
          ],
          dataSource: [{ key: 'r1', name: 'Alpha', role: 'Admin' }],
          pagination: false,
        },
      });
    for (const withKey of [true, false]) {
      const wrapper = build(withKey);
      expect(wrapper.findAll('th').map((cell) => cell.text())).toEqual(['A', 'B', 'C', 'D']);
      expect(wrapper.findAll('td').map((cell) => cell.text())).toEqual([
        'Alpha',
        'Alpha',
        'Admin',
        'Admin',
      ]);
    }
  });
});
