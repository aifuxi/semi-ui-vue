import type { Component, HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { CheckboxProps } from '../checkbox';
import type { PaginationProps } from '../pagination';

export type TableRowKey = string | number;
export type TableSize = 'small' | 'default' | 'middle';
export type TableAlign = 'left' | 'right' | 'center';
export type TableFixed = boolean | 'left' | 'right';
export type TableSortOrder = false | 'ascend' | 'descend';
export type TableDirection = 'ltr' | 'rtl';
export type TableFilterConfirmMode = 'immediate' | 'confirm';
export type TableCheckRelation = 'related' | 'unRelated';

export interface TableFilter {
  value?: unknown;
  text?: VNodeChild;
  children?: TableFilter[];
  [key: string]: unknown;
}

export interface TableRenderOptions {
  expandIcon?: VNodeChild;
  selection?: VNodeChild;
  indentText?: VNodeChild;
  isHovering?: boolean;
}

export interface TableRenderReturnObject {
  children: VNodeChild;
  props: Record<string, unknown> & { colSpan?: number; rowSpan?: number };
  [key: string]: unknown;
}

export type TableColumnRender<RecordType> = (
  text: unknown,
  record: RecordType,
  index: number,
  options?: TableRenderOptions,
) => VNodeChild | TableRenderReturnObject;

export interface TableColumn<RecordType extends Record<string, unknown> = Record<string, unknown>> {
  align?: TableAlign;
  children?: TableColumn<RecordType>[] | undefined;
  className?: string;
  colSpan?: number;
  dataIndex?: string;
  defaultFilteredValue?: unknown[];
  defaultSortOrder?: TableSortOrder;
  ellipsis?: boolean | { showTitle?: boolean };
  filterChildrenRecord?: boolean;
  filterConfirmMode?: TableFilterConfirmMode;
  filterDropdown?: VNodeChild;
  filterDropdownProps?: Record<string, unknown>;
  filterDropdownVisible?: boolean;
  filterIcon?: boolean | VNodeChild | ((filtered: boolean) => VNodeChild);
  filterMultiple?: boolean;
  filteredValue?: unknown[];
  filters?: TableFilter[];
  fixed?: TableFixed;
  key?: TableRowKey;
  onCell?: (record?: RecordType, rowIndex?: number) => TableCellAttributes;
  onFilter?: (filteredValue?: unknown, record?: RecordType) => boolean;
  onFilterDropdownVisibleChange?: (visible?: boolean) => void;
  onHeaderCell?: (
    column?: TableColumn<RecordType>,
    columnIndex?: number,
    rowIndex?: number,
  ) => TableCellAttributes;
  render?: TableColumnRender<RecordType>;
  renderFilterDropdown?: (props?: Record<string, unknown>) => VNodeChild;
  renderFilterDropdownItem?: (props?: Record<string, unknown>) => VNodeChild;
  resize?: boolean;
  shouldCellUpdate?: (next: Record<string, unknown>, previous: Record<string, unknown>) => boolean;
  showSortTip?: boolean;
  sortChildrenRecord?: boolean;
  sorter?: boolean | ((a: RecordType, b: RecordType) => number);
  sortIcon?: (props: { sortOrder: TableSortOrder }) => VNodeChild;
  sortOrder?: TableSortOrder;
  title?: VNodeChild | ((props?: TableColumnTitleProps) => VNodeChild);
  useFullRender?: boolean;
  width?: string | number;
  [key: string]: unknown;
}

export interface TableColumnTitleProps {
  sorter?: VNodeChild;
  filter?: VNodeChild;
  selection?: VNodeChild;
}

export interface TableCellAttributes extends Record<string, unknown> {
  class?: HTMLAttributes['class'];
  className?: string;
  colSpan?: number;
  onClick?: (event: MouseEvent) => void;
  rowSpan?: number;
  style?: StyleValue;
}

export interface TableRowAttributes extends Record<string, unknown> {
  class?: HTMLAttributes['class'];
  className?: string;
  onClick?: (event: MouseEvent) => void;
  style?: StyleValue;
}

export interface TableScroll {
  x?: string | number;
  y?: string | number;
  scrollToFirstRowOnChange?: boolean;
}

export interface TableVirtualizedOnScrollArgs {
  scrollDirection?: 'forward' | 'backward';
  scrollOffset?: number;
  scrollUpdateWasRequested?: boolean;
}

export interface TableVirtualizedItemRow {
  expandedRow?: boolean;
  sectionRow?: boolean;
}

export type TableVirtualizedItemSize =
  number | ((index?: number, row?: TableVirtualizedItemRow) => number);

export interface TableVirtualizedProps extends Record<string, unknown> {
  itemSize?: TableVirtualizedItemSize;
  onScroll?: (args: TableVirtualizedOnScrollArgs) => void;
}

export type TableVirtualized = boolean | TableVirtualizedProps;

export interface TableVirtualizedListRef {
  scrollTo(offset: number): void;
  scrollToItem(index: number, align?: 'auto' | 'smart' | 'center' | 'end' | 'start'): void;
}

export interface TablePaginationConfig extends PaginationProps {
  formatPageText?:
    | boolean
    | ((pageInfo?: { currentStart?: number; currentEnd?: number; total?: number }) => VNodeChild);
  position?: 'bottom' | 'top' | 'both';
  onChange?: (currentPage: number, pageSize: number) => void;
}

export interface TableRowSelection<RecordType extends Record<string, unknown>> {
  checkRelation?: TableCheckRelation;
  className?: string;
  clickRow?: boolean;
  defaultSelectedRowKeys?: TableRowKey[];
  disabled?: boolean;
  fixed?: TableFixed;
  getCheckboxProps?: (
    record: RecordType,
  ) => Omit<CheckboxProps, 'checked' | 'defaultChecked' | 'indeterminate' | 'modelValue'>;
  hidden?: boolean;
  key?: TableRowKey;
  onCell?: TableColumn<RecordType>['onCell'];
  onChange?: (selectedRowKeys?: TableRowKey[], selectedRows?: RecordType[]) => void;
  onHeaderCell?: TableColumn<RecordType>['onHeaderCell'];
  onSelect?: (
    record?: RecordType,
    selected?: boolean,
    selectedRows?: RecordType[],
    nativeEvent?: MouseEvent,
  ) => void;
  onSelectAll?: (
    selected?: boolean,
    selectedRows?: RecordType[],
    changedRows?: RecordType[],
  ) => void;
  renderCell?: (args: TableRowSelectionRenderCellArgs<RecordType>) => VNodeChild;
  selectedRowKeys?: TableRowKey[];
  shouldCellUpdate?: TableColumn<RecordType>['shouldCellUpdate'];
  title?: VNodeChild;
  type?: 'checkbox' | 'radio';
  width?: string | number;
}

export interface TableRowSelectionRenderCellArgs<RecordType> {
  selected: boolean;
  record: RecordType;
  originNode: VNodeChild;
  inHeader: boolean;
  disabled: boolean;
  indeterminate: boolean;
  index?: number;
  selectRow?: (selected: boolean, event: Event) => void;
  selectAll?: (selected: boolean, event: Event) => void;
}

export interface TableComponents {
  table?: Component | string;
  header?: {
    outer?: Component | string;
    wrapper?: Component | string;
    row?: Component | string;
    cell?: Component | string;
  };
  body?: {
    outer?: Component | string;
    wrapper?: Component | string;
    row?: Component | string;
    cell?: Component | string;
    colgroup?: { wrapper?: Component | string; col?: Component | string };
  };
  footer?: {
    outer?: Component | string;
    wrapper?: Component | string;
    row?: Component | string;
    cell?: Component | string;
  };
}

export interface TableSticky {
  top?: number;
}

export interface TableResizable<RecordType extends Record<string, unknown>> {
  onResize?: (column: TableColumn<RecordType>) => TableColumn<RecordType>;
  onResizeStart?: (column: TableColumn<RecordType>) => TableColumn<RecordType>;
  onResizeStop?: (column: TableColumn<RecordType>) => TableColumn<RecordType>;
}

export interface TableChangeInfo<RecordType extends Record<string, unknown>> {
  pagination?: TablePaginationConfig;
  filters?: Array<{
    dataIndex?: string;
    filteredValue?: unknown[];
    filters?: TableFilter[];
    onFilter?: TableColumn<RecordType>['onFilter'];
  }>;
  sorter?: {
    dataIndex?: string;
    sortOrder?: TableSortOrder;
    sorter?: TableColumn<RecordType>['sorter'];
  };
  extra?: { changeType?: 'sorter' | 'filter' | 'pagination' };
}

export interface TableProps<RecordType extends Record<string, unknown> = Record<string, unknown>> {
  bordered?: boolean;
  childrenRecordName?: string;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  clickGroupedRowToExpand?: boolean;
  columns?: TableColumn<RecordType>[];
  components?: TableComponents;
  dataSource?: RecordType[];
  defaultExpandAllGroupRows?: boolean;
  defaultExpandAllRows?: boolean;
  defaultExpandedRowKeys?: TableRowKey[];
  direction?: TableDirection;
  empty?: VNodeChild;
  expandAllGroupRows?: boolean;
  expandAllRows?: boolean;
  expandCellFixed?: TableFixed;
  expandIcon?: boolean | VNodeChild | ((expanded?: boolean) => VNodeChild);
  expandedRowKeys?: TableRowKey[];
  expandedRowRender?: (record?: RecordType, index?: number, expanded?: boolean) => VNodeChild;
  expandRowByClick?: boolean;
  footer?: VNodeChild | ((pageData?: RecordType[]) => VNodeChild);
  getVirtualizedListRef?: (ref: { current: TableVirtualizedListRef | null }) => void;
  groupBy?: string | ((record: RecordType) => string | number);
  headerStyle?: StyleValue;
  hideExpandedColumn?: boolean;
  id?: string;
  indentSize?: number;
  keepDOM?: boolean;
  loading?: boolean;
  onChange?: (changeInfo: TableChangeInfo<RecordType>) => void;
  onExpand?: (expanded?: boolean, record?: RecordType, event?: MouseEvent) => void;
  onExpandedRowsChange?: (expandedRows?: RecordType[]) => void;
  onGroupedRow?: (record?: RecordType, index?: number) => TableRowAttributes;
  onHeaderRow?: (columns?: TableColumn<RecordType>[], index?: number) => TableRowAttributes;
  onRow?: (
    record?: RecordType,
    index?: number,
    rowStatus?: { disabled?: boolean; selected?: boolean },
  ) => TableRowAttributes;
  pagination?: boolean | TablePaginationConfig;
  prefixCls?: string;
  renderGroupSection?: (
    groupKey?: string | number,
    group?: RecordType[],
  ) => VNodeChild | { children: VNodeChild; [key: string]: unknown };
  renderPagination?: (paginationProps: TablePaginationConfig) => VNodeChild;
  resizable?: boolean | TableResizable<RecordType>;
  rowExpandable?: (record?: RecordType) => boolean;
  rowKey?: string | number | ((record?: RecordType) => TableRowKey);
  rowSelection?: boolean | TableRowSelection<RecordType>;
  rowSpanHover?: boolean;
  scroll?: TableScroll;
  showHeader?: boolean;
  size?: TableSize;
  sticky?: boolean | TableSticky;
  style?: StyleValue;
  title?: VNodeChild | ((pageData?: RecordType[]) => VNodeChild);
  virtualized?: TableVirtualized;
}

export interface TableSlots<RecordType extends Record<string, unknown> = Record<string, unknown>> {
  default?: () => VNodeChild;
  cell?: (props: {
    column: TableColumn<RecordType>;
    record: RecordType;
    rowIndex: number;
    text: unknown;
  }) => VNodeChild;
  empty?: () => VNodeChild;
  expandedRow?: (props: { expanded: boolean; index: number; record: RecordType }) => VNodeChild;
  footer?: (props: { pageData: RecordType[] }) => VNodeChild;
  groupSection?: (props: { group: RecordType[]; groupKey: string | number }) => VNodeChild;
  headerCell?: (props: { column: TableColumn<RecordType> }) => VNodeChild;
  pagination?: (props: { pagination: TablePaginationConfig }) => VNodeChild;
  title?: (props: { pageData: RecordType[] }) => VNodeChild;
}

export interface TableEmits<RecordType extends Record<string, unknown> = Record<string, unknown>> {
  change: [changeInfo: TableChangeInfo<RecordType>];
  expand: [expanded: boolean, record: RecordType, event?: MouseEvent];
  expandedRowsChange: [expandedRows: RecordType[]];
  pageChange: [currentPage: number, pageSize: number];
  select: [record: RecordType, selected: boolean, selectedRows: RecordType[], event?: MouseEvent];
  selectAll: [selected: boolean, selectedRows: RecordType[], changedRows: RecordType[]];
  selectChange: [selectedRowKeys: TableRowKey[], selectedRows: RecordType[]];
}

export interface TableExposed<
  RecordType extends Record<string, unknown> = Record<string, unknown>,
> {
  getCurrentPageData(): RecordType[];
}

export interface TableLocale {
  ascend?: string;
  cancelSort?: string;
  confirmFilter?: string;
  descend?: string;
  emptyText?: VNodeChild;
  pageText?: string;
  resetFilter?: string;
}
