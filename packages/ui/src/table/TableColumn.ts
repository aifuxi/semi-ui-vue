/* eslint-disable vue/require-default-prop -- declaration-only compound component preserves whether each column prop was supplied. */
import { defineComponent, type PropType } from 'vue';

import type { TableColumn } from './types';

export const TABLE_COLUMN_MARK = Symbol('workspace-table-column');

export const TableColumnComponent = defineComponent({
  name: 'TableColumn',
  inheritAttrs: false,
  props: {
    align: String as PropType<TableColumn['align']>,
    className: String,
    colSpan: Number,
    dataIndex: String,
    defaultFilteredValue: Array as PropType<unknown[]>,
    defaultSortOrder: [String, Boolean] as PropType<TableColumn['defaultSortOrder']>,
    ellipsis: [Boolean, Object] as PropType<TableColumn['ellipsis']>,
    filterChildrenRecord: Boolean,
    filterConfirmMode: String as PropType<TableColumn['filterConfirmMode']>,
    filterDropdown: null,
    filterDropdownProps: Object,
    filterDropdownVisible: Boolean,
    filterIcon: null,
    filterMultiple: Boolean,
    filteredValue: Array as PropType<unknown[]>,
    filters: Array as PropType<TableColumn['filters']>,
    fixed: [Boolean, String] as PropType<TableColumn['fixed']>,
    onCell: Function as PropType<TableColumn['onCell']>,
    onFilter: Function as PropType<TableColumn['onFilter']>,
    onFilterDropdownVisibleChange: Function as PropType<
      TableColumn['onFilterDropdownVisibleChange']
    >,
    onHeaderCell: Function as PropType<TableColumn['onHeaderCell']>,
    render: Function as PropType<TableColumn['render']>,
    renderFilterDropdown: Function as PropType<TableColumn['renderFilterDropdown']>,
    renderFilterDropdownItem: Function as PropType<TableColumn['renderFilterDropdownItem']>,
    resize: Boolean,
    showSortTip: Boolean,
    sortChildrenRecord: Boolean,
    sorter: [Boolean, Function] as PropType<TableColumn['sorter']>,
    sortIcon: Function as PropType<TableColumn['sortIcon']>,
    sortOrder: [String, Boolean] as PropType<TableColumn['sortOrder']>,
    title: null,
    useFullRender: Boolean,
    width: [String, Number],
  },
  setup() {
    return () => null;
  },
});

Object.defineProperty(TableColumnComponent, TABLE_COLUMN_MARK, { value: true });

export default TableColumnComponent;
