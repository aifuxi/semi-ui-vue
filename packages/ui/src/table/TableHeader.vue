<script setup lang="ts">
/* eslint-disable vue/require-default-prop -- internal header renderer preserves absent callbacks and configuration. */
import { IconCaretdown, IconCaretup, IconFilter } from '@workspace/icons';
import { Button } from '../button';
import { Checkbox, type CheckboxChangeEvent } from '../checkbox';
import { Dropdown } from '../dropdown';
import { Tooltip } from '../tooltip';
import {
  computed,
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
  fixedOffsets: ReadonlyMap<
    string | number,
    { side: 'left' | 'right'; value: number; edge: boolean }
  >;
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
const resizeStartX = shallowRef(0);
const resizeStartWidth = shallowRef(0);
const tempFilterValues = shallowRef(new Map<string | number, unknown[]>());
const filterVisibility = shallowRef(new Map<string | number, boolean>());

function selectedFilters(column: NormalizedTableColumn<Record<string, unknown>>): unknown[] {
  return props.filterValues.get(column.key) ?? [];
}

function displayFilters(column: NormalizedTableColumn<Record<string, unknown>>): unknown[] {
  return column.filterConfirmMode === 'confirm'
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
    clickToHide: column.filterConfirmMode !== 'confirm',
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
  emit('filter', column, displayFilters(column));
  setFilterVisible(column, false);
}

function resetFilter(column: NormalizedTableColumn<Record<string, unknown>>): void {
  setTempFilters(column, [...selectedFilters(column)]);
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
      emit('filter', column, options.filteredValue ?? displayFilters(column));
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
  return h(Checkbox, {
    checked: props.dataCount > 0 && props.selectedCount === props.dataCount,
    disabled: Boolean(props.rowSelection.disabled),
    indeterminate: props.selectedCount > 0 && props.selectedCount < props.dataCount,
    style: { width: '16px' },
    'aria-label': 'Select all rows',
    onChange: selectAll,
  });
}

function fullSorterNode(column: NormalizedTableColumn<Record<string, unknown>>): VNodeChild {
  if (!column.sorter) return undefined;
  const order = props.sortOrders.get(column.key) || false;
  const icon = sorterIconNode(column, order);
  return h(
    'span',
    {
      class: `${props.prefixCls}-column-sorter-wrapper`,
      role: 'button',
      tabindex: -1,
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
  return h('span', { class: `${props.prefixCls}-column-sorter` }, [
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
  const hasFilter = Boolean(column.filters || column.renderFilterDropdown || column.filterDropdown);
  const icon = sorterIconNode(column, order);
  const iconNode =
    shouldShowSortTip(column) && hasFilter
      ? h(Tooltip, { content: nextSortTip(column) }, { default: () => icon })
      : icon;
  const node = h(
    'span',
    {
      class: `${props.prefixCls}-column-sorter-wrapper`,
      role: 'button',
      tabindex: -1,
      'aria-label': `Current sort order is ${order || 'none'}`,
      'aria-roledescription': 'Sort data with this column',
      onClick: (event: Event) => {
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
        { class: `${props.prefixCls}-row-head-title` },
        h(TableNodeRenderer, { content: columnTitle(column) }),
      ),
      iconNode,
    ],
  );
  return shouldShowSortTip(column) && !hasFilter
    ? h(Tooltip, { content: nextSortTip(column) }, { default: () => node })
    : node;
}

function fullFilterNode(column: NormalizedTableColumn<Record<string, unknown>>): VNodeChild {
  if (!(column.filters || column.renderFilterDropdown || column.filterDropdown)) return undefined;
  const content = () => {
    if (column.filterDropdown) return column.filterDropdown;
    if (column.renderFilterDropdown) {
      return column.renderFilterDropdown(renderFilterDropdownProps(column));
    }
    const children: VNodeChild[] = [
      h(TableFilterMenu, {
        filters: column.filters ?? [],
        multiple: column.filterMultiple !== false,
        renderItem: column.renderFilterDropdownItem,
        selected: displayFilters(column),
        onToggle: (filter: TableFilter, event: MouseEvent) => toggleFilter(column, filter, event),
      }),
    ];
    if (column.filterConfirmMode === 'confirm') {
      children.push(
        h(
          'div',
          {
            class: `${props.prefixCls}-column-filter-footer`,
            style: {
              borderTop: '1px solid var(--semi-color-border)',
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-end',
              padding: '8px 12px',
            },
          },
          [
            h(Button, { size: 'small', onClick: () => resetFilter(column) }, () =>
              String(props.locale.resetFilter || 'Reset'),
            ),
            h(Button, { size: 'small', theme: 'solid', onClick: () => confirmFilter(column) }, () =>
              String(props.locale.confirmFilter || 'OK'),
            ),
          ],
        ),
      );
    }
    return h('div', children);
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
          'span',
          {
            class: [
              `${props.prefixCls}-column-filter`,
              selectedFilters(column).length ? 'on' : undefined,
            ],
          },
          [
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

function columnTitle(column: NormalizedTableColumn<Record<string, unknown>>): VNodeChild {
  if (typeof column.title === 'function') {
    return column.title({
      filter: fullFilterNode(column),
      selection: fullSelectionNode(),
      sorter: fullSorterNode(column),
    });
  }
  return props.renderHeaderCell?.({ column }) ?? column.title;
}

function cellCustom(
  cell: TableHeaderCell<Record<string, unknown>>,
  columnIndex: number,
  rowIndex: number,
): Record<string, unknown> {
  return cell.column.onHeaderCell?.(cell.column, columnIndex, rowIndex) ?? {};
}

function cellStyle(
  cell: TableHeaderCell<Record<string, unknown>>,
  columnIndex: number,
  rowIndex: number,
): StyleValue {
  const custom = cellCustom(cell, columnIndex, rowIndex);
  const fixed = props.fixedOffsets.get(cell.column.key);
  const property =
    props.direction === 'rtl' ? (fixed?.side === 'left' ? 'right' : 'left') : fixed?.side;
  return [
    props.headerStyle,
    {
      [property ?? 'left']: fixed ? `${fixed.value}px` : undefined,
      textAlign: cell.column.align,
    },
    custom.style as StyleValue,
  ];
}

function cellClass(
  cell: TableHeaderCell<Record<string, unknown>>,
  columnIndex: number,
  rowIndex: number,
): unknown[] {
  const fixed = props.fixedOffsets.get(cell.column.key);
  const custom = cellCustom(cell, columnIndex, rowIndex);
  return [
    `${props.prefixCls}-row-head`,
    cell.column.className,
    custom.class,
    custom.className,
    cell.column.ellipsis ? `${props.prefixCls}-row-head-ellipsis` : undefined,
    fixed ? `${props.prefixCls}-cell-fixed-${fixed.side}` : undefined,
    fixed?.edge && fixed.side === 'left' ? `${props.prefixCls}-cell-fixed-left-last` : undefined,
    fixed?.edge && fixed.side === 'right' ? `${props.prefixCls}-cell-fixed-right-first` : undefined,
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

function handleHeaderClick(
  cell: TableHeaderCell<Record<string, unknown>>,
  columnIndex: number,
  rowIndex: number,
  event: MouseEvent,
): void {
  const custom = cellCustom(cell, columnIndex, rowIndex);
  (custom.onClick as ((event: MouseEvent) => void) | undefined)?.(event);
}

function startResize(
  column: NormalizedTableColumn<Record<string, unknown>>,
  event: PointerEvent,
): void {
  event.preventDefault();
  event.stopPropagation();
  resizeColumn.value = column;
  resizeStartX.value = event.clientX;
  resizeStartWidth.value =
    typeof column.__width === 'number'
      ? column.__width
      : typeof column.width === 'number'
        ? column.width
        : ((event.currentTarget as HTMLElement).parentElement?.getBoundingClientRect().width ?? 0);
  emit('resize', column, resizeStartWidth.value, 'start');
  window.addEventListener('pointermove', moveResize);
  window.addEventListener('pointerup', stopResize, { once: true });
}

function moveResize(event: PointerEvent): void {
  if (!resizeColumn.value) return;
  const delta = (event.clientX - resizeStartX.value) * (props.direction === 'rtl' ? -1 : 1);
  emit('resize', resizeColumn.value, Math.max(40, resizeStartWidth.value + delta), 'move');
}

function stopResize(event: PointerEvent): void {
  if (resizeColumn.value) {
    const delta = (event.clientX - resizeStartX.value) * (props.direction === 'rtl' ? -1 : 1);
    emit('resize', resizeColumn.value, Math.max(40, resizeStartWidth.value + delta), 'stop');
  }
  resizeColumn.value = null;
  window.removeEventListener('pointermove', moveResize);
}

onBeforeUnmount(() => {
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
      v-bind="headerRowAttrs(rowIndex)"
      :class="headerRowClass(rowIndex)"
      :style="headerRowStyle(rowIndex)"
      role="row"
    >
      <component
        :is="props.componentCell"
        v-for="(cell, columnIndex) in row"
        :key="cell.column.key"
        v-bind="nativeCellAttrs(cell, columnIndex, rowIndex)"
        :class="cellClass(cell, columnIndex, rowIndex)"
        :style="[cellStyle(cell, columnIndex, rowIndex), stickyStyle]"
        :colspan="cell.colSpan"
        :rowspan="cell.rowSpan"
        :aria-sort="
          props.sortOrders.get(cell.column.key) === 'ascend'
            ? 'ascending'
            : props.sortOrders.get(cell.column.key) === 'descend'
              ? 'descending'
              : cell.column.sorter
                ? 'none'
                : undefined
        "
        role="columnheader"
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
            aria-label="Select all rows"
            @change="selectAll"
          />
        </span>
        <TableNodeRenderer
          v-else-if="cell.column.useFullRender && typeof cell.column.title === 'function'"
          :content="columnTitle(cell.column)"
        />
        <span
          v-else-if="
            cell.column.sorter ||
            cell.column.filters ||
            cell.column.renderFilterDropdown ||
            cell.column.filterDropdown
          "
          :class="`${props.prefixCls}-header-column`"
        >
          <TableNodeRenderer v-if="cell.column.sorter" :content="sorterNode(cell.column)" />
          <template v-else>
            <span :class="`${props.prefixCls}-row-head-title`">
              <TableNodeRenderer :content="columnTitle(cell.column)" />
            </span>
          </template>

          <Dropdown
            v-if="
              cell.column.filters || cell.column.renderFilterDropdown || cell.column.filterDropdown
            "
            trigger="click"
            position="bottom"
            :class="`${props.prefixCls}-column-filter-dropdown`"
            v-bind="filterDropdownBindings(cell.column)"
            @update:visible="setFilterVisible(cell.column, $event)"
            @visible-change="handleFilterVisibleChange(cell.column, $event)"
          >
            <span
              :class="[
                `${props.prefixCls}-column-filter`,
                selectedFilters(cell.column).length ? 'on' : undefined,
              ]"
            >
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
            </span>
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
                />
                <div
                  v-if="cell.column.filterConfirmMode === 'confirm'"
                  :class="`${props.prefixCls}-column-filter-footer`"
                  style="
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    padding: 8px 12px;
                    border-top: 1px solid var(--semi-color-border);
                  "
                >
                  <Button size="small" @click="resetFilter(cell.column)">
                    {{ props.locale.resetFilter || 'Reset' }}
                  </Button>
                  <Button size="small" theme="solid" @click="confirmFilter(cell.column)">
                    {{ props.locale.confirmFilter || 'OK' }}
                  </Button>
                </div>
              </template>
            </template>
          </Dropdown>
        </span>
        <TableNodeRenderer v-else :content="columnTitle(cell.column)" />
        <span
          v-if="props.resizable && cell.column.resize !== false"
          class="react-resizable-handle"
          role="separator"
          aria-orientation="vertical"
          @pointerdown="startResize(cell.column, $event)"
        />
      </component>
    </component>
  </component>
</template>
