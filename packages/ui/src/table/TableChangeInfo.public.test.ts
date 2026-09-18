import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';

import { Table, type TableChangeInfo, type TableColumnProps } from './index';

type Row = Record<string, unknown>;
const dataSource = [
  { key: 'a', name: 'Alpha', size: 2 },
  { key: 'b', name: 'Beta', size: 1 },
];
const sizeSorter = (a: Row, b: Row) => Number(a.size) - Number(b.size);
const renderSize = (text: unknown) => String(text);
const nameFilter = (value?: unknown, row?: Row) => row?.name === value;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Table public change queries', () => {
  it('returns the complete sort query and preserves the old controlled query in subsequent filters', async () => {
    const sizeColumn = Object.freeze({
      dataIndex: 'size',
      title: 'Size',
      sorter: sizeSorter,
      render: renderSize,
    });
    const nameColumn = Object.freeze({
      dataIndex: 'name',
      title: 'Name',
      filters: [{ text: 'Alpha', value: 'Alpha' }],
      onFilter: nameFilter,
    });
    const wrapper = mount(Table, {
      props: { columns: [sizeColumn, nameColumn], dataSource, pagination: false },
    });
    await wrapper.get('th').trigger('click');
    const first = wrapper.emitted('change')![0]![0] as TableChangeInfo<Row>;
    const ascending = { ...sizeColumn, filteredValue: [], sortOrder: 'ascend' as const };
    expect(first).toEqual({
      extra: { changeType: 'sorter' },
      filters: [],
      pagination: {},
      sorter: ascending,
    });
    expect(first.sorter?.render).toBe(renderSize);
    expect(first.sorter?.sorter).toBe(sizeSorter);
    expect(sizeColumn).not.toHaveProperty('sortOrder');
    expect(sizeColumn).not.toHaveProperty('filteredValue');
    expect(first.sorter).not.toHaveProperty('key');

    await wrapper.setProps({ columns: [{ ...sizeColumn, ...first.sorter }, nameColumn] });
    await wrapper.get('th').trigger('click');
    const second = wrapper.emitted('change')![1]![0] as TableChangeInfo<Row>;
    expect(second.sorter).toEqual({ ...ascending, sortOrder: 'descend' });
    expect(second.filters).toEqual([ascending]);
    expect(wrapper.get('.semi-table-column-sorter-wrapper').attributes('aria-label')).toBe(
      'Current sort order is ascending',
    );

    // The documented consumer merges sorter first, then all filter queries.
    const updates = [second.sorter!, ...(second.filters ?? [])];
    const merged = updates.reduce<TableColumnProps>(
      (column, query) => ({ ...column, ...query }),
      ascending,
    );
    await wrapper.setProps({ columns: [merged, nameColumn] });
    await wrapper.get('th').trigger('click');
    const third = wrapper.emitted('change')![2]![0] as TableChangeInfo<Row>;
    expect(third.sorter?.sortOrder).toBe('descend');
    expect(third.filters).toEqual([ascending]);
    expect(wrapper.get('.semi-table-column-sorter-wrapper').attributes('aria-label')).toBe(
      'Current sort order is ascending',
    );
    const dateColumn = { dataIndex: 'date', title: 'Date', sorter: sizeSorter };
    let columns: TableColumnProps[] = [ascending, dateColumn, nameColumn];
    await wrapper.setProps({ columns });
    for (const [index, request] of ['ascend', 'descend', 'descend'].entries()) {
      await wrapper.findAll('th')[1]!.trigger('click');
      const info = wrapper.emitted('change')![index + 3]![0] as TableChangeInfo<Row>;
      expect(info.sorter).toEqual({ ...dateColumn, filteredValue: [], sortOrder: request });
      expect(info.filters).toEqual(
        index === 0
          ? [ascending]
          : [ascending, { ...dateColumn, filteredValue: [], sortOrder: 'ascend' }],
      );
      columns = columns.map((column) =>
        [info.sorter!, ...(info.filters ?? [])].reduce(
          (current, query) =>
            query.dataIndex === current.dataIndex ? { ...current, ...query } : current,
          column,
        ),
      );
      await wrapper.setProps({ columns });
      expect(
        wrapper
          .findAll('.semi-table-column-sorter-wrapper')
          .map((sorter) => sorter.attributes('aria-label')),
      ).toEqual(['Current sort order is ascending', 'Current sort order is ascending']);
    }
    wrapper.unmount();
  });

  it('includes explicit empty and nonempty queries independently of filter UI and preserves explicit keys', async () => {
    const empty = { dataIndex: 'empty', key: 'explicit', title: 'Empty', filteredValue: [] };
    const nonempty = { dataIndex: 'name', title: 'Name', defaultFilteredValue: ['Alpha'] };
    const offered = {
      dataIndex: 'offered',
      title: 'Offered',
      filters: [{ text: 'All', value: 'all' }],
    };
    const inert = { dataIndex: 'inert', title: 'Inert', sortOrder: 'ascend' as const };
    const sortable = {
      dataIndex: 'size',
      title: 'Size',
      sorter: sizeSorter,
      width: 120,
      __remoteId: 'remote-size',
    };
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Group', children: [empty, nonempty, offered, inert, sortable] }],
        dataSource,
        pagination: false,
        resizable: true,
      },
    });
    await wrapper.get('th.semi-table-row-head-clickSort').trigger('click');
    const info = wrapper.emitted('change')![0]![0] as TableChangeInfo<Row>;
    expect(info.filters).toEqual([empty, { ...nonempty, filteredValue: ['Alpha'] }]);
    expect(info.sorter).toEqual({ ...sortable, filteredValue: [], sortOrder: 'ascend' });
    expect(info.sorter?.__remoteId).toBe('remote-size');
    expect(info.sorter).not.toHaveProperty('__width');
    expect(info.sorter).not.toHaveProperty('__kind');
    expect(info.sorter).not.toHaveProperty('key');
    info.filters![0]!.filteredValue!.push('changed by consumer');
    expect(empty.filteredValue).toEqual([]);
    wrapper.unmount();
  });

  it('keeps the previous uncontrolled sort direction in filters while reporting the next request', async () => {
    const column: TableColumnProps = {
      dataIndex: 'size',
      title: 'Size',
      sorter: sizeSorter,
      defaultFilteredValue: ['all'],
      onFilter: () => true,
    };
    const wrapper = mount(Table, {
      props: { columns: [column], dataSource, pagination: { pageSize: 1 } },
    });
    await wrapper.get('.semi-page-next').trigger('click');
    expect(wrapper.emitted('change')![0]![0]).toMatchObject({ pagination: { currentPage: 2 } });
    const previousOrders = [false, 'ascend'] as const;
    const requests = ['ascend', 'descend'] as const;
    for (const [index, request] of requests.entries()) {
      await wrapper.get('th').trigger('click');
      const info = wrapper.emitted('change')![index + 1]![0] as TableChangeInfo<Row>;
      const previousQuery = { ...column, filteredValue: ['all'], sortOrder: previousOrders[index] };
      expect(info.filters).toEqual([previousQuery]);
      expect(info.sorter).toEqual({ ...previousQuery, sortOrder: request });
      expect(info.pagination?.currentPage).toBe(1);
      expect(wrapper.get('tbody tr').attributes('data-row-key')).toBe(index === 0 ? 'b' : 'a');
    }
    wrapper.unmount();
  });

  it('reports cleared filters with the previous active sorter query before updating uncontrolled rows', async () => {
    const column: TableColumnProps = {
      dataIndex: 'name',
      title: 'Name',
      sorter: sizeSorter,
      defaultSortOrder: 'ascend',
      defaultFilteredValue: ['Alpha'],
      onFilter: nameFilter,
      filters: [{ text: 'Alpha', value: 'Alpha' }],
      filterDropdownVisible: true,
      renderFilterDropdown: (controls) =>
        h(
          'button',
          {
            onClick: () => (controls!.clear as () => void)(),
          },
          'Clear query',
        ),
    };
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: { columns: [column], dataSource, pagination: false },
    });
    await flushPromises();
    expect(wrapper.findAll('tbody tr')).toHaveLength(1);
    document.querySelector<HTMLButtonElement>('.semi-table-column-filter-dropdown button')!.click();
    await flushPromises();
    const info = wrapper.emitted('change')![0]![0] as TableChangeInfo<Row>;
    expect(info.filters).toEqual([]);
    expect(info.sorter).toEqual({ ...column, filteredValue: ['Alpha'], sortOrder: 'ascend' });
    expect(wrapper.findAll('tbody tr').map((row) => row.attributes('data-row-key'))).toEqual([
      'b',
      'a',
    ]);
    expect(column.defaultFilteredValue).toEqual(['Alpha']);
    wrapper.unmount();
  });

  it.each([true, false])(
    'reports the requested cleared filter when controlled=%s',
    async (controlled) => {
      const column: TableColumnProps = {
        dataIndex: 'name',
        key: 'name',
        title: 'Name',
        filters: [{ text: 'Alpha', value: 'Alpha' }],
        onFilter: nameFilter,
        filterDropdownVisible: true,
        ...(controlled ? { filteredValue: ['Alpha'] } : { defaultFilteredValue: ['Alpha'] }),
        renderFilterDropdown: (controls?: Record<string, unknown>) =>
          h('button', { onClick: () => (controls!.clear as () => void)() }, 'Clear query'),
      };
      const wrapper = mount(Table, {
        attachTo: document.body,
        props: { columns: [column], dataSource, pagination: false },
      });
      await flushPromises();
      expect(wrapper.findAll('tbody tr')).toHaveLength(1);
      document
        .querySelector<HTMLButtonElement>('.semi-table-column-filter-dropdown button')!
        .click();
      await flushPromises();
      const info = wrapper.emitted('change')![0]![0] as TableChangeInfo<Row>;
      expect(info).toEqual({
        extra: { changeType: 'filter' },
        pagination: {},
        filters: controlled ? [{ ...column, filteredValue: [] }] : [],
        sorter: undefined,
      });
      expect(wrapper.findAll('tbody tr')).toHaveLength(controlled ? 1 : 2);
      expect(controlled ? column.filteredValue : column.defaultFilteredValue).toEqual(['Alpha']);
      wrapper.unmount();
    },
  );

  it('treats an explicit undefined filteredValue as uncontrolled and omits sorter-only state without a sorter', async () => {
    const column: TableColumnProps = {
      dataIndex: 'name',
      title: 'Name',
      filteredValue: undefined,
      sortOrder: 'ascend',
      filters: [{ text: 'Alpha', value: 'Alpha' }],
      onFilter: nameFilter,
      filterDropdownVisible: true,
      renderFilterDropdown: (controls) =>
        h(
          'button',
          {
            onClick: () =>
              (controls!.confirm as (options: { filteredValue: string[] }) => void)({
                filteredValue: ['Alpha'],
              }),
          },
          'Apply query',
        ),
    };
    const wrapper = mount(Table, {
      attachTo: document.body,
      props: { columns: [column], dataSource, pagination: false },
    });
    await flushPromises();
    document.querySelector<HTMLButtonElement>('.semi-table-column-filter-dropdown button')!.click();
    await flushPromises();
    const info = wrapper.emitted('change')![0]![0] as TableChangeInfo<Row>;
    expect(info.filters).toEqual([{ ...column, filteredValue: ['Alpha'] }]);
    expect(info.sorter).toBeUndefined();
    expect(wrapper.findAll('tbody tr')).toHaveLength(1);
    expect(column.filteredValue).toBeUndefined();
    wrapper.unmount();
  });
});
