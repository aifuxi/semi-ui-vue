<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type Component,
  type StyleValue,
  type VNodeChild,
} from 'vue';
import { tableCssClasses, tableNumbers, tableStrings } from '@workspace/foundation-integration';

import { configContextKey, DEFAULT_CONFIG_LOCALE, semiGlobal } from '../config-provider';
import Pagination from '../pagination/Pagination.vue';
import TableBody from './TableBody.vue';
import TableHeader from './TableHeader.vue';
import TableNativeElement from './TableNativeElement';
import TableNodeRenderer from './TableNodeRenderer';
import TableSpin from './TableSpin.vue';
import {
  buildHeaderRows,
  fixedOffsets as calculateFixedOffsets,
  flattenColumns,
  flattenRecords,
  getRecordKey,
  normalizeColumn,
  normalizeColumns,
  normalizeColumnVNodes,
  toCssSize,
  type FlatTableRecord,
  type NormalizedTableColumn,
} from './table-utils';
import type {
  TableChangeInfo,
  TableDirection,
  TableEmits,
  TableExposed,
  TableLocale,
  TablePaginationConfig,
  TableProps,
  TableRowKey,
  TableRowSelection,
  TableSlots,
  TableSortOrder,
  TableVirtualizedListRef,
  TableVirtualizedProps,
} from './types';

type RecordType = Record<string, unknown>;

defineOptions({ name: 'Table', inheritAttrs: false });
const props = defineProps<TableProps<RecordType>>();
const emit = defineEmits<TableEmits<RecordType>>();
defineSlots<TableSlots<RecordType>>();

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const injectedConfig = inject(configContextKey, undefined);
const bodyRef = useTemplateRef<HTMLElement>('body');
const headerRef = useTemplateRef<HTMLElement>('header');
const wrapperRef = useTemplateRef<HTMLElement>('wrapper');
const internalSortOrders = shallowRef(new Map<TableRowKey, TableSortOrder>());
const internalFilterValues = shallowRef(new Map<TableRowKey, unknown[]>());
const internalExpandedKeys = shallowRef(new Set<TableRowKey>());
const internalSelectedKeys = shallowRef(new Set<TableRowKey>());
const columnWidths = shallowRef(new Map<TableRowKey, number>());
const currentPage = shallowRef(1);
const pageSize = shallowRef(tableNumbers.DEFAULT_PAGE_SIZE);
const scrollTop = shallowRef(0);
const scrollPosition = shallowRef<'both' | 'left' | 'middle' | 'right'>('both');
let resizeObserver: ResizeObserver | undefined;

function hasRawProp(key: keyof TableProps<RecordType>): boolean {
  const raw = instance?.vnode.props;
  const kebab = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, key) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

function resolveProp<Key extends keyof TableProps<RecordType>>(
  key: Key,
  fallback: NonNullable<TableProps<RecordType>[Key]>,
): NonNullable<TableProps<RecordType>[Key]> {
  if (hasRawProp(key) && props[key] !== undefined) {
    return props[key] as NonNullable<TableProps<RecordType>[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.Table?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<
    TableProps<RecordType>[Key]
  >;
}

const prefix = computed(() => resolveProp('prefixCls', tableCssClasses.PREFIX));
const direction = computed<TableDirection>(
  () => props.direction ?? injectedConfig?.value.direction ?? 'ltr',
);
const dataSource = computed(() => resolveProp('dataSource', [] as RecordType[]));
const childrenRecordName = computed(() => resolveProp('childrenRecordName', 'children'));
const rowKey = computed(() => resolveProp('rowKey', 'key'));
const hideExpandedColumn = computed(() => resolveProp('hideExpandedColumn', true));
const showHeader = computed(() => resolveProp('showHeader', true));
const indentSize = computed(() => resolveProp('indentSize', tableNumbers.DEFAULT_INDENT_WIDTH));
const paginationProp = computed(() => resolveProp('pagination', true));
const rowSelection = computed<false | TableRowSelection<RecordType>>(() => {
  const value = props.rowSelection;
  if (!value) return false;
  return value === true ? {} : value;
});
const locale = computed<TableLocale>(() => {
  const providerLocale = injectedConfig?.value.locale ?? DEFAULT_CONFIG_LOCALE;
  const tableLocale = providerLocale.Table as TableLocale | undefined;
  return (
    tableLocale ?? {
      confirmFilter: providerLocale.code === 'en-US' ? 'OK' : '确定',
      emptyText: providerLocale.code === 'en-US' ? 'No Result' : '暂无数据',
      pageText:
        providerLocale.code === 'en-US'
          ? 'Showing ${currentStart} to ${currentEnd} of ${total}'
          : '显示第 ${currentStart} 条-第 ${currentEnd} 条，共 ${total} 条',
      resetFilter: providerLocale.code === 'en-US' ? 'Reset' : '重置',
    }
  );
});

const declaredColumns = computed<NormalizedTableColumn<RecordType>[]>(() => {
  const propColumns = normalizeColumns(props.columns);
  if (propColumns.length) return propColumns;
  return normalizeColumnVNodes<RecordType>(slots.default?.());
});

function initialQueryState(): void {
  const sorts = new Map<TableRowKey, TableSortOrder>();
  const filters = new Map<TableRowKey, unknown[]>();
  flattenColumns(declaredColumns.value).forEach((column) => {
    if (column.defaultSortOrder) sorts.set(column.key, column.defaultSortOrder);
    if (column.defaultFilteredValue?.length) {
      filters.set(column.key, [...column.defaultFilteredValue]);
    }
  });
  internalSortOrders.value = sorts;
  internalFilterValues.value = filters;
}

function allDataKeys(records: RecordType[] = dataSource.value): TableRowKey[] {
  const output: TableRowKey[] = [];
  const visit = (items: RecordType[]): void => {
    items.forEach((record, index) => {
      output.push(getRecordKey(record, rowKey.value, output.length + index));
      const children = record[childrenRecordName.value];
      if (Array.isArray(children)) visit(children as RecordType[]);
    });
  };
  visit(records);
  return output;
}

function groupKeyFor(record: RecordType): TableRowKey | undefined {
  if (!props.groupBy) return undefined;
  const value = typeof props.groupBy === 'function' ? props.groupBy(record) : record[props.groupBy];
  return typeof value === 'string' || typeof value === 'number' ? value : undefined;
}

function allGroupKeys(records: RecordType[] = dataSource.value): TableRowKey[] {
  return [...new Set(records.map(groupKeyFor).filter((key) => key !== undefined))] as TableRowKey[];
}

function initialExpansionState(): void {
  const keys = new Set<TableRowKey>(props.defaultExpandedRowKeys ?? []);
  if (props.defaultExpandAllRows || props.expandAllRows) {
    allDataKeys().forEach((key) => keys.add(key));
  }
  if (
    props.defaultExpandAllRows ||
    props.expandAllRows ||
    props.defaultExpandAllGroupRows ||
    props.expandAllGroupRows
  ) {
    allGroupKeys().forEach((key) => keys.add(key));
  }
  internalExpandedKeys.value = keys;
}

function initialSelectionState(): void {
  const config = rowSelection.value;
  internalSelectedKeys.value = new Set(
    (config && (config.selectedRowKeys ?? config.defaultSelectedRowKeys)) || [],
  );
}

initialQueryState();
initialExpansionState();
initialSelectionState();

const sortOrders = computed(() => {
  const output = new Map(internalSortOrders.value);
  flattenColumns(declaredColumns.value).forEach((column) => {
    if (Object.prototype.hasOwnProperty.call(column, 'sortOrder')) {
      output.set(column.key, column.sortOrder ?? false);
    }
  });
  return output;
});
const filterValues = computed(() => {
  const output = new Map(internalFilterValues.value);
  flattenColumns(declaredColumns.value).forEach((column) => {
    if (Object.prototype.hasOwnProperty.call(column, 'filteredValue')) {
      output.set(column.key, column.filteredValue ?? []);
    }
  });
  return output;
});
const expandedKeys = computed(() =>
  Array.isArray(props.expandedRowKeys)
    ? new Set(props.expandedRowKeys)
    : internalExpandedKeys.value,
);
const selectedKeys = computed(() => {
  const selected = rowSelection.value && rowSelection.value.selectedRowKeys;
  return Array.isArray(selected) ? new Set(selected) : internalSelectedKeys.value;
});

const displayColumns = computed<NormalizedTableColumn<RecordType>[]>(() => {
  let columns = declaredColumns.value.map((column, index) => normalizeColumn(column, index));
  if (!hideExpandedColumn.value) {
    const expandColumn = normalizeColumn<RecordType>(
      {
        className: `${prefix.value}-column-expand`,
        ...(props.expandCellFixed === undefined ? {} : { fixed: props.expandCellFixed }),
        key: 'column-expand',
        __kind: 'expand',
        ...(props.resizable ? { width: tableNumbers.DEFAULT_WIDTH_COLUMN_EXPAND } : {}),
      },
      0,
    );
    columns =
      expandColumn.fixed === 'right' ? [...columns, expandColumn] : [expandColumn, ...columns];
  }
  if (rowSelection.value && !rowSelection.value.hidden) {
    const selectionColumn = normalizeColumn<RecordType>(
      {
        className: [`${prefix.value}-column-selection`, rowSelection.value.className]
          .filter(Boolean)
          .join(' '),
        ...(rowSelection.value.fixed === undefined ? {} : { fixed: rowSelection.value.fixed }),
        key: rowSelection.value.key ?? tableStrings.DEFAULT_KEY_COLUMN_SELECTION,
        __kind: 'selection',
        ...(rowSelection.value.onCell === undefined ? {} : { onCell: rowSelection.value.onCell }),
        ...(rowSelection.value.onHeaderCell === undefined
          ? {}
          : { onHeaderCell: rowSelection.value.onHeaderCell }),
        ...(rowSelection.value.title === undefined ? {} : { title: rowSelection.value.title }),
        ...(rowSelection.value.width === undefined && !props.resizable
          ? {}
          : {
              width: rowSelection.value.width ?? tableNumbers.DEFAULT_WIDTH_COLUMN_SELECTION,
            }),
      },
      0,
    );
    columns =
      selectionColumn.fixed === 'right'
        ? [...columns, selectionColumn]
        : [selectionColumn, ...columns];
  }
  return columns.map((column) => {
    const width = columnWidths.value.get(column.key) ?? column.width;
    return { ...column, ...(width === undefined ? {} : { __width: width }) };
  });
});
const flatColumns = computed(() => flattenColumns(displayColumns.value));
const headerRows = computed(() => buildHeaderRows(displayColumns.value));
const fixedOffsets = computed(() => calculateFixedOffsets(flatColumns.value));
const anyFixed = computed(() => flatColumns.value.some((column) => Boolean(column.fixed)));

function filterTree(records: RecordType[]): RecordType[] {
  return flattenColumns(declaredColumns.value).reduce((current, column) => {
    const values = filterValues.value.get(column.key) ?? [];
    if (!values.length || !column.onFilter) return current;
    const applyColumn = (items: RecordType[]): RecordType[] =>
      items.flatMap((record) => {
        const children = record[childrenRecordName.value];
        const filteredChildren =
          column.filterChildrenRecord && Array.isArray(children)
            ? applyColumn(children as RecordType[])
            : [];
        if (filteredChildren.length) {
          return [{ ...record, [childrenRecordName.value]: filteredChildren }];
        }
        return values.some((value) => column.onFilter?.(value, record)) ? [record] : [];
      });
    return applyColumn(current);
  }, records);
}

function sortTree(records: RecordType[]): RecordType[] {
  const active = flattenColumns(declaredColumns.value).find(
    (column) => column.sorter && sortOrders.value.get(column.key),
  );
  const output = [...records];
  if (active && typeof active.sorter === 'function') {
    const multiplier = sortOrders.value.get(active.key) === 'descend' ? -1 : 1;
    const sorter = active.sorter;
    output.sort((a, b) => sorter(a, b) * multiplier);
  }
  return output.map((record) => {
    const children = record[childrenRecordName.value];
    return Array.isArray(children) && active?.sortChildrenRecord !== false
      ? { ...record, [childrenRecordName.value]: sortTree(children as RecordType[]) }
      : record;
  });
}

const processedData = computed(() => sortTree(filterTree(dataSource.value)));
const paginationConfig = computed<TablePaginationConfig | false>(() => {
  if (paginationProp.value === false) return false;
  const source = paginationProp.value === true ? {} : paginationProp.value;
  return {
    ...source,
    currentPage: source.currentPage ?? currentPage.value,
    pageSize: source.pageSize ?? pageSize.value,
    total: source.total ?? processedData.value.length,
  };
});
const pageData = computed(() => {
  const pagination = paginationConfig.value;
  if (!pagination) return processedData.value;
  const page = pagination.currentPage ?? 1;
  const size = pagination.pageSize ?? tableNumbers.DEFAULT_PAGE_SIZE;
  return processedData.value.slice((page - 1) * size, page * size);
});
const flatPageRows = computed<FlatTableRecord<RecordType>[]>(() => {
  const options = {
    childrenRecordName: childrenRecordName.value,
    expandedKeys: expandedKeys.value,
    rowKey: rowKey.value,
  };
  if (!props.groupBy) return flattenRecords(pageData.value, options);
  const groups = new Map<TableRowKey, RecordType[]>();
  pageData.value.forEach((record) => {
    const key = groupKeyFor(record);
    if (key === undefined) return;
    const group = groups.get(key) ?? [];
    group.push(record);
    groups.set(key, group);
  });
  const output: FlatTableRecord<RecordType>[] = [];
  const offset = { value: 0 };
  groups.forEach((group, groupKey) => {
    output.push({
      group,
      groupKey,
      index: offset.value,
      key: groupKey,
      level: 0,
      record: group[0] ?? {},
      sectionRow: true,
    });
    if (expandedKeys.value.has(groupKey)) {
      output.push(...flattenRecords(group, options, 1, groupKey, offset));
    }
  });
  return output;
});

interface SelectionEntity {
  childKeys: TableRowKey[];
  key: TableRowKey;
  parentKey?: TableRowKey;
  record: RecordType;
  row: FlatTableRecord<RecordType>;
}

const selectionEntities = computed(() => {
  const entities = new Map<TableRowKey, SelectionEntity>();
  let index = 0;
  const visit = (records: RecordType[], level = 0, parentKey?: TableRowKey): TableRowKey[] =>
    records.map((record) => {
      const key = getRecordKey(record, rowKey.value, index);
      const row: FlatTableRecord<RecordType> = { index, key, level, parentKey, record };
      index += 1;
      const children = record[childrenRecordName.value];
      const childRecords = Array.isArray(children) ? (children as RecordType[]) : [];
      entities.set(key, {
        childKeys: [],
        key,
        ...(parentKey === undefined ? {} : { parentKey }),
        record,
        row,
      });
      const childKeys = childRecords.length ? visit(childRecords, level + 1, key) : [];
      entities.set(key, {
        childKeys,
        key,
        ...(parentKey === undefined ? {} : { parentKey }),
        record,
        row,
      });
      return key;
    });
  visit(pageData.value);
  return entities;
});

function selectionEntityDisabled(entity: SelectionEntity): boolean {
  const config = rowSelection.value;
  return Boolean(config && (config.disabled || config.getCheckboxProps?.(entity.record).disabled));
}

const halfSelectedKeys = computed(() => {
  const half = new Set<TableRowKey>();
  if (!rowSelection.value || rowSelection.value.checkRelation !== 'related') return half;
  const status = (key: TableRowKey): { all: boolean; any: boolean } => {
    const entity = selectionEntities.value.get(key);
    if (!entity) return { all: false, any: false };
    const childStatuses = entity.childKeys.map(status);
    const own = selectedKeys.value.has(key);
    const any = own || childStatuses.some((child) => child.any);
    const all = own && childStatuses.every((child) => child.all);
    if (any && !all) half.add(key);
    return { all, any };
  };
  selectionEntities.value.forEach((entity) => {
    if (entity.parentKey === undefined) status(entity.key);
  });
  return half;
});

function virtualItemHeight(index: number): number {
  const virtual = props.virtualized;
  const itemSize = typeof virtual === 'object' ? virtual.itemSize : undefined;
  if (typeof itemSize === 'function') return itemSize(index, {}) || 53;
  if (typeof itemSize === 'number') return itemSize;
  return props.size === 'small'
    ? tableNumbers.DEFAULT_VIRTUALIZED_ROW_SMALL_HEIGHT
    : props.size === 'middle'
      ? tableNumbers.DEFAULT_VIRTUALIZED_ROW_MIDDLE_HEIGHT
      : tableNumbers.DEFAULT_VIRTUALIZED_ROW_HEIGHT;
}

const virtualRange = computed(() => {
  if (!props.virtualized || !props.scroll?.y) {
    return { bottom: 0, rows: flatPageRows.value, top: 0 };
  }
  const viewport =
    typeof props.scroll.y === 'number'
      ? props.scroll.y
      : tableNumbers.DEFAULT_VIRTUALIZED_BODY_HEIGHT;
  const estimate = virtualItemHeight(0);
  const start = Math.max(0, Math.floor(scrollTop.value / estimate) - 2);
  const count = Math.ceil(viewport / estimate) + 4;
  const end = Math.min(flatPageRows.value.length, start + count);
  const top = flatPageRows.value
    .slice(0, start)
    .reduce((sum, _, index) => sum + virtualItemHeight(index), 0);
  const bottom = flatPageRows.value
    .slice(end)
    .reduce((sum, _, index) => sum + virtualItemHeight(end + index), 0);
  return { bottom, rows: flatPageRows.value.slice(start, end), top };
});

const selectableRows = computed(() =>
  [...selectionEntities.value.values()]
    .filter((entity) => !selectionEntityDisabled(entity))
    .map((entity) => entity.row),
);
const selectedCount = computed(
  () => selectableRows.value.filter((row) => selectedKeys.value.has(row.key)).length,
);

function changeInfo(changeType: 'sorter' | 'filter' | 'pagination'): TableChangeInfo<RecordType> {
  const columns = flattenColumns(declaredColumns.value);
  const sorterColumn = columns.find((column) => sortOrders.value.get(column.key));
  const filters = columns
    .filter((column) => column.filters || column.onFilter)
    .map((column) => ({
      ...(column.dataIndex === undefined ? {} : { dataIndex: column.dataIndex }),
      filteredValue: filterValues.value.get(column.key) ?? [],
      ...(column.filters === undefined ? {} : { filters: column.filters }),
      ...(column.onFilter === undefined ? {} : { onFilter: column.onFilter }),
    }));
  const activeSortOrder = sorterColumn ? sortOrders.value.get(sorterColumn.key) : undefined;
  const sorter = sorterColumn
    ? {
        ...(sorterColumn.dataIndex === undefined ? {} : { dataIndex: sorterColumn.dataIndex }),
        ...(sorterColumn.sorter === undefined ? {} : { sorter: sorterColumn.sorter }),
        ...(activeSortOrder === undefined ? {} : { sortOrder: activeSortOrder }),
      }
    : undefined;
  return {
    extra: { changeType },
    filters,
    ...(paginationConfig.value ? { pagination: paginationConfig.value } : {}),
    ...(sorter ? { sorter } : {}),
  };
}

function notifyChange(type: 'sorter' | 'filter' | 'pagination'): void {
  const info = changeInfo(type);
  props.onChange?.(info);
  emit('change', info);
}

function handleSort(column: NormalizedTableColumn<RecordType>, event: Event): void {
  const current = sortOrders.value.get(column.key) || false;
  const next: TableSortOrder =
    current === false ? 'ascend' : current === 'ascend' ? 'descend' : false;
  if (!Object.prototype.hasOwnProperty.call(column, 'sortOrder')) {
    internalSortOrders.value = new Map(next ? [[column.key, next]] : []);
  }
  currentPage.value = 1;
  notifyChange('sorter');
  resetScroll();
  event.stopPropagation?.();
}

function handleFilter(column: NormalizedTableColumn<RecordType>, values: unknown[]): void {
  if (!Object.prototype.hasOwnProperty.call(column, 'filteredValue')) {
    const next = new Map(internalFilterValues.value);
    next.set(column.key, values);
    internalFilterValues.value = next;
  }
  currentPage.value = 1;
  notifyChange('filter');
  resetScroll();
}

function updateSelection(
  keys: Set<TableRowKey>,
  sourceRow?: FlatTableRecord<RecordType>,
  selected?: boolean,
  event?: Event,
): void {
  if (rowSelection.value && !Array.isArray(rowSelection.value.selectedRowKeys)) {
    internalSelectedKeys.value = keys;
  }
  const rows = [...selectionEntities.value.values()]
    .filter((entity) => keys.has(entity.key))
    .map((entity) => entity.record);
  const keyList = [...keys];
  if (sourceRow && selected !== undefined) {
    if (rowSelection.value) {
      rowSelection.value.onSelect?.(sourceRow.record, selected, rows, event as MouseEvent);
    }
    emit('select', sourceRow.record, selected, rows, event as MouseEvent);
  }
  if (rowSelection.value) rowSelection.value.onChange?.(keyList, rows);
  emit('selectChange', keyList, rows);
}

function handleSelect(row: FlatTableRecord<RecordType>, selected: boolean, event: Event): void {
  event.stopPropagation?.();
  const next =
    rowSelection.value && rowSelection.value.type === 'radio'
      ? new Set<TableRowKey>(selected ? [row.key] : [])
      : new Set(selectedKeys.value);
  if (selected) next.add(row.key);
  else next.delete(row.key);
  if (rowSelection.value && rowSelection.value.checkRelation === 'related') {
    const updateDescendants = (key: TableRowKey): void => {
      const entity = selectionEntities.value.get(key);
      if (!entity) return;
      if (!selectionEntityDisabled(entity)) {
        if (selected) next.add(key);
        else next.delete(key);
      }
      entity.childKeys.forEach(updateDescendants);
    };
    updateDescendants(row.key);
    let parentKey = selectionEntities.value.get(row.key)?.parentKey;
    while (parentKey !== undefined) {
      const parent = selectionEntities.value.get(parentKey);
      if (!parent) break;
      const selectableChildren = parent.childKeys.filter((key) => {
        const child = selectionEntities.value.get(key);
        return child && !selectionEntityDisabled(child);
      });
      if (
        !selectionEntityDisabled(parent) &&
        selectableChildren.length > 0 &&
        selectableChildren.every((key) => next.has(key))
      ) {
        next.add(parent.key);
      } else {
        next.delete(parent.key);
      }
      parentKey = parent.parentKey;
    }
  }
  updateSelection(next, row, selected, event);
}

function handleSelectAll(selected: boolean, event: Event): void {
  event.stopPropagation?.();
  const next = new Set(selectedKeys.value);
  const changedRows: RecordType[] = [];
  selectableRows.value.forEach((row) => {
    const had = next.has(row.key);
    if (selected) next.add(row.key);
    else next.delete(row.key);
    if (had !== selected) changedRows.push(row.record);
  });
  const rows = [...selectionEntities.value.values()]
    .filter((entity) => next.has(entity.key))
    .map((entity) => entity.record);
  if (rowSelection.value) rowSelection.value.onSelectAll?.(selected, rows, changedRows);
  emit('selectAll', selected, rows, changedRows);
  updateSelection(next);
}

function handleExpand(row: FlatTableRecord<RecordType>, event: MouseEvent): void {
  const expanded = !expandedKeys.value.has(row.key);
  const next = new Set(expandedKeys.value);
  if (expanded) next.add(row.key);
  else next.delete(row.key);
  if (!Array.isArray(props.expandedRowKeys)) internalExpandedKeys.value = next;
  props.onExpand?.(expanded, row.record, event);
  emit('expand', expanded, row.record, event);
  const rows = allRecords().filter((record) => next.has(getRecordKey(record, rowKey.value)));
  props.onExpandedRowsChange?.(rows);
  emit('expandedRowsChange', rows);
}

function handleGroupExpand(groupKey: TableRowKey, event: MouseEvent): void {
  const next = new Set(expandedKeys.value);
  if (next.has(groupKey)) next.delete(groupKey);
  else next.add(groupKey);
  if (!Array.isArray(props.expandedRowKeys)) internalExpandedKeys.value = next;
  event.stopPropagation?.();
}

function allRecords(records = dataSource.value): RecordType[] {
  return records.flatMap((record) => {
    const children = record[childrenRecordName.value];
    return [record, ...(Array.isArray(children) ? allRecords(children as RecordType[]) : [])];
  });
}

function handlePageChange(page: number, size: number): void {
  const source = paginationProp.value === true ? {} : paginationProp.value || {};
  if (source.currentPage === undefined) currentPage.value = page;
  if (source.pageSize === undefined) pageSize.value = size;
  source.onChange?.(page, size);
  emit('pageChange', page, size);
  notifyChange('pagination');
  if (props.scroll?.scrollToFirstRowOnChange) resetScroll();
}

function resetScroll(): void {
  nextTick(() => {
    if (props.scroll?.y && bodyRef.value) bodyRef.value.scrollTop = 0;
    else if (props.scroll?.scrollToFirstRowOnChange) {
      wrapperRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

function updateScrollPosition(target = bodyRef.value): void {
  if (!target) return;
  const max = Math.max(0, target.scrollWidth - target.clientWidth);
  if (max <= 1) scrollPosition.value = 'both';
  else if (target.scrollLeft <= 1)
    scrollPosition.value = direction.value === 'rtl' ? 'right' : 'left';
  else if (target.scrollLeft >= max - 1)
    scrollPosition.value = direction.value === 'rtl' ? 'left' : 'right';
  else scrollPosition.value = 'middle';
}

function handleBodyScroll(event: Event): void {
  const target = event.currentTarget as HTMLElement;
  const previousScrollTop = scrollTop.value;
  scrollTop.value = target.scrollTop;
  if (headerRef.value) headerRef.value.scrollLeft = target.scrollLeft;
  updateScrollPosition(target);
  if (props.virtualized && typeof props.virtualized === 'object') {
    const config = props.virtualized as TableVirtualizedProps;
    config.onScroll?.({
      scrollDirection: target.scrollTop >= previousScrollTop ? 'forward' : 'backward',
      scrollOffset: target.scrollTop,
      scrollUpdateWasRequested: false,
    });
  }
}

function handleResize(
  column: NormalizedTableColumn<RecordType>,
  width: number,
  phase: 'start' | 'move' | 'stop',
): void {
  const next = new Map(columnWidths.value);
  next.set(column.key, width);
  columnWidths.value = next;
  if (!props.resizable || props.resizable === true) return;
  const resized = { ...column, width };
  if (phase === 'start') props.resizable.onResizeStart?.(resized);
  else if (phase === 'move') props.resizable.onResize?.(resized);
  else props.resizable.onResizeStop?.(resized);
}

const bodyStyle = computed<StyleValue>(() => ({
  maxHeight: toCssSize(props.scroll?.y),
  overflowX: props.scroll?.x ? 'auto' : undefined,
  overflowY: props.scroll?.y ? 'auto' : undefined,
}));
const tableStyle = computed<StyleValue>(() => ({
  minWidth: toCssSize(props.scroll?.x),
  width: toCssSize(props.scroll?.x),
  tableLayout:
    anyFixed.value || props.scroll?.y || flatColumns.value.some((column) => column.ellipsis)
      ? 'fixed'
      : undefined,
}));
const rootDataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('data-'))),
);
const rootClass = computed(() => [
  `${prefix.value}-wrapper`,
  `${prefix.value}-wrapper-${direction.value}`,
  props.className,
  props.class,
  attrs.class,
]);
const tableWrapClass = computed(() => [
  props.size === 'small' ? `${prefix.value}-small` : undefined,
  props.size === 'middle' ? `${prefix.value}-middle` : undefined,
  props.virtualized ? `${prefix.value}-virtualized` : undefined,
  props.bordered ? `${prefix.value}-bordered` : undefined,
  props.scroll?.y ? `${prefix.value}-fixed-header` : undefined,
  ['both', 'left'].includes(scrollPosition.value)
    ? `${prefix.value}-scroll-position-left`
    : undefined,
  ['both', 'right'].includes(scrollPosition.value)
    ? `${prefix.value}-scroll-position-right`
    : undefined,
]);

const titleContent = computed<VNodeChild>(
  () =>
    slots.title?.({ pageData: pageData.value }) ??
    (hasRawProp('title')
      ? typeof props.title === 'function'
        ? props.title(pageData.value)
        : props.title
      : undefined),
);
const footerContent = computed<VNodeChild>(
  () =>
    slots.footer?.({ pageData: pageData.value }) ??
    (hasRawProp('footer')
      ? typeof props.footer === 'function'
        ? props.footer(pageData.value)
        : props.footer
      : undefined),
);
const emptyContent = computed<VNodeChild>(
  () => slots.empty?.() ?? (hasRawProp('empty') ? props.empty : locale.value.emptyText),
);
const pageInfo = computed(() => {
  const pagination = paginationConfig.value;
  if (!pagination) return '';
  const total = pagination.total ?? 0;
  const start = total
    ? ((pagination.currentPage ?? 1) - 1) *
        (pagination.pageSize ?? tableNumbers.DEFAULT_PAGE_SIZE) +
      1
    : 0;
  const end = Math.min(
    total,
    (pagination.currentPage ?? 1) * (pagination.pageSize ?? tableNumbers.DEFAULT_PAGE_SIZE),
  );
  if (typeof pagination.formatPageText === 'function') {
    return pagination.formatPageText({ currentEnd: end, currentStart: start, total });
  }
  if (pagination.formatPageText === false) return '';
  return (locale.value.pageText ?? '')
    .replace('${currentStart}', String(start))
    .replace('${currentEnd}', String(end))
    .replace('${total}', String(total));
});
const paginationPosition = computed(() =>
  paginationConfig.value ? (paginationConfig.value.position ?? 'bottom') : 'bottom',
);

function renderHeaderCell(args: { column: NormalizedTableColumn<RecordType> }): VNodeChild {
  return slots.headerCell?.({ column: args.column });
}

function renderCell(args: {
  column: NormalizedTableColumn<RecordType>;
  record: RecordType;
  rowIndex: number;
  text: unknown;
}): VNodeChild {
  return slots.cell?.(args);
}

function renderExpandedRow(args: {
  expanded: boolean;
  index: number;
  record: RecordType;
}): VNodeChild {
  return slots.expandedRow?.(args);
}

function renderGroupSection(args: { group: RecordType[]; groupKey: TableRowKey }): VNodeChild {
  const result =
    slots.groupSection?.(args) ??
    props.renderGroupSection?.(args.groupKey, args.group) ??
    args.groupKey;
  if (result && typeof result === 'object' && !('__v_isVNode' in result) && 'children' in result) {
    return result.children as VNodeChild;
  }
  return result as VNodeChild;
}

function tableComponent(
  area: 'header' | 'body',
  part: 'outer' | 'wrapper' | 'row' | 'cell',
): Component | string {
  const configured = props.components?.[area]?.[part] as Component | string | undefined;
  if (configured) return configured;
  if (part === 'wrapper') return area === 'header' ? 'thead' : 'tbody';
  if (part === 'row') return 'tr';
  if (part === 'cell') return area === 'header' ? 'th' : 'td';
  return props.components?.table ?? TableNativeElement;
}

function bodyColgroupComponent(part: 'wrapper' | 'col'): Component | string {
  return props.components?.body?.colgroup?.[part] ?? (part === 'wrapper' ? 'colgroup' : 'col');
}

function virtualRef(): TableVirtualizedListRef {
  return {
    scrollTo(offset) {
      if (bodyRef.value) bodyRef.value.scrollTop = offset;
    },
    scrollToItem(index, align = 'auto') {
      if (!bodyRef.value) return;
      const offset = flatPageRows.value
        .slice(0, index)
        .reduce((sum, _, itemIndex) => sum + virtualItemHeight(itemIndex), 0);
      const height = virtualItemHeight(index);
      const viewport = bodyRef.value.clientHeight;
      bodyRef.value.scrollTop =
        align === 'center'
          ? offset - (viewport - height) / 2
          : align === 'end'
            ? offset - viewport + height
            : offset;
    },
  };
}

defineExpose<TableExposed<RecordType>>({
  getCurrentPageData: () => pageData.value,
});

watch(
  () => rowSelection.value && rowSelection.value.selectedRowKeys,
  (keys) => {
    if (Array.isArray(keys)) internalSelectedKeys.value = new Set(keys);
  },
);
watch(
  () => props.expandedRowKeys,
  (keys) => {
    if (Array.isArray(keys)) internalExpandedKeys.value = new Set(keys);
  },
);
watch(
  () =>
    [
      processedData.value.length,
      paginationConfig.value && paginationConfig.value.pageSize,
    ] as const,
  ([total, configuredSize]) => {
    const size = configuredSize || pageSize.value;
    const maxPage = Math.max(1, Math.ceil(total / size));
    if (currentPage.value > maxPage) currentPage.value = maxPage;
  },
);

onMounted(() => {
  props.getVirtualizedListRef?.({ current: virtualRef() });
  if (
    typeof ResizeObserver !== 'undefined' &&
    bodyRef.value &&
    (anyFixed.value || (showHeader.value && Boolean(props.scroll?.y)))
  ) {
    resizeObserver = new ResizeObserver(() => updateScrollPosition());
    resizeObserver.observe(bodyRef.value);
  }
  updateScrollPosition();
});
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  props.getVirtualizedListRef?.({ current: null });
});
</script>

<template>
  <div
    v-bind="rootDataAttrs"
    :id="props.id"
    ref="wrapper"
    :class="rootClass"
    :data-column-fixed="anyFixed"
    :style="[attrs.style, props.style]"
  >
    <TableSpin :spinning="Boolean(props.loading)">
      <div :class="tableWrapClass">
        <div
          v-if="paginationConfig && ['top', 'both'].includes(paginationPosition)"
          :class="`${prefix}-pagination-outer`"
        >
          <TableNodeRenderer
            v-if="slots.pagination || props.renderPagination"
            :content="
              slots.pagination?.({ pagination: paginationConfig }) ??
              props.renderPagination?.(paginationConfig)
            "
          />
          <template v-else>
            <span :class="`${prefix}-pagination-info`"
              ><TableNodeRenderer :content="pageInfo"
            /></span>
            <span :class="`${prefix}-pagination-wrapper`">
              <Pagination v-bind="paginationConfig" @change="handlePageChange" />
            </span>
          </template>
        </div>
        <div v-if="titleContent != null" :class="`${prefix}-title`" x-semi-prop="title">
          <TableNodeRenderer :content="titleContent" />
        </div>
        <div :class="`${prefix}-container`">
          <div
            v-if="props.scroll?.y && showHeader"
            ref="header"
            :class="[`${prefix}-header`, props.sticky ? `${prefix}-header-sticky` : undefined]"
          >
            <component
              :is="tableComponent('header', 'outer') || props.components?.table || 'table'"
              :class="[prefix, `${prefix}-fixed`]"
              :style="tableStyle"
              role="table"
            >
              <colgroup :class="`${prefix}-colgroup`">
                <col
                  v-for="column in flatColumns"
                  :key="column.key"
                  :class="[`${prefix}-col`, column.className]"
                  :style="{
                    minWidth: toCssSize(column.__width ?? column.width),
                    width: toCssSize(column.__width ?? column.width),
                  }"
                />
              </colgroup>
              <TableHeader
                :component-cell="tableComponent('header', 'cell')"
                :component-row="tableComponent('header', 'row')"
                :component-wrapper="tableComponent('header', 'wrapper')"
                :data-count="selectableRows.length"
                :direction="direction"
                :filter-values="filterValues"
                :fixed-offsets="fixedOffsets"
                :header-style="props.headerStyle"
                :header-rows="headerRows"
                :locale="locale"
                :on-header-row="props.onHeaderRow"
                :prefix-cls="prefix"
                :render-header-cell="renderHeaderCell"
                :resizable="props.resizable"
                :row-selection="rowSelection"
                :selected-count="selectedCount"
                :sort-orders="sortOrders"
                :sticky="props.sticky"
                @filter="handleFilter"
                @resize="handleResize"
                @select-all="handleSelectAll"
                @sort="handleSort"
              />
            </component>
          </div>
          <div ref="body" :class="`${prefix}-body`" :style="bodyStyle" @scroll="handleBodyScroll">
            <component
              :is="tableComponent('body', 'outer') || props.components?.table || 'table'"
              :class="[
                prefix,
                anyFixed || props.scroll?.y || flatColumns.some((column) => column.ellipsis)
                  ? `${prefix}-fixed`
                  : undefined,
              ]"
              :style="tableStyle"
              role="table"
            >
              <component :is="bodyColgroupComponent('wrapper')" :class="`${prefix}-colgroup`">
                <component
                  :is="bodyColgroupComponent('col')"
                  v-for="column in flatColumns"
                  :key="column.key"
                  :class="[`${prefix}-col`, column.className]"
                  :style="{
                    minWidth: toCssSize(column.__width ?? column.width),
                    width: toCssSize(column.__width ?? column.width),
                  }"
                />
              </component>
              <TableHeader
                v-if="!props.scroll?.y && showHeader"
                :component-cell="tableComponent('header', 'cell')"
                :component-row="tableComponent('header', 'row')"
                :component-wrapper="tableComponent('header', 'wrapper')"
                :data-count="selectableRows.length"
                :direction="direction"
                :filter-values="filterValues"
                :fixed-offsets="fixedOffsets"
                :header-style="props.headerStyle"
                :header-rows="headerRows"
                :locale="locale"
                :on-header-row="props.onHeaderRow"
                :prefix-cls="prefix"
                :render-header-cell="renderHeaderCell"
                :resizable="props.resizable"
                :row-selection="rowSelection"
                :selected-count="selectedCount"
                :sort-orders="sortOrders"
                :sticky="props.sticky"
                @filter="handleFilter"
                @resize="handleResize"
                @select-all="handleSelectAll"
                @sort="handleSort"
              />
              <TableBody
                :columns="flatColumns"
                :click-grouped-row-to-expand="props.clickGroupedRowToExpand"
                :component-cell="tableComponent('body', 'cell')"
                :component-row="tableComponent('body', 'row')"
                :component-wrapper="tableComponent('body', 'wrapper')"
                :direction="direction"
                :expanded-keys="expandedKeys"
                :expand-icon="hasRawProp('expandIcon') ? props.expandIcon : undefined"
                :expand-row-by-click="props.expandRowByClick"
                :expanded-row-render="props.expandedRowRender"
                :fixed-offsets="fixedOffsets"
                :half-selected-keys="halfSelectedKeys"
                :hide-expanded-column="hideExpandedColumn"
                :indent-size="indentSize"
                :keep-d-o-m="props.keepDOM"
                :on-row="props.onRow"
                :on-grouped-row="props.onGroupedRow"
                :prefix-cls="prefix"
                :render-cell="renderCell"
                :render-expanded-row="slots.expandedRow ? renderExpandedRow : undefined"
                :render-group-section="renderGroupSection"
                :row-expandable="props.rowExpandable"
                :row-span-hover="props.rowSpanHover"
                :rows="virtualRange.rows"
                :row-selection="rowSelection"
                :selected-keys="selectedKeys"
                :virtual-bottom="virtualRange.bottom"
                :virtual-top="virtualRange.top"
                @expand="handleExpand"
                @group-expand="handleGroupExpand"
                @select="handleSelect"
              />
            </component>
            <div v-if="flatPageRows.length === 0" :class="`${prefix}-placeholder`">
              <div :class="`${prefix}-empty`" x-semi-prop="empty">
                <TableNodeRenderer :content="emptyContent" />
              </div>
            </div>
          </div>
          <div v-if="footerContent != null" :class="`${prefix}-footer`" x-semi-prop="footer">
            <TableNodeRenderer :content="footerContent" />
          </div>
        </div>
        <div
          v-if="paginationConfig && ['bottom', 'both'].includes(paginationPosition)"
          :class="`${prefix}-pagination-outer`"
        >
          <TableNodeRenderer
            v-if="slots.pagination || props.renderPagination"
            :content="
              slots.pagination?.({ pagination: paginationConfig }) ??
              props.renderPagination?.(paginationConfig)
            "
          />
          <template v-else>
            <span :class="`${prefix}-pagination-info`"
              ><TableNodeRenderer :content="pageInfo"
            /></span>
            <span :class="`${prefix}-pagination-wrapper`">
              <Pagination v-bind="paginationConfig" @change="handlePageChange" />
            </span>
          </template>
        </div>
      </div>
    </TableSpin>
  </div>
</template>
