<script setup lang="ts">
/* eslint-disable vue/require-default-prop -- internal header renderer preserves absent callbacks and configuration. */
import { IconCaretdown, IconCaretup, IconFilter } from '@aifuxi/semi-icons-vue';
import { Button } from '../button';
import { Space } from '../space';
import isEqual from 'lodash/isEqual';
import { Checkbox, type CheckboxChangeEvent } from '../checkbox';
import { Dropdown } from '../dropdown';
import { Tooltip } from '../tooltip';
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  shallowRef,
  type Component,
  type StyleValue,
  type VNodeChild,
} from 'vue';

import TableNodeRenderer from './TableNodeRenderer';
import TableFilterMenu from './TableFilterMenu.vue';
import type { NormalizedTableColumn, TableHeaderCell } from './table-utils';
import type {
  TableColumn,
  TableDirection,
  TableFilter,
  TableLocale,
  TableResizable,
  TableRowSelection,
  TableSortOrder,
  TableSticky,
} from './types';

interface Props {
  componentCell?: Component | string | undefined;
  componentRow?: Component | string | undefined;
  componentWrapper?: Component | string | undefined;
  dataCount: number;
  direction: TableDirection;
  filterValues: ReadonlyMap<string | number, unknown[]>;
  headerWidths: ReadonlyMap<string | number, number>;
  headerStyle?: StyleValue | undefined;
  headerRows: TableHeaderCell<Record<string, unknown>>[][];
  locale: TableLocale;
  onHeaderRow?:
    | ((
        columns?: TableColumn<Record<string, unknown>>[],
        index?: number,
      ) => Record<string, unknown>)
    | undefined;
  prefixCls: string;
  resizable?: boolean | TableResizable<Record<string, unknown>> | undefined;
  rowSelection?: false | TableRowSelection<Record<string, unknown>> | undefined;
  selectedCount: number;
  sortOrders: ReadonlyMap<string | number, TableSortOrder>;
  sticky?: boolean | TableSticky | undefined;
  renderHeaderCell?:
    ((props: { column: NormalizedTableColumn<Record<string, unknown>> }) => VNodeChild) | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  componentCell: 'th',
  componentRow: 'tr',
  componentWrapper: 'thead',
});
const emit = defineEmits<{
  filter: [column: NormalizedTableColumn<Record<string, unknown>>, values: unknown[]];
  resize: [
    column: NormalizedTableColumn<Record<string, unknown>>,
    width: number,
    phase: 'start' | 'move' | 'stop',
  ];
  selectAll: [selected: boolean, event: Event];
  sort: [column: NormalizedTableColumn<Record<string, unknown>>, event: Event];
}>();

const resizeColumn = shallowRef<NormalizedTableColumn<Record<string, unknown>> | null>(null);
const resizeHandle = shallowRef<HTMLElement | null>(null);
let resizeLastX = 0;
let resizeWidth = 0;
let resizeSlack = 0;
const initialFilterValues = shallowRef(new Map<string | number, unknown[]>());
const tempFilterValues = shallowRef(new Map<string | number, unknown[]>());
const filterVisibility = shallowRef(new Map<string | number, boolean>());

function selectedFilters(column: NormalizedTableColumn<Record<string, unknown>>): unknown[] {
  return props.filterValues.get(column.key) ?? [];
}

function displayFilters(column: NormalizedTableColumn<Record<string, unknown>>): unknown[] {
  return column.filterConfirmMode === 'confirm' || column.renderFilterDropdown
    ? (tempFilterValues.value.get(column.key) ?? selectedFilters(column))
    : selectedFilters(column);
}

function setTempFilters(
  column: NormalizedTableColumn<Record<string, unknown>>,
  values: unknown[],
): void {
  const next = new Map(tempFilterValues.value);
  next.set(column.key, values);
  tempFilterValues.value = next;
}

function filterVisible(
  column: NormalizedTableColumn<Record<string, unknown>>,
): boolean | undefined {
  if (Object.prototype.hasOwnProperty.call(column, 'filterDropdownVisible')) {
    return column.filterDropdownVisible;
  }
  if (column.filterConfirmMode === 'confirm' || column.renderFilterDropdown) {
    return filterVisibility.value.get(column.key) ?? false;
  }
  return undefined;
}

function filterDropdownBindings(
  column: NormalizedTableColumn<Record<string, unknown>>,
): Record<string, unknown> {
  const visible = filterVisible(column);
  return {
    ...column.filterDropdownProps,
    ...(visible === undefined ? {} : { visible }),
  };
}

function setFilterVisible(
  column: NormalizedTableColumn<Record<string, unknown>>,
  visible: boolean,
): void {
  if (!Object.prototype.hasOwnProperty.call(column, 'filterDropdownVisible')) {
    const next = new Map(filterVisibility.value);
    next.set(column.key, visible);
    filterVisibility.value = next;
  }
}

function handleFilterVisibleChange(
  column: NormalizedTableColumn<Record<string, unknown>>,
  visible: boolean,
): void {
  setFilterVisible(column, visible);
  if (visible && column.filterConfirmMode === 'confirm') {
    const snapshots = new Map(initialFilterValues.value);
    snapshots.set(column.key, [...selectedFilters(column)]);
    initialFilterValues.value = snapshots;
    setTempFilters(column, [...selectedFilters(column)]);
  }
  column.onFilterDropdownVisibleChange?.(visible);
}

function toggleFilter(
  column: NormalizedTableColumn<Record<string, unknown>>,
  filter: TableFilter,
  event: MouseEvent,
): void {
  event.stopPropagation();
  const current = displayFilters(column);
  const exists = current.includes(filter.value);
  const next = exists
    ? current.filter((value) => value !== filter.value)
    : column.filterMultiple === false
      ? [filter.value]
      : [...current, filter.value];
  if (column.filterConfirmMode === 'confirm') setTempFilters(column, next);
  else emit('filter', column, next);
}

function confirmFilter(column: NormalizedTableColumn<Record<string, unknown>>): void {
  const values = displayFilters(column);
  if (!isEqual(values, selectedFilters(column))) emit('filter', column, values);
  setFilterVisible(column, false);
}

function resetFilter(column: NormalizedTableColumn<Record<string, unknown>>): void {
  setTempFilters(column, [
    ...(initialFilterValues.value.get(column.key) ?? selectedFilters(column)),
  ]);
}

function clearFilter(column: NormalizedTableColumn<Record<string, unknown>>): void {
  setTempFilters(column, []);
  emit('filter', column, []);
}

function renderFilterDropdownProps(
  column: NormalizedTableColumn<Record<string, unknown>>,
): Record<string, unknown> {
  return {
    clear: (options: { closeDropdown?: boolean } = {}) => {
      clearFilter(column);
      if (options.closeDropdown) setFilterVisible(column, false);
    },
    close: () => setFilterVisible(column, false),
    confirm: (options: { closeDropdown?: boolean; filteredValue?: unknown[] } = {}) => {
      if (options.filteredValue) setTempFilters(column, options.filteredValue);
      const values = options.filteredValue ?? displayFilters(column);
      if (!isEqual(values, selectedFilters(column))) emit('filter', column, values);
      if (options.closeDropdown) setFilterVisible(column, false);
    },
    filters: column.filters,
    reset: () => resetFilter(column),
    setTempFilteredValue: (values: unknown[]) => setTempFilters(column, values),
    tempFilteredValue: displayFilters(column),
  };
}

function fullSelectionNode(): VNodeChild {
  if (!props.rowSelection) return undefined;
  return h(
    'span',
    { class: `${props.prefixCls}-selection-wrap` },
    h(Checkbox, {
      checked: props.dataCount > 0 && props.selectedCount === props.dataCount,
      disabled: Boolean(props.rowSelection.disabled),
      indeterminate: props.selectedCount > 0 && props.selectedCount < props.dataCount,
      style: { width: '16px' },
      ariaLabel: `${props.dataCount > 0 && props.selectedCount === props.dataCount ? 'Deselect' : 'Select'} all rows`,
      onChange: selectAll,
    }),
  );
}

function hasColumnFilter(column: NormalizedTableColumn<Record<string, unknown>>): boolean {
  return Boolean(column.filters?.length || column.renderFilterDropdown || column.filterDropdown);
}

function clickColumnToSort(column: NormalizedTableColumn<Record<string, unknown>>): boolean {
  return Boolean(column.sorter && !hasColumnFilter(column) && !column.useFullRender);
}

function sortAria(column: NormalizedTableColumn<Record<string, unknown>>) {
  const order = props.sortOrders.get(column.key);
  return {
    'aria-label': `Current sort order is ${order ? `${order}ing` : 'none'}`,
    'aria-roledescription': 'Sort data with this column',
  };
}

function fullSorterNode(column: NormalizedTableColumn<Record<string, unknown>>): VNodeChild {
  if (!column.sorter) return undefined;
  const order = props.sortOrders.get(column.key) || false;
  const icon = sorterIconNode(column, order);
  return h(
    'div',
    {
      class: `${props.prefixCls}-column-sorter-wrapper`,
      role: 'button',
      tabindex: -1,
      ...sortAria(column),
      onClick: (event: Event) => emit('sort', column, event),
    },
    [
      shouldShowSortTip(column)
        ? h(Tooltip, { content: nextSortTip(column) }, { default: () => icon })
        : icon,
    ],
  );
}

function sorterIconNode(
  column: NormalizedTableColumn<Record<string, unknown>>,
  order: TableSortOrder,
): VNodeChild {
  if (column.sortIcon) return column.sortIcon({ sortOrder: order });
  return h('div', { class: `${props.prefixCls}-column-sorter` }, [
    h(
      'span',
      { class: [`${props.prefixCls}-column-sorter-up`, order === 'ascend' && 'on'] },
      h(IconCaretup),
    ),
    h(
      'span',
      { class: [`${props.prefixCls}-column-sorter-down`, order === 'descend' && 'on'] },
      h(IconCaretdown),
    ),
  ]);
}

function shouldShowSortTip(column: NormalizedTableColumn<Record<string, unknown>>): boolean {
  return (
    column.showSortTip === true &&
    !Object.prototype.hasOwnProperty.call(column, 'sortOrder') &&
    !column.sortIcon
  );
}

function nextSortTip(column: NormalizedTableColumn<Record<string, unknown>>): string {
  const order = props.sortOrders.get(column.key) || false;
  if (order === 'ascend') return props.locale.descend || 'Click to descend';
  if (order === 'descend') return props.locale.cancelSort || 'Cancel sorting';
  return props.locale.ascend || 'Click to ascend';
}

function sorterNode(column: NormalizedTableColumn<Record<string, unknown>>): VNodeChild {
  const order = props.sortOrders.get(column.key) || false;
  const hasFilter = hasColumnFilter(column);
  const icon = sorterIconNode(column, order);
  const iconNode =
    shouldShowSortTip(column) && hasFilter
      ? h(Tooltip, { content: nextSortTip(column) }, { default: () => icon })
      : icon;
  const node = h(
    'div',
    {
      class: `${props.prefixCls}-column-sorter-wrapper`,
      role: 'button',
      tabindex: -1,
      ...sortAria(column),
      onClick: clickColumnToSort(column)
        ? undefined
        : (event: Event) => {
            event.stopPropagation();
            emit('sort', column, event);
          },
      onKeypress: (event: KeyboardEvent) => {
        if (event.key !== 'Enter') return;
        event.stopPropagation();
        emit('sort', column, event);
      },
    },
    [
      h(
        'span',
        { class: `${props.prefixCls}-row-head-title`, title: ellipsisTitle(column, column.title) },
        h(TableNodeRenderer, { content: columnTitle(column) }),
      ),
      iconNode,
    ],
  );
  return node;
}

// Keep the native heading as Tooltip's trigger when the full heading sorts.
const HeaderCellWrapper = defineComponent({
  inheritAttrs: false,
  props: { tooltip: Boolean, content: String },
  setup(wrapperProps, { slots }) {
    return () =>
      wrapperProps.tooltip
        ? h(Tooltip, { content: wrapperProps.content }, slots)
        : slots.default?.();
  },
});

function filterFooter(column: NormalizedTableColumn<Record<string, unknown>>): VNodeChild {
  if (column.filterConfirmMode !== 'confirm') return undefined;
  return h(
    'div',
    {
      style: {
        padding: '8px 12px',
        borderTop: '1px solid var(--semi-color-border)',
        display: 'flex',
        justifyContent: 'flex-end',
      },
    },
    h(Space, null, () => [
      h(Button, { size: 'small', onClick: () => resetFilter(column) }, () =>
        String(props.locale.resetFilter || 'Reset'),
      ),
      h(Button, { size: 'small', theme: 'solid', onClick: () => confirmFilter(column) }, () =>
        String(props.locale.confirmFilter || 'OK'),
      ),
    ]),
  );
}

function fullFilterNode(column: NormalizedTableColumn<Record<string, unknown>>): VNodeChild {
  if (!hasColumnFilter(column)) return undefined;
  const content = () => {
    if (column.filterDropdown) return column.filterDropdown;
    if (column.renderFilterDropdown) {
      return column.renderFilterDropdown(renderFilterDropdownProps(column));
    }
    return h(
      TableFilterMenu,
      {
        filters: column.filters ?? [],
        multiple: column.filterMultiple !== false,
        renderItem: column.renderFilterDropdownItem,
        selected: displayFilters(column),
        onToggle: (filter: TableFilter, event: MouseEvent) => toggleFilter(column, filter, event),
      },
      { footer: () => filterFooter(column) },
    );
  };
  return h(
    Dropdown,
    {
      ...filterDropdownBindings(column),
      class: `${props.prefixCls}-column-filter-dropdown`,
      position: 'bottom',
      trigger: 'click',
      'onUpdate:visible': (visible: boolean) => setFilterVisible(column, visible),
      onVisibleChange: (visible: boolean) => handleFilterVisibleChange(column, visible),
    },
    {
      content,
      default: () =>
        h(
          'div',
          {
            class: [
              `${props.prefixCls}-column-filter`,
              selectedFilters(column).length ? 'on' : undefined,
            ],
          },
          [
            '\u200b',
            typeof column.filterIcon === 'function'
              ? column.filterIcon(selectedFilters(column).length > 0)
              : column.filterIcon && column.filterIcon !== true
                ? column.filterIcon
                : h(IconFilter, {
                    'aria-haspopup': 'listbox',
                    'aria-label': 'Filter data with this column',
                    role: 'button',
                    tabindex: -1,
                  }),
          ],
        ),
    },
  );
}

// Resolve each public title once per reactive change, then reuse the same result for
// content and native title. Function titles may return text or consume query VNodes.
const resolvedColumnTitles = computed(() => {
  const titles = new Map<string | number, VNodeChild>();
  for (const row of props.headerRows)
    for (const { column } of row) {
      const content =
        typeof column.title === 'function'
          ? column.title({
              filter: fullFilterNode(column),
              selection: fullSelectionNode(),
              sorter: fullSorterNode(column),
            })
          : (props.renderHeaderCell?.({ column }) ?? column.title);
      titles.set(column.key, content);
    }
  return titles;
});

function columnTitle(column: NormalizedTableColumn<Record<string, unknown>>): VNodeChild {
  return resolvedColumnTitles.value.get(column.key);
}

function ellipsisTitle(
  column: NormalizedTableColumn<Record<string, unknown>>,
  content: unknown,
): string | undefined {
  if (typeof column.ellipsis === 'object' && column.ellipsis.showTitle === false) return undefined;
  return typeof content === 'string' ? content : undefined;
}

function nativeTitle(column: NormalizedTableColumn<Record<string, unknown>>): string | undefined {
  // Fixed addFnsInColumn wraps non-function query titles before TableHeader checks
  // their final value. The raw string title then belongs on its inner span only.
  if (
    typeof column.title !== 'function' &&
    (column.sorter || column.filters || column.onFilter || column.useFullRender)
  )
    return undefined;
  return ellipsisTitle(column, columnTitle(column));
}

function cellCustom(
  cell: TableHeaderCell<Record<string, unknown>>,
  columnIndex: number,
  rowIndex: number,
): Record<string, unknown> {
  return cell.column.onHeaderCell?.(cell.column, columnIndex, rowIndex) ?? {};
}

function physicalAlign(column: NormalizedTableColumn<Record<string, unknown>>) {
  return props.direction === 'rtl' && column.align !== 'center'
    ? column.align === 'left'
      ? 'right'
      : column.align === 'right'
        ? 'left'
        : undefined
    : column.align;
}

const headerFixedOffsets = computed(() => {
  let columns = props.headerRows[0]?.map((cell) => cell.column) ?? [];
  return props.headerRows.map((_row, rowIndex) => {
    if (rowIndex > 0)
      columns = columns.flatMap((column) => (column.children?.length ? column.children : [column]));
    const widths = columns.map((column) =>
      typeof column.__width === 'number'
        ? column.__width
        : typeof column.width === 'number'
          ? column.width
          : (props.headerWidths.get(column.key) ?? 0),
    );
    const lastLeft = columns
      .filter((column) => column.fixed === true || column.fixed === 'left')
      .at(-1)?.key;
    const firstRight = columns.find((column) => column.fixed === 'right')?.key;
    const total = widths.reduce((sum, width) => sum + width, 0);
    let before = 0;
    const offsets = new Map<
      string | number,
      { side: 'left' | 'right'; value: number; edge: boolean }
    >();
    columns.forEach((column, index) => {
      const width = widths[index]!;
      if (column.fixed === true || column.fixed === 'left')
        offsets.set(column.key, { side: 'left', value: before, edge: column.key === lastLeft });
      else if (column.fixed === 'right')
        offsets.set(column.key, {
          side: 'right',
          value: total - before - width,
          edge: column.key === firstRight,
        });
      before += width;
    });
    return offsets;
  });
});

function cellHidden(
  cell: TableHeaderCell<Record<string, unknown>>,
  columnIndex: number,
  rowIndex: number,
): boolean {
  const { rowSpan, colSpan } = { ...cell, ...cellCustom(cell, columnIndex, rowIndex) };
  return rowSpan === 0 || colSpan === 0;
}

function cellStyle(
  cell: TableHeaderCell<Record<string, unknown>>,
  columnIndex: number,
  rowIndex: number,
): StyleValue {
  const custom = cellCustom(cell, columnIndex, rowIndex);
  const fixed = headerFixedOffsets.value[rowIndex]?.get(cell.column.key);
  const property =
    props.direction === 'rtl' ? (fixed?.side === 'left' ? 'right' : 'left') : fixed?.side;
  return [
    props.headerStyle,
    custom.style as StyleValue,
    {
      ...(fixed ? { position: 'sticky', [property ?? 'left']: `${fixed.value}px` } : {}),
      ...(cell.column.align ? { textAlign: physicalAlign(cell.column) } : {}),
    },
  ];
}

function cellClass(
  cell: TableHeaderCell<Record<string, unknown>>,
  columnIndex: number,
  rowIndex: number,
): unknown[] {
  const fixed = headerFixedOffsets.value[rowIndex]?.get(cell.column.key);
  const custom = cellCustom(cell, columnIndex, rowIndex);
  const side =
    props.direction === 'rtl'
      ? fixed?.side === 'left'
        ? 'right'
        : fixed?.side === 'right'
          ? 'left'
          : undefined
      : fixed?.side;
  return [
    `${props.prefixCls}-row-head`,
    cell.column.className,
    physicalAlign(cell.column)
      ? `${props.prefixCls}-align-${physicalAlign(cell.column)}`
      : undefined,
    custom.class,
    custom.className,
    cell.column.ellipsis ? `${props.prefixCls}-row-head-ellipsis` : undefined,
    clickColumnToSort(cell.column) ? `${props.prefixCls}-row-head-clickSort` : undefined,
    fixed ? `${props.prefixCls}-cell-fixed-${side}` : undefined,
    fixed?.edge && side === 'left' ? `${props.prefixCls}-cell-fixed-left-last` : undefined,
    fixed?.edge && side === 'right' ? `${props.prefixCls}-cell-fixed-right-first` : undefined,
    cell.column.__kind === 'selection' ? `${props.prefixCls}-column-selection` : undefined,
  ];
}

function nativeCellAttrs(
  cell: TableHeaderCell<Record<string, unknown>>,
  columnIndex: number,
  rowIndex: number,
): Record<string, unknown> {
  const custom = cellCustom(cell, columnIndex, rowIndex);
  return Object.fromEntries(
    Object.entries(custom).filter(
      ([key]) => !['class', 'className', 'style', 'onClick'].includes(key),
    ),
  );
}

function headerRowAttrs(rowIndex: number): Record<string, unknown> {
  const custom =
    props.onHeaderRow?.(
      (props.headerRows[rowIndex] ?? []).map((cell) => cell.column),
      rowIndex,
    ) ?? {};
  return Object.fromEntries(
    Object.entries(custom).filter(([key]) => !['class', 'className', 'style'].includes(key)),
  );
}

function headerRowClass(rowIndex: number): unknown[] {
  const custom =
    props.onHeaderRow?.(
      (props.headerRows[rowIndex] ?? []).map((cell) => cell.column),
      rowIndex,
    ) ?? {};
  return [`${props.prefixCls}-row`, custom.class, custom.className];
}

function headerRowStyle(rowIndex: number): StyleValue {
  return props.onHeaderRow?.(
    (props.headerRows[rowIndex] ?? []).map((cell) => cell.column),
    rowIndex,
  )?.style as StyleValue;
}

let headerMouseDownTarget: { tagName?: string; className?: string } | undefined;

function rememberHeaderMouseDown(event: MouseEvent | PointerEvent): void {
  const target = event.target as Element | null;
  headerMouseDownTarget = {
    ...(target?.tagName ? { tagName: target.tagName } : {}),
    ...(typeof target?.className === 'string' ? { className: target.className } : {}),
  };
}

function handleHeaderClick(
  cell: TableHeaderCell<Record<string, unknown>>,
  columnIndex: number,
  rowIndex: number,
  event: MouseEvent,
): void {
  const custom = cellCustom(cell, columnIndex, rowIndex);
  (custom.onClick as ((event: MouseEvent) => void) | undefined)?.(event);
  if (clickColumnToSort(cell.column)) {
    // Pinned Foundation #2802 checks the gesture origin because the final click
    // may target the header rather than the resize handle after a drag.
    if (
      headerMouseDownTarget?.tagName === 'SPAN' &&
      headerMouseDownTarget.className?.includes('react-resizable-handle')
    )
      return;
    headerMouseDownTarget = undefined;
    emit('sort', cell.column, event);
  }
}

function canResize(column: NormalizedTableColumn<Record<string, unknown>>): boolean {
  return Boolean(props.resizable) && typeof column.width === 'number' && column.resize !== false;
}

function startResize(
  column: NormalizedTableColumn<Record<string, unknown>>,
  event: PointerEvent,
): void {
  if (event.button !== 0 || !canResize(column)) return;
  event.stopPropagation();
  window.getSelection()?.removeAllRanges();
  // Keep mouse defaults: the pinned draggable disables its user-select hack.
  rememberHeaderMouseDown(event);
  resizeColumn.value = column;
  resizeHandle.value = event.currentTarget as HTMLElement;
  resizeLastX = resizeLocalX(event);
  resizeSlack = 0;
  resizeWidth =
    typeof column.__width === 'number'
      ? column.__width
      : typeof column.width === 'number'
        ? column.width
        : ((event.currentTarget as HTMLElement).parentElement?.getBoundingClientRect().width ?? 0);
  emit('resize', column, resizeWidth, 'start');
  window.addEventListener('pointermove', moveResize);
  window.addEventListener('pointerup', stopResize, { once: true });
}

function resizeLocalX(event: PointerEvent): number {
  const node = resizeHandle.value;
  if (!node) return event.clientX;
  const parent = (node.offsetParent ?? node.ownerDocument.body) as HTMLElement;
  const left = parent === node.ownerDocument.body ? 0 : parent.getBoundingClientRect().left;
  return event.clientX + parent.scrollLeft - left;
}

function moveResize(event: PointerEvent): void {
  if (!resizeColumn.value) return;
  // react-draggable measures incremental positions in the live offset parent.
  // In RTL the east handle is styled on the left, so a changing column rect
  // contributes to the next delta just as parent scrolling does.
  const x = resizeLocalX(event);
  const delta = x - resizeLastX;
  resizeLastX = x;
  const currentColumn = props.headerRows
    .flat()
    .find((cell) => cell.column.key === resizeColumn.value?.key)?.column;
  const currentWidth = currentColumn?.__width ?? currentColumn?.width;
  const previousWidth = typeof currentWidth === 'number' ? currentWidth : resizeWidth;
  const proposedWidth = previousWidth + delta;
  resizeWidth = Math.max(20, proposedWidth + resizeSlack);
  // Preserve react-resizable's constraint slack: moving back from below the
  // minimum must consume the overshoot before the column grows again.
  resizeSlack += proposedWidth - resizeWidth;
  if (resizeWidth !== previousWidth) emit('resize', resizeColumn.value, resizeWidth, 'move');
}

function stopResize(): void {
  if (resizeColumn.value) emit('resize', resizeColumn.value, resizeWidth, 'stop');
  resizeColumn.value = null;
  resizeHandle.value = null;
  window.removeEventListener('pointermove', moveResize);
}

onBeforeUnmount(() => {
  resizeHandle.value = null;
  if (typeof window !== 'undefined') {
    window.removeEventListener('pointermove', moveResize);
    window.removeEventListener('pointerup', stopResize);
  }
});

const stickyStyle = computed(() => ({
  top: props.sticky && typeof props.sticky === 'object' ? `${props.sticky.top ?? 0}px` : undefined,
}));

function selectAll(event: CheckboxChangeEvent): void {
  emit('selectAll', event.target.checked, event as unknown as Event);
}
</script>

<template>
  <component :is="props.componentWrapper" :class="`${props.prefixCls}-thead`">
    <component
      :is="props.componentRow"
      v-for="(row, rowIndex) in props.headerRows"
      :key="rowIndex"
      :class="headerRowClass(rowIndex)"
      :style="headerRowStyle(rowIndex)"
      :aria-rowindex="rowIndex + 1"
      role="row"
      v-bind="headerRowAttrs(rowIndex)"
    >
      <template v-for="(cell, columnIndex) in row" :key="cell.column.key">
        <HeaderCellWrapper
          v-if="!cellHidden(cell, columnIndex, rowIndex)"
          :tooltip="clickColumnToSort(cell.column) && shouldShowSortTip(cell.column)"
          :content="nextSortTip(cell.column)"
        >
          <component
            :is="props.componentCell"
            :class="[
              cellClass(cell, columnIndex, rowIndex),
              canResize(cell.column) && 'react-resizable',
            ]"
            :style="[cellStyle(cell, columnIndex, rowIndex), stickyStyle]"
            :colspan="cell.colSpan"
            :rowspan="cell.rowSpan"
            :aria-colindex="columnIndex + 1"
            :title="nativeTitle(cell.column)"
            role="columnheader"
            v-bind="nativeCellAttrs(cell, columnIndex, rowIndex)"
            @mousedown="rememberHeaderMouseDown"
            @click="handleHeaderClick(cell, columnIndex, rowIndex, $event)"
          >
            <span
              v-if="cell.column.__kind === 'selection'"
              :class="`${props.prefixCls}-selection-wrap`"
            >
              <Checkbox
                :checked="props.dataCount > 0 && props.selectedCount === props.dataCount"
                :indeterminate="props.selectedCount > 0 && props.selectedCount < props.dataCount"
                :disabled="Boolean(props.rowSelection && props.rowSelection.disabled)"
                :style="{ width: '16px' }"
                :aria-label="`${props.dataCount > 0 && props.selectedCount === props.dataCount ? 'Deselect' : 'Select'} all rows`"
                @change="selectAll"
              />
            </span>
            <TableNodeRenderer
              v-else-if="typeof cell.column.title === 'function'"
              :content="columnTitle(cell.column)"
            />
            <div
              v-else-if="cell.column.sorter || hasColumnFilter(cell.column)"
              :class="`${props.prefixCls}-operate-wrapper`"
            >
              <TableNodeRenderer v-if="cell.column.sorter" :content="sorterNode(cell.column)" />
              <template v-else>
                <span
                  :class="`${props.prefixCls}-row-head-title`"
                  :title="ellipsisTitle(cell.column, cell.column.title)"
                >
                  <TableNodeRenderer :content="columnTitle(cell.column)" />
                </span>
              </template>

              <Dropdown
                v-if="hasColumnFilter(cell.column)"
                trigger="click"
                position="bottom"
                :class="`${props.prefixCls}-column-filter-dropdown`"
                v-bind="filterDropdownBindings(cell.column)"
                @update:visible="setFilterVisible(cell.column, $event)"
                @visible-change="handleFilterVisibleChange(cell.column, $event)"
              >
                <div
                  :class="[
                    `${props.prefixCls}-column-filter`,
                    selectedFilters(cell.column).length ? 'on' : undefined,
                  ]"
                >
                  {{ '\u200b' }}
                  <TableNodeRenderer
                    v-if="typeof cell.column.filterIcon === 'function'"
                    :content="cell.column.filterIcon(selectedFilters(cell.column).length > 0)"
                  />
                  <TableNodeRenderer
                    v-else-if="cell.column.filterIcon && cell.column.filterIcon !== true"
                    :content="cell.column.filterIcon"
                  />
                  <IconFilter
                    v-else
                    role="button"
                    aria-label="Filter data with this column"
                    aria-haspopup="listbox"
                    tabindex="-1"
                  />
                </div>
                <template #content>
                  <TableNodeRenderer
                    v-if="cell.column.filterDropdown"
                    :content="cell.column.filterDropdown"
                  />
                  <TableNodeRenderer
                    v-else-if="cell.column.renderFilterDropdown"
                    :content="
                      cell.column.renderFilterDropdown({
                        ...renderFilterDropdownProps(cell.column),
                      })
                    "
                  />
                  <template v-else>
                    <TableFilterMenu
                      :filters="cell.column.filters || []"
                      :multiple="cell.column.filterMultiple !== false"
                      :render-item="cell.column.renderFilterDropdownItem"
                      :selected="displayFilters(cell.column)"
                      @toggle="(filter, event) => toggleFilter(cell.column, filter, event)"
                    >
                      <template #footer
                        ><TableNodeRenderer :content="filterFooter(cell.column)"
                      /></template>
                    </TableFilterMenu>
                  </template>
                </template>
              </Dropdown>
            </div>
            <span
              v-else-if="cell.column.onFilter || cell.column.filters || cell.column.useFullRender"
              :class="`${props.prefixCls}-row-head-title`"
              :title="ellipsisTitle(cell.column, cell.column.title)"
            >
              <TableNodeRenderer :content="columnTitle(cell.column)" />
            </span>
            <TableNodeRenderer v-else :content="columnTitle(cell.column)" />
            <span
              v-if="canResize(cell.column)"
              class="react-resizable-handle react-resizable-handle-se"
              @pointerdown="startResize(cell.column, $event)"
              @touchstart.prevent
            />
          </component>
        </HeaderCellWrapper>
      </template>
    </component>
  </component>
</template>
