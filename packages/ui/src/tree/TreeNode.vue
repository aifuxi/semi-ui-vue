<script setup lang="ts">
/* eslint-disable vue/require-default-prop -- internal node props preserve absent VNode/function semantics */
import {
  cloneVNode,
  computed,
  h,
  isVNode,
  onBeforeUnmount,
  shallowRef,
  type VNodeChild,
} from 'vue';
import { IconFile, IconFolder, IconFolderOpen, IconTreeTriangleDown } from '@workspace/icons';

import { Checkbox } from '../checkbox';
import TreeNodeRenderer from './TreeNodeRenderer';
import type {
  TreeExpandAction,
  TreeExpandIconSlotProps,
  TreeFullLabelSlotProps,
  TreeNodeData,
} from './types';

interface InternalTreeNodeProps {
  active?: boolean;
  checked?: boolean;
  children?: TreeNodeData[];
  data: TreeNodeData;
  directory?: boolean;
  disabled?: boolean;
  draggable?: boolean;
  dragOverNodeKey?: string | string[] | null;
  dropPosition?: number | null;
  eventKey: string;
  expandAction?: TreeExpandAction;
  expanded?: boolean;
  expandIcon?: unknown;
  filtered?: boolean;
  halfChecked?: boolean;
  icon?: unknown;
  isEnd?: boolean[];
  isLeaf?: boolean;
  keyword?: string;
  label?: VNodeChild;
  labelEllipsis?: boolean;
  level?: number;
  loaded?: boolean;
  loading?: boolean;
  multiple?: boolean;
  pos?: string;
  renderExpandIcon?: ((props: TreeExpandIconSlotProps) => VNodeChild) | undefined;
  renderFullLabel?: ((props: TreeFullLabelSlotProps) => VNodeChild) | undefined;
  renderIcon?: ((props: { node: TreeNodeData; expanded: boolean }) => VNodeChild) | undefined;
  renderLabel?:
    ((label?: VNodeChild, data?: TreeNodeData, searchWord?: string) => VNodeChild) | undefined;
  selected?: boolean;
  showLine?: boolean;
  style?: Record<string, string | number> | undefined;
  treeDisabled?: boolean;
  onCheck(event: MouseEvent | KeyboardEvent, node: Record<string, unknown>): void;
  onContextMenu(event: MouseEvent, node: Record<string, unknown>): void;
  onDoubleClick(event: MouseEvent, node: Record<string, unknown>): void;
  onDragEnd(event: DragEvent, node: Record<string, unknown>): void;
  onDragEnter(event: DragEvent, node: Record<string, unknown>): void;
  onDragLeave(event: DragEvent, node: Record<string, unknown>): void;
  onDragOver(event: DragEvent, node: Record<string, unknown>): void;
  onDragStart(event: DragEvent, node: Record<string, unknown>): void;
  onDrop(event: DragEvent, node: Record<string, unknown>): void;
  onExpand(event: MouseEvent | KeyboardEvent, node: Record<string, unknown>): void;
  onSelect(event: MouseEvent | KeyboardEvent, node: Record<string, unknown>): void;
}

defineOptions({ name: 'TreeNode', inheritAttrs: false });
const props = withDefaults(defineProps<InternalTreeNodeProps>(), {
  active: false,
  checked: false,
  children: () => [],
  directory: false,
  disabled: false,
  draggable: false,
  dragOverNodeKey: null,
  dropPosition: null,
  expandAction: false,
  expanded: false,
  filtered: false,
  halfChecked: false,
  isEnd: () => [],
  labelEllipsis: false,
  level: 0,
  loaded: false,
  loading: false,
  multiple: false,
  selected: false,
  showLine: false,
  treeDisabled: false,
});
const rootRef = shallowRef<HTMLElement | null>(null);
const lastSelectAt = shallowRef(0);

function setRootRef(element: unknown): void {
  rootRef.value = element instanceof HTMLElement ? element : null;
}

const disabled = computed(() =>
  props.disabled === false ? false : Boolean(props.treeDisabled || props.disabled),
);
const children = computed(() => props.children);
const leaf = computed(() => {
  if (props.isLeaf === false) return false;
  return Boolean(props.isLeaf || children.value.length === 0);
});
const last = computed(() => props.isEnd[props.isEnd.length - 1]);
const dragOver = computed(
  () => props.dragOverNodeKey === props.eventKey && props.dropPosition === 0,
);
const dragGapTop = computed(
  () => props.dragOverNodeKey === props.eventKey && props.dropPosition === -1,
);
const dragGapBottom = computed(
  () => props.dragOverNodeKey === props.eventKey && props.dropPosition === 1,
);
const nodeClasses = computed(() => [
  'semi-tree-option',
  `semi-tree-option-level-${props.level + 1}`,
  props.renderFullLabel ? `semi-tree-option-fullLabel-level-${props.level + 1}` : undefined,
  !props.expanded ? 'semi-tree-option-collapsed' : undefined,
  disabled.value ? 'semi-tree-option-disabled' : undefined,
  props.selected ? 'semi-tree-option-selected' : undefined,
  !props.multiple && props.active ? 'semi-tree-option-active' : undefined,
  props.labelEllipsis ? 'semi-tree-option-ellipsis' : undefined,
  !disabled.value && dragOver.value ? 'semi-tree-option-drag-over' : undefined,
  !disabled.value && props.draggable && !props.renderFullLabel
    ? 'semi-tree-option-draggable'
    : undefined,
  !disabled.value && props.draggable && props.renderFullLabel
    ? 'semi-tree-option-fullLabel-draggable'
    : undefined,
  !disabled.value && dragGapTop.value && props.renderFullLabel
    ? 'semi-tree-option-fullLabel-drag-over-gap-top'
    : undefined,
  !disabled.value && dragGapBottom.value && props.renderFullLabel
    ? 'semi-tree-option-fullLabel-drag-over-gap-bottom'
    : undefined,
  last.value ? 'semi-tree-option-tree-node-last-leaf' : undefined,
]);
const labelClasses = computed(() => [
  'semi-tree-option-label',
  !disabled.value && dragGapTop.value ? 'semi-tree-option-drag-over-gap-top' : undefined,
  !disabled.value && dragGapBottom.value ? 'semi-tree-option-drag-over-gap-bottom' : undefined,
]);
const nodePayload = computed<Record<string, unknown>>(() => ({
  ...props,
  data: props.data,
  children: children.value,
  nodeInstance: rootRef.value,
}));

function stopImmediate(event: Event): void {
  event.stopPropagation();
  (event as Event & { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.();
}

function handleExpand(event: MouseEvent | KeyboardEvent): void {
  stopImmediate(event);
  props.onExpand(event, nodePayload.value);
}

function handleCheck(event: MouseEvent | KeyboardEvent): void {
  if (disabled.value) return;
  stopImmediate(event);
  props.onCheck(event, nodePayload.value);
}

function handleSelect(event: MouseEvent | KeyboardEvent): void {
  if (props.expandAction === 'doubleClick') {
    const now = Date.now();
    if (now - lastSelectAt.value < 500) return;
    lastSelectAt.value = now;
  }
  props.onSelect(event, nodePayload.value);
  if (props.expandAction === 'click') handleExpand(event);
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') handleSelect(event);
}

function handleCheckboxKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') handleCheck(event);
}

function handleDoubleClick(event: MouseEvent): void {
  stopImmediate(event);
  props.onDoubleClick(event, nodePayload.value);
  if (props.expandAction === 'doubleClick') handleExpand(event);
}

function handleContextMenu(event: MouseEvent): void {
  props.onContextMenu(event, nodePayload.value);
}

function handleDrag(
  name: 'start' | 'enter' | 'over' | 'leave' | 'end' | 'drop',
  event: DragEvent,
): void {
  if (!props.draggable) return;
  if (name === 'enter' || name === 'over' || name === 'drop') event.preventDefault();
  event.stopPropagation();
  const payload = nodePayload.value;
  if (name === 'start') {
    props.onDragStart(event, payload);
    try {
      event.dataTransfer?.setData('text/plain', '');
    } catch {
      /* browser compatibility */
    }
  } else if (name === 'enter') props.onDragEnter(event, payload);
  else if (name === 'over') props.onDragOver(event, payload);
  else if (name === 'leave') props.onDragLeave(event, payload);
  else if (name === 'end') props.onDragEnd(event, payload);
  else props.onDrop(event, payload);
}

const defaultExpandIcon = computed<VNodeChild>(() => {
  if (props.loading) {
    return h('span', { class: 'semi-tree-option-spin-icon', 'aria-label': 'loading' }, [
      h('svg', { class: 'semi-icon semi-spin-icon', viewBox: '0 0 16 16', 'aria-hidden': 'true' }, [
        h('circle', {
          cx: 8,
          cy: 8,
          r: 6,
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
        }),
      ]),
    ]);
  }
  if (leaf.value) {
    return props.showLine
      ? h('span', { class: 'semi-tree-option-switcher' }, [
          h('span', { class: 'semi-tree-option-switcher-leaf-line' }),
        ])
      : h('span', { class: 'semi-tree-option-empty-icon' });
  }
  const iconProps: TreeExpandIconSlotProps = {
    className: 'semi-tree-option-expand-icon',
    expanded: props.expanded,
    onClick: handleExpand,
  };
  const expandIcon = props.expandIcon as
    VNodeChild | ((props: TreeExpandIconSlotProps) => VNodeChild) | undefined;
  const custom =
    props.renderExpandIcon?.(iconProps) ??
    (typeof expandIcon === 'function' ? expandIcon(iconProps) : expandIcon);
  if (custom !== undefined && custom !== null) {
    return isVNode(custom)
      ? cloneVNode(custom, {
          class: [custom.props?.class, iconProps.className],
          onClick: handleExpand,
        })
      : custom;
  }
  return h(IconTreeTriangleDown, {
    role: 'button',
    ariaLabel: `${props.expanded ? 'Expand' : 'Collapse'} the tree item`,
    class: iconProps.className,
    size: 'small',
    onClick: handleExpand,
  });
});

const itemIcon = computed<VNodeChild>(() => {
  const fromSlot = props.renderIcon?.({ node: props.data, expanded: props.expanded });
  if (fromSlot !== undefined) return fromSlot;
  if (props.data.icon !== undefined) return props.data.icon;
  const icon = props.icon as
    VNodeChild | ((props: Record<string, unknown>) => VNodeChild) | undefined;
  if (typeof icon === 'function') return icon(nodePayload.value);
  if (icon !== undefined) return icon;
  if (!props.directory) return undefined;
  if (leaf.value) return h(IconFile, { class: 'semi-tree-option-item-icon' });
  return h(props.expanded ? IconFolderOpen : IconFolder, { class: 'semi-tree-option-item-icon' });
});

function highlightedLabel(label: string): VNodeChild {
  const keyword = props.keyword ?? '';
  if (!props.filtered || !keyword) return label;
  const lower = label.toLowerCase();
  const needle = keyword.toLowerCase();
  const nodes: VNodeChild[] = [];
  let cursor = 0;
  while (cursor < label.length) {
    const index = lower.indexOf(needle, cursor);
    if (index < 0) {
      nodes.push(label.slice(cursor));
      break;
    }
    if (index > cursor) nodes.push(label.slice(cursor, index));
    nodes.push(
      h(
        'span',
        { class: 'semi-tree-option-highlight' },
        label.slice(index, index + keyword.length),
      ),
    );
    cursor = index + keyword.length;
  }
  return h('span', nodes);
}

const realLabel = computed<VNodeChild>(() => {
  if (props.renderLabel) return props.renderLabel(props.label, props.data, props.keyword);
  return typeof props.label === 'string' ? highlightedLabel(props.label) : props.label;
});
const fullLabelProps = computed<TreeFullLabelSlotProps>(() => ({
  className: nodeClasses.value.filter(Boolean).join(' '),
  data: props.data,
  level: props.level,
  ...(props.style ? { style: props.style } : {}),
  expandIcon: defaultExpandIcon.value,
  checkStatus: { checked: props.checked, halfChecked: props.halfChecked },
  expandStatus: { expanded: props.expanded, loading: props.loading },
  ...(props.filtered === undefined ? {} : { filtered: props.filtered }),
  ...(props.keyword === undefined ? {} : { searchWord: props.keyword }),
  onClick: handleSelect,
  onContextMenu: handleContextMenu,
  onDoubleClick: handleDoubleClick,
  onExpand: handleExpand,
  onCheck: handleCheck,
}));
const fullLabel = computed(() => {
  const custom = props.renderFullLabel?.(fullLabelProps.value);
  const customRoot = Array.isArray(custom) && custom.length === 1 ? custom[0] : custom;
  if (!isVNode(customRoot)) return customRoot;
  if (props.draggable) {
    return cloneVNode(customRoot, {
      ref: setRootRef,
      draggable: !disabled.value || undefined,
      onDblclick: handleDoubleClick,
      onDragstart: (event: DragEvent) => handleDrag('start', event),
      onDragenter: (event: DragEvent) => handleDrag('enter', event),
      onDragover: (event: DragEvent) => handleDrag('over', event),
      onDragleave: (event: DragEvent) => handleDrag('leave', event),
      onDragend: (event: DragEvent) => handleDrag('end', event),
      onDrop: (event: DragEvent) => handleDrag('drop', event),
    });
  }
  if (props.style) {
    return cloneVNode(customRoot, {
      style: [customRoot.props?.style, props.style],
    });
  }
  return customRoot;
});

onBeforeUnmount(() => {
  lastSelectAt.value = 0;
});
</script>

<template>
  <TreeNodeRenderer v-if="renderFullLabel" :content="fullLabel" />
  <li
    v-else
    :ref="setRootRef"
    :aria-checked="checked"
    :aria-disabled="disabled"
    :aria-expanded="expanded"
    :aria-level="level + 1"
    :aria-posinset="Number(String(nodePayload.pos ?? '').split('-')[level + 1] ?? 0) + 1"
    :aria-selected="selected"
    :aria-setsize="children.length || undefined"
    :class="nodeClasses"
    :data-key="eventKey"
    :draggable="!disabled && draggable ? true : undefined"
    role="treeitem"
    :style="style"
    @click="handleSelect"
    @contextmenu="handleContextMenu"
    @dblclick="handleDoubleClick"
    @keypress="handleKeydown"
    @dragstart="handleDrag('start', $event)"
    @dragenter="handleDrag('enter', $event)"
    @dragover="handleDrag('over', $event)"
    @dragleave="handleDrag('leave', $event)"
    @dragend="handleDrag('end', $event)"
    @drop="handleDrag('drop', $event)"
  >
    <span
      aria-hidden="true"
      :class="[
        'semi-tree-option-indent',
        showLine ? 'semi-tree-option-indent-show-line' : undefined,
      ]"
    >
      <span
        v-for="index in level"
        :key="index"
        :class="[
          'semi-tree-option-indent-unit',
          isEnd[index - 1] ? 'semi-tree-option-indent-unit-end' : undefined,
        ]"
      />
    </span>
    <TreeNodeRenderer :content="defaultExpandIcon" />
    <span :class="labelClasses">
      <div v-if="multiple" role="none" @click="handleCheck" @keypress="handleCheckboxKeydown">
        <Checkbox
          aria-label="Toggle the checked state of checkbox"
          :checked="checked"
          :disabled="disabled"
          :indeterminate="halfChecked"
          :value="eventKey"
        />
      </div>
      <TreeNodeRenderer :content="itemIcon" />
      <span class="semi-tree-option-label-text"><TreeNodeRenderer :content="realLabel" /></span>
    </span>
  </li>
</template>
