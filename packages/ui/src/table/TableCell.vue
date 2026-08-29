<script setup lang="ts">
/* eslint-disable vue/require-default-prop -- internal cell renderer distinguishes absent expansion, fixed, selection, and slot values. */
import {
  computed,
  h,
  shallowRef,
  watch,
  type Component,
  type StyleValue,
  type VNodeChild,
} from 'vue';

import TableNodeRenderer from './TableNodeRenderer';
import type { NormalizedTableColumn } from './table-utils';
import { getByPath } from './table-utils';
import type { TableCellAttributes, TableDirection, TableRenderReturnObject } from './types';

interface Props {
  column: NormalizedTableColumn<Record<string, unknown>>;
  component?: Component | string | undefined;
  direction: TableDirection;
  expanded?: boolean | undefined;
  expandNode?: VNodeChild | undefined;
  fixedEdge?: boolean | undefined;
  fixedOffset?: number | undefined;
  fixedSide?: 'left' | 'right' | undefined;
  hovered?: boolean | undefined;
  indent?: number | undefined;
  indentSize?: number | undefined;
  prefixCls: string;
  record: Record<string, unknown>;
  rowIndex: number;
  selected?: boolean | undefined;
  selectionNode?: VNodeChild | undefined;
  renderCell?:
    | ((props: {
        column: NormalizedTableColumn<Record<string, unknown>>;
        record: Record<string, unknown>;
        rowIndex: number;
        text: unknown;
      }) => VNodeChild)
    | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  component: 'td',
  fixedEdge: false,
  fixedOffset: 0,
  hovered: false,
  indent: 0,
  indentSize: 20,
});

const renderRecord = shallowRef(props.record);
watch(
  () => props.record,
  (record, previous) => {
    if (!props.column.shouldCellUpdate || props.column.shouldCellUpdate(record, previous)) {
      renderRecord.value = record;
    }
  },
  { flush: 'sync' },
);

const rawText = computed(() => getByPath(renderRecord.value, props.column.dataIndex));
const customCell = computed<TableCellAttributes>(
  () => props.column.onCell?.(renderRecord.value, props.rowIndex) ?? {},
);
const indentNode = computed<VNodeChild>(() =>
  props.indent > 0
    ? h('span', {
        class: [`${props.prefixCls}-row-indent`, `indent-level-${props.indent}`],
        style: { paddingLeft: `${props.indentSize * props.indent}px` },
      })
    : undefined,
);
const renderResult = computed(() => {
  const options = {
    expandIcon: props.expandNode,
    indentText: props.column.useFullRender ? indentNode.value : undefined,
    isHovering: props.hovered,
    selection: props.column.useFullRender ? props.selectionNode : undefined,
  };
  const value = props.column.render
    ? props.column.render(rawText.value, renderRecord.value, props.rowIndex, options)
    : (props.renderCell?.({
        column: props.column,
        record: renderRecord.value,
        rowIndex: props.rowIndex,
        text: rawText.value,
      }) ?? rawText.value);
  if (
    value &&
    typeof value === 'object' &&
    !('__v_isVNode' in value) &&
    'children' in value &&
    'props' in value
  ) {
    return value as TableRenderReturnObject;
  }
  return { children: value as VNodeChild, props: {} } as TableRenderReturnObject;
});
const mergedCell = computed<TableCellAttributes>(() => ({
  ...customCell.value,
  ...renderResult.value.props,
  style: [customCell.value.style, renderResult.value.props.style] as StyleValue,
  class: [
    customCell.value.class,
    customCell.value.className,
    renderResult.value.props.class,
    renderResult.value.props.className,
  ],
}));
const hidden = computed(() => mergedCell.value.colSpan === 0 || mergedCell.value.rowSpan === 0);
const nativeAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(mergedCell.value).filter(
      ([key]) => !['class', 'className', 'style', 'onClick', 'colSpan', 'rowSpan'].includes(key),
    ),
  ),
);
const align = computed(() => {
  if (!props.column.align) return undefined;
  if (props.direction === 'rtl') {
    if (props.column.align === 'left') return 'right';
    if (props.column.align === 'right') return 'left';
  }
  return props.column.align;
});
const cellStyle = computed<StyleValue>(() => {
  const fixedProperty =
    props.direction === 'rtl' ? (props.fixedSide === 'left' ? 'right' : 'left') : props.fixedSide;
  return [
    {
      [fixedProperty ?? 'left']: props.fixedSide ? `${props.fixedOffset}px` : undefined,
      textAlign: align.value,
    },
    mergedCell.value.style,
  ];
});
const cellClass = computed(() => [
  `${props.prefixCls}-row-cell`,
  props.column.className,
  mergedCell.value.class,
  props.column.ellipsis ? `${props.prefixCls}-row-cell-ellipsis` : undefined,
  props.fixedSide ? `${props.prefixCls}-cell-fixed-${props.fixedSide}` : undefined,
  props.fixedSide === 'left' && props.fixedEdge
    ? `${props.prefixCls}-cell-fixed-left-last`
    : undefined,
  props.fixedSide === 'right' && props.fixedEdge
    ? `${props.prefixCls}-cell-fixed-right-first`
    : undefined,
]);
const textTitle = computed(() => {
  const showTitle =
    props.column.ellipsis === true ||
    (typeof props.column.ellipsis === 'object' && props.column.ellipsis.showTitle !== false);
  return showTitle && ['string', 'number'].includes(typeof rawText.value)
    ? String(rawText.value)
    : undefined;
});

function handleClick(event: MouseEvent): void {
  mergedCell.value.onClick?.(event);
}
</script>

<template>
  <component
    :is="props.component"
    v-if="!hidden"
    v-bind="nativeAttrs"
    :class="cellClass"
    :style="cellStyle"
    :colspan="mergedCell.colSpan"
    :rowspan="mergedCell.rowSpan"
    :title="textTitle"
    role="gridcell"
    @click="handleClick"
  >
    <TableNodeRenderer v-if="!props.column.useFullRender && indentNode" :content="indentNode" />
    <TableNodeRenderer
      v-if="!props.column.useFullRender && props.expandNode"
      :content="props.expandNode"
    />
    <TableNodeRenderer :content="renderResult.children" />
  </component>
</template>
