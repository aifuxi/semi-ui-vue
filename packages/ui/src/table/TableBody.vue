<script setup lang="ts">
/* eslint-disable vue/require-default-prop, vue/no-required-prop-with-default -- internal renderer preserves absent callback and VNode semantics. */
import { IconChevronRight } from '@workspace/icons';
import { Checkbox, type CheckboxChangeEvent } from '../checkbox';
import { Radio, type RadioChangeEvent } from '../radio';
import { computed, h, shallowRef, type Component, type StyleValue, type VNodeChild } from 'vue';

import TableCell from './TableCell.vue';
import TableNodeRenderer from './TableNodeRenderer';
import type { FlatTableRecord, NormalizedTableColumn } from './table-utils';
import type { TableDirection, TableRowAttributes, TableRowKey, TableRowSelection } from './types';

interface Props {
  clickGroupedRowToExpand?: boolean | undefined;
  columns: NormalizedTableColumn<Record<string, unknown>>[];
  componentCell?: Component | string | undefined;
  componentRow?: Component | string | undefined;
  componentWrapper?: Component | string | undefined;
  direction: TableDirection;
  expandedKeys: ReadonlySet<TableRowKey>;
  expandIcon?: boolean | VNodeChild | ((expanded?: boolean) => VNodeChild) | undefined;
  expandedRowRender?:
    | ((record?: Record<string, unknown>, index?: number, expanded?: boolean) => VNodeChild)
    | undefined;
  expandRowByClick?: boolean | undefined;
  fixedOffsets: ReadonlyMap<TableRowKey, { side: 'left' | 'right'; value: number; edge: boolean }>;
  halfSelectedKeys: ReadonlySet<TableRowKey>;
  hideExpandedColumn: boolean;
  indentSize: number;
  keepDOM?: boolean | undefined;
  onRow?:
    | ((
        record?: Record<string, unknown>,
        index?: number,
        status?: { disabled?: boolean; selected?: boolean },
      ) => TableRowAttributes)
    | undefined;
  onGroupedRow?:
    ((record?: Record<string, unknown>, index?: number) => TableRowAttributes) | undefined;
  prefixCls: string;
  renderCell?:
    | ((props: {
        column: NormalizedTableColumn<Record<string, unknown>>;
        record: Record<string, unknown>;
        rowIndex: number;
        text: unknown;
      }) => VNodeChild)
    | undefined;
  renderExpandedRow?:
    | ((props: { expanded: boolean; index: number; record: Record<string, unknown> }) => VNodeChild)
    | undefined;
  renderGroupSection?:
    | ((props: { group: Record<string, unknown>[]; groupKey: TableRowKey }) => VNodeChild)
    | undefined;
  rowExpandable?: ((record?: Record<string, unknown>) => boolean) | undefined;
  rows: FlatTableRecord<Record<string, unknown>>[];
  rowSelection?: false | TableRowSelection<Record<string, unknown>> | undefined;
  rowSpanHover?: boolean | undefined;
  selectedKeys: ReadonlySet<TableRowKey>;
  virtualBottom?: number | undefined;
  virtualTop?: number | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  componentCell: 'td',
  componentRow: 'tr',
  componentWrapper: 'tbody',
  indentSize: 20,
  virtualBottom: 0,
  virtualTop: 0,
});
const emit = defineEmits<{
  expand: [row: FlatTableRecord<Record<string, unknown>>, event: MouseEvent];
  groupExpand: [groupKey: TableRowKey, event: MouseEvent];
  select: [row: FlatTableRecord<Record<string, unknown>>, selected: boolean, event: Event];
}>();
const hoveredKeys = shallowRef(new Set<TableRowKey>());

function checkboxProps(row: FlatTableRecord<Record<string, unknown>>) {
  return (props.rowSelection && props.rowSelection.getCheckboxProps?.(row.record)) || {};
}

function rowDisabled(row: FlatTableRecord<Record<string, unknown>>): boolean {
  return Boolean(
    props.rowSelection && (props.rowSelection.disabled || checkboxProps(row).disabled),
  );
}

function rowCustom(row: FlatTableRecord<Record<string, unknown>>): TableRowAttributes {
  return (
    props.onRow?.(row.record, row.index, {
      disabled: rowDisabled(row),
      selected: props.selectedKeys.has(row.key),
    }) ?? {}
  );
}

function rowAttrs(row: FlatTableRecord<Record<string, unknown>>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(rowCustom(row)).filter(
      ([key]) => !['class', 'className', 'style', 'onClick'].includes(key),
    ),
  );
}

function rowClass(row: FlatTableRecord<Record<string, unknown>>): unknown[] {
  const custom = rowCustom(row);
  return [
    `${props.prefixCls}-row`,
    props.selectedKeys.has(row.key) ? `${props.prefixCls}-row-selected` : undefined,
    props.expandedKeys.has(row.key) ? `${props.prefixCls}-row-expanded` : undefined,
    hoveredKeys.value.has(row.key) ? `${props.prefixCls}-row-hovered` : undefined,
    custom.class,
    custom.className,
  ];
}

function handleRowMouseEnter(
  row: FlatTableRecord<Record<string, unknown>>,
  event: MouseEvent,
): void {
  const hovered = new Set<TableRowKey>([row.key]);
  if (props.rowSpanHover) {
    const current = event.currentTarget as HTMLElement;
    const body = current.parentElement;
    const rows = body ? [...body.querySelectorAll<HTMLElement>('[data-row-key]')] : [];
    const currentIndex = rows.indexOf(current);
    rows.forEach((element, sourceIndex) => {
      const spans = [...element.querySelectorAll<HTMLElement>('[rowspan]')].map((cell) =>
        Number(cell.getAttribute('rowspan') || 1),
      );
      const coversCurrent = spans.some(
        (span) => span > 1 && sourceIndex <= currentIndex && sourceIndex + span > currentIndex,
      );
      const coveredByCurrent =
        sourceIndex >= currentIndex &&
        [...current.querySelectorAll<HTMLElement>('[rowspan]')].some(
          (cell) => currentIndex + Number(cell.getAttribute('rowspan') || 1) > sourceIndex,
        );
      if (coversCurrent || coveredByCurrent) {
        const key = element.dataset.rowKey;
        const matched = props.rows.find((candidate) => String(candidate.key) === key);
        if (matched) hovered.add(matched.key);
      }
    });
  }
  hoveredKeys.value = hovered;
}

function clearRowHover(): void {
  hoveredKeys.value = new Set();
}

function hasChildren(row: FlatTableRecord<Record<string, unknown>>): boolean {
  const children = row.record.children;
  return Array.isArray(children) && children.length > 0;
}

function expandable(row: FlatTableRecord<Record<string, unknown>>): boolean {
  return props.rowExpandable
    ? props.rowExpandable(row.record)
    : Boolean(hasChildren(row) || props.expandedRowRender || props.renderExpandedRow);
}

function expandNode(row: FlatTableRecord<Record<string, unknown>>): VNodeChild {
  if (!expandable(row) || props.expandIcon === false) return undefined;
  const expanded = props.expandedKeys.has(row.key);
  const icon =
    typeof props.expandIcon === 'function'
      ? props.expandIcon(expanded)
      : props.expandIcon ||
        h(IconChevronRight, {
          class: expanded
            ? `${props.prefixCls}-expandedIcon-show`
            : `${props.prefixCls}-expandedIcon-hide`,
        });
  return h(
    'span',
    {
      'aria-expanded': expanded,
      'aria-label': 'Expand this row',
      class: `${props.prefixCls}-expand-icon`,
      role: 'button',
      tabindex: -1,
      onClick: (event: MouseEvent) => {
        event.stopPropagation();
        emit('expand', row, event);
      },
      onKeypress: (event: KeyboardEvent) => {
        if (event.key === 'Enter') emit('expand', row, event as unknown as MouseEvent);
      },
    },
    [icon],
  );
}

function selectionNode(row: FlatTableRecord<Record<string, unknown>>): VNodeChild {
  if (!props.rowSelection) return undefined;
  const selected = props.selectedKeys.has(row.key);
  const disabled = rowDisabled(row);
  const select = (checked: boolean, event: Event) => emit('select', row, checked, event);
  const origin =
    props.rowSelection.type === 'radio'
      ? h(Radio as never, {
          ...checkboxProps(row),
          ariaLabel: `Select row ${row.index + 1}`,
          checked: selected,
          disabled,
          style: { width: '16px' },
          onChange: (event: RadioChangeEvent) =>
            select(event.target.checked, event as unknown as Event),
        })
      : h(Checkbox as never, {
          ...checkboxProps(row),
          ariaLabel: `Select row ${row.index + 1}`,
          checked: selected,
          disabled,
          indeterminate: props.halfSelectedKeys.has(row.key),
          style: { width: '16px' },
          onChange: (event: CheckboxChangeEvent) =>
            select(event.target.checked, event as unknown as Event),
        });
  const wrappedOrigin = h(
    'span',
    {
      class: `${props.prefixCls}-selection-wrap`,
    },
    origin,
  );
  return (
    props.rowSelection.renderCell?.({
      disabled,
      inHeader: false,
      indeterminate: props.halfSelectedKeys.has(row.key),
      index: row.index,
      originNode: wrappedOrigin,
      record: row.record,
      selected,
      selectRow: select,
    }) ?? wrappedOrigin
  );
}

function handleRowClick(row: FlatTableRecord<Record<string, unknown>>, event: MouseEvent): void {
  rowCustom(row).onClick?.(event);
  if (props.rowSelection && props.rowSelection.clickRow && !rowDisabled(row)) {
    emit('select', row, !props.selectedKeys.has(row.key), event);
  }
  if (props.rowSelection && props.rowSelection.clickRow) return;
  if (props.expandRowByClick && expandable(row)) emit('expand', row, event);
}

function expandedContent(row: FlatTableRecord<Record<string, unknown>>): VNodeChild {
  const expanded = props.expandedKeys.has(row.key);
  return (
    props.renderExpandedRow?.({ expanded, index: row.index, record: row.record }) ??
    props.expandedRowRender?.(row.record, row.index, expanded)
  );
}

function groupRowCustom(row: FlatTableRecord<Record<string, unknown>>): TableRowAttributes {
  return props.onGroupedRow?.(row.record, row.index) ?? {};
}

function groupRowAttrs(row: FlatTableRecord<Record<string, unknown>>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(groupRowCustom(row)).filter(
      ([key]) => !['class', 'className', 'style', 'onClick'].includes(key),
    ),
  );
}

function handleGroupClick(row: FlatTableRecord<Record<string, unknown>>, event: MouseEvent): void {
  groupRowCustom(row).onClick?.(event);
  if (props.clickGroupedRowToExpand && row.groupKey !== undefined) {
    emit('groupExpand', row.groupKey, event);
  }
}

function groupExpandNode(row: FlatTableRecord<Record<string, unknown>>): VNodeChild {
  const expanded = props.expandedKeys.has(row.key);
  return h(
    'span',
    {
      'aria-expanded': expanded,
      'aria-label': 'Expand this group',
      class: `${props.prefixCls}-expand-icon`,
      role: 'button',
      tabindex: -1,
      onClick: (event: MouseEvent) => {
        event.stopPropagation();
        if (row.groupKey !== undefined) emit('groupExpand', row.groupKey, event);
      },
    },
    h(IconChevronRight, {
      class: expanded
        ? `${props.prefixCls}-expandedIcon-show`
        : `${props.prefixCls}-expandedIcon-hide`,
    }),
  );
}

const columnCount = computed(() => Math.max(1, props.columns.length));
</script>

<template>
  <component :is="props.componentWrapper" :class="`${props.prefixCls}-tbody`">
    <component
      :is="props.componentRow"
      v-if="props.virtualTop > 0"
      :class="`${props.prefixCls}-row`"
      aria-hidden="true"
      ><component
        :is="props.componentCell"
        :colspan="columnCount"
        :style="{ height: `${props.virtualTop}px`, padding: 0, border: 0 }"
    /></component>
    <template v-for="row in props.rows" :key="row.key">
      <component
        :is="props.componentRow"
        v-if="row.sectionRow"
        v-bind="groupRowAttrs(row)"
        :class="[
          `${props.prefixCls}-row`,
          `${props.prefixCls}-row-section`,
          groupRowCustom(row).class,
          groupRowCustom(row).className,
        ]"
        :style="groupRowCustom(row).style as StyleValue"
        :aria-expanded="props.expandedKeys.has(row.key)"
        role="row"
        @click="handleGroupClick(row, $event)"
      >
        <component
          :is="props.componentCell"
          :class="`${props.prefixCls}-row-cell`"
          :colspan="columnCount"
          role="gridcell"
        >
          <TableNodeRenderer :content="groupExpandNode(row)" />
          <TableNodeRenderer
            :content="
              props.renderGroupSection?.({ group: row.group || [], groupKey: row.groupKey! })
            "
          />
        </component>
      </component>
      <component
        :is="props.componentRow"
        v-else
        v-bind="rowAttrs(row)"
        :class="rowClass(row)"
        :style="rowCustom(row).style as StyleValue"
        :data-row-key="row.key"
        :aria-expanded="expandable(row) ? props.expandedKeys.has(row.key) : undefined"
        :aria-level="row.level + 1"
        :aria-rowindex="row.index + 1"
        role="row"
        @click="handleRowClick(row, $event)"
        @mouseenter="handleRowMouseEnter(row, $event)"
        @mouseleave="clearRowHover"
      >
        <TableCell
          v-for="(column, columnIndex) in props.columns"
          :key="column.key"
          :column="column"
          :component="props.componentCell"
          :direction="props.direction"
          :expanded="props.expandedKeys.has(row.key)"
          :expand-node="
            column.__kind === 'expand' ||
            (props.hideExpandedColumn &&
              columnIndex === (props.rowSelection && !props.rowSelection.hidden ? 1 : 0))
              ? expandNode(row)
              : undefined
          "
          :fixed-edge="props.fixedOffsets.get(column.key)?.edge"
          :fixed-offset="props.fixedOffsets.get(column.key)?.value"
          :fixed-side="props.fixedOffsets.get(column.key)?.side"
          :indent="
            props.hideExpandedColumn &&
            columnIndex === (props.rowSelection && !props.rowSelection.hidden ? 1 : 0)
              ? row.level
              : 0
          "
          :indent-size="props.indentSize"
          :prefix-cls="props.prefixCls"
          :record="row.record"
          :render-cell="column.__kind === 'selection' ? () => selectionNode(row) : props.renderCell"
          :row-index="row.index"
          :selected="props.selectedKeys.has(row.key)"
          :selection-node="selectionNode(row)"
          :hovered="hoveredKeys.has(row.key)"
        />
      </component>
      <component
        :is="props.componentRow"
        v-if="
          !row.sectionRow &&
          expandedContent(row) != null &&
          (props.expandedKeys.has(row.key) || props.keepDOM)
        "
        :class="[
          `${props.prefixCls}-row`,
          `${props.prefixCls}-row-expand`,
          !props.expandedKeys.has(row.key) ? `${props.prefixCls}-row-hidden` : undefined,
        ]"
        aria-level="2"
        role="row"
      >
        <component
          :is="props.componentCell"
          :class="`${props.prefixCls}-row-cell`"
          :colspan="columnCount"
          role="gridcell"
          ><div :class="`${props.prefixCls}-expand-inner`">
            <TableNodeRenderer :content="expandedContent(row)" /></div
        ></component>
      </component>
    </template>
    <component
      :is="props.componentRow"
      v-if="props.virtualBottom > 0"
      :class="`${props.prefixCls}-row`"
      aria-hidden="true"
      ><component
        :is="props.componentCell"
        :colspan="columnCount"
        :style="{ height: `${props.virtualBottom}px`, padding: 0, border: 0 }"
    /></component>
  </component>
</template>
