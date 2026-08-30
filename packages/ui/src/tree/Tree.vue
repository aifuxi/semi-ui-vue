<script setup lang="ts">
import {
  computed,
  defineComponent,
  Fragment,
  getCurrentInstance,
  h,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  shallowReactive,
  shallowRef,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type VNode,
  type VNodeChild,
} from 'vue';
import { IconSearch } from '@aifuxi/semi-icons-vue';
import {
  calcTreeCheckedKeys,
  calcTreeDisabledKeys,
  calcTreeExpandedKeys,
  calcTreeExpandedKeysForValues,
  convertTreeDataToEntities,
  convertTreeJsonToData,
  findTreeKeysForValues,
  flattenTreeData,
  normalizeTreeValue,
  TreeFoundation,
  type TreeAdapter,
} from '@workspace/foundation-integration';

import { configContextKey, type ConfigContextValue } from '../config-provider';
import { CheckboxGroup } from '../checkbox';
import { Input, type InputExposed } from '../input';
import TreeNode from './TreeNode.vue';
import TreeNodeMotion from './TreeNodeMotion.vue';
import TreeNodeRenderer from './TreeNodeRenderer';
import type {
  TreeDragEnterProps,
  TreeDragProps,
  TreeDropProps,
  TreeEmits,
  TreeExposed,
  TreeExpandIconSlotProps,
  TreeFullLabelSlotProps,
  TreeNodeData,
  TreeProps,
  TreeSearchSlotProps,
  TreeSlots,
  TreeValue,
} from './types';

defineOptions({ name: 'Tree', inheritAttrs: false });
interface TreeInternalProps extends TreeProps {
  /** Private composition seam used by TreeSelect to preserve the pinned Adapter DOM. */
  treeSelectEmbedded?: boolean;
}
const TreeRoot = defineComponent({
  name: 'TreeRoot',
  inheritAttrs: false,
  props: { embedded: Boolean },
  setup(rootProps, { attrs: rootAttrs, slots: rootSlots }) {
    return () =>
      rootProps.embedded
        ? h(Fragment, null, rootSlots.default?.())
        : h('div', rootAttrs, rootSlots.default?.());
  },
});
const props = withDefaults(defineProps<TreeInternalProps>(), {
  autoExpandParent: false,
  autoExpandWhenDragEnter: true,
  autoMergeValue: true,
  blockNode: true,
  checkRelation: 'related',
  defaultExpandAll: false,
  defaultExpandedKeys: () => [],
  directory: false,
  disabled: false,
  disableStrictly: false,
  draggable: false,
  expandAction: false,
  expandAll: false,
  filterTreeNode: false,
  leafOnly: false,
  motion: true,
  multiple: false,
  onChangeWithObject: false,
  showClear: true,
  showFilteredOnly: false,
  showLine: false,
  treeData: () => [],
  treeNodeFilterProp: 'label',
});
const emit = defineEmits<TreeEmits>();
defineSlots<TreeSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const inputRef = useTemplateRef<InputExposed>('input');
const virtualListRef = useTemplateRef<HTMLElement>('virtualList');
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(
  () =>
    injectedConfig?.value ??
    ({ direction: 'ltr', locale: { code: 'zh-CN' } } as ConfigContextValue),
);

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebab = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

const valueControlled = computed(() => hasRawProp('modelValue') || hasRawProp('value'));
const expandedControlled = computed(() => hasRawProp('expandedKeys'));
const loadedControlled = computed(() => hasRawProp('loadedKeys'));
const searchHidden = computed(() => hasRawProp('searchRender') && props.searchRender === false);
const resolvedExpandIcon = computed(() =>
  hasRawProp('expandIcon') ? props.expandIcon : undefined,
);
const resolvedIcon = computed(() => (hasRawProp('icon') ? props.icon : undefined));
const incomingValue = computed<TreeValue | undefined>(() =>
  hasRawProp('modelValue') ? props.modelValue : props.value,
);
const keyMaps = computed(() => props.keyMaps ?? {});
const childrenName = computed(() => keyMaps.value.children ?? 'children');
const keyName = computed(() => keyMaps.value.key ?? 'key');
const normalizedTreeData = computed<TreeNodeData[]>(() =>
  props.treeDataSimpleJson
    ? (convertTreeJsonToData(props.treeDataSimpleJson) as TreeNodeData[])
    : props.treeData,
);

interface TreeState {
  inputValue: string;
  keyEntities: Record<string, TreeEntity>;
  treeData: TreeNodeData[];
  flattenNodes: TreeFlattenNode[];
  selectedKeys: string[];
  checkedKeys: Set<string>;
  halfCheckedKeys: Set<string>;
  realCheckedKeys: Set<string>;
  motionKeys: Set<string>;
  motionType: string | null;
  expandedKeys: Set<string>;
  filteredKeys: Set<string>;
  filteredExpandedKeys: Set<string>;
  filteredShownKeys: Set<string>;
  prevProps: TreeProps | null;
  loadedKeys: Set<string>;
  loadingKeys: Set<string>;
  cachedFlattenNodes: TreeFlattenNode[] | undefined;
  cachedKeyValuePairs: Record<string, string>;
  disabledKeys: Set<string>;
  dragging: boolean;
  dragNodesKeys: Set<string>;
  dragOverNodeKey: string | string[] | null;
  dropPosition: number | null;
}

interface TreeEntity extends Record<string, unknown> {
  data: TreeNodeData;
  key: string;
}

interface TreeFlattenNode extends Record<string, unknown> {
  data: TreeNodeData;
  icon?: VNodeChild;
  key: string;
  label?: VNodeChild;
}

const state = shallowReactive<TreeState>({
  inputValue: '',
  keyEntities: {},
  treeData: [],
  flattenNodes: [],
  selectedKeys: [],
  checkedKeys: new Set(),
  halfCheckedKeys: new Set(),
  realCheckedKeys: new Set(),
  motionKeys: new Set(),
  motionType: 'hide',
  expandedKeys: new Set(),
  filteredKeys: new Set(),
  filteredExpandedKeys: new Set(),
  filteredShownKeys: new Set(),
  prevProps: null,
  loadedKeys: new Set(props.loadedKeys ?? []),
  loadingKeys: new Set(),
  cachedFlattenNodes: undefined,
  cachedKeyValuePairs: {},
  disabledKeys: new Set(),
  dragging: false,
  dragNodesKeys: new Set(),
  dragOverNodeKey: null,
  dropPosition: null,
});
const cache = new Map<unknown, unknown>();
const dragNode = shallowRef<Record<string, unknown> | null>(null);
const virtualScrollTop = shallowRef(0);
let initialized = false;

function allEntityKeys(entities: Record<string, TreeEntity>): string[] {
  return Object.keys(entities);
}

function syncValueState(value: TreeValue | undefined): void {
  const normalized = normalizeTreeValue(value, props.onChangeWithObject, keyMaps.value);
  const keys = findTreeKeysForValues(normalized, state.cachedKeyValuePairs, props.multiple);
  if (!props.multiple) {
    state.selectedKeys = keys;
    return;
  }
  if (props.checkRelation === 'related') {
    const checked = calcTreeCheckedKeys(keys, state.keyEntities);
    state.checkedKeys = checked.checkedKeys;
    state.halfCheckedKeys = checked.halfCheckedKeys;
  } else {
    state.realCheckedKeys = new Set(keys);
  }
}

function rebuildData(): void {
  const treeData = normalizedTreeData.value;
  const entities = convertTreeDataToEntities(treeData, keyMaps.value);
  state.treeData = treeData;
  state.keyEntities = entities.keyEntities;
  state.cachedKeyValuePairs = entities.valueEntities;
  const sourceValue = valueControlled.value ? incomingValue.value : props.defaultValue;

  if (!initialized) {
    if (expandedControlled.value) {
      state.expandedKeys = calcTreeExpandedKeys(props.expandedKeys ?? [], state.keyEntities, true);
    } else if (props.defaultExpandAll || props.expandAll) {
      state.expandedKeys = new Set(allEntityKeys(state.keyEntities));
    } else if (props.defaultExpandedKeys.length) {
      state.expandedKeys = calcTreeExpandedKeys(props.defaultExpandedKeys, state.keyEntities, true);
    } else if (sourceValue !== undefined) {
      state.expandedKeys = calcTreeExpandedKeysForValues(
        normalizeTreeValue(sourceValue, props.onChangeWithObject, keyMaps.value),
        state.keyEntities,
        props.multiple,
        state.cachedKeyValuePairs,
      );
    }
  } else if (props.expandAll) {
    state.expandedKeys = new Set(allEntityKeys(state.keyEntities));
  } else if (expandedControlled.value) {
    state.expandedKeys = calcTreeExpandedKeys(
      props.expandedKeys ?? [],
      state.keyEntities,
      props.autoExpandParent,
    );
  } else {
    state.expandedKeys = new Set([...state.expandedKeys].filter((key) => key in state.keyEntities));
  }

  syncValueState(
    valueControlled.value
      ? incomingValue.value
      : initialized
        ? currentValue.value
        : props.defaultValue,
  );
  state.disabledKeys =
    props.disableStrictly && props.checkRelation === 'related'
      ? calcTreeDisabledKeys(state.keyEntities, keyMaps.value)
      : new Set();
  state.flattenNodes = flattenTreeData(state.treeData, state.expandedKeys, keyMaps.value);
  initialized = true;
}

const currentValue = computed<TreeValue | undefined>(() => {
  if (valueControlled.value) return incomingValue.value;
  const keys = props.multiple
    ? [...(props.checkRelation === 'related' ? state.checkedKeys : state.realCheckedKeys)]
    : state.selectedKeys;
  if (!keys.length) return props.multiple ? [] : undefined;
  const nodes = keys.map(
    (key) => state.keyEntities[key]?.data ?? { [keyName.value]: key, label: key },
  );
  if (props.onChangeWithObject) return props.multiple ? nodes : nodes[0];
  const values = nodes.map((node) => {
    const value = node[keyMaps.value.value ?? 'value'] ?? node[keyName.value];
    return typeof value === 'string' || typeof value === 'number' ? value : String(value);
  });
  return props.multiple ? values : values[0];
});

type FoundationProps = Record<string, unknown>;
function getFoundationProps(): FoundationProps {
  const output: FoundationProps = {
    ...props,
    keyMaps: keyMaps.value,
    onDragStart: (detail: TreeDragProps) => emit('dragStart', detail),
    onDragEnter: (detail: TreeDragEnterProps) => emit('dragEnter', detail),
    onDragOver: (detail: TreeDragProps) => emit('dragOver', detail),
    onDragLeave: (detail: TreeDragProps) => emit('dragLeave', detail),
    onDragEnd: (detail: TreeDragProps) => emit('dragEnd', detail),
    onDrop: (detail: TreeDropProps) => emit('drop', detail),
    onLoad: (keys: Set<string>, node?: TreeNodeData) => emit('load', keys, node),
  };
  if (valueControlled.value) output.value = incomingValue.value;
  else delete output.value;
  if (!expandedControlled.value) delete output.expandedKeys;
  if (!loadedControlled.value) delete output.loadedKeys;
  return output;
}

const adapter: TreeAdapter<FoundationProps, TreeState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key],
  getProps: getFoundationProps,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  updateInputValue: (value) => {
    state.inputValue = value;
  },
  focusInput: () => inputRef.value?.focus(),
  updateState: (nextState) => {
    Object.assign(state, nextState);
  },
  notifyExpand: (expandedKeys, detail: { expanded: boolean; node: TreeNodeData }) => {
    const keys = [...expandedKeys];
    emit('expand', keys, detail);
    emit('update:expandedKeys', keys);
    if (detail.expanded && props.loadData) void loadNode(detail.node);
  },
  notifySelect: (key, selected, node: TreeNodeData) => emit('select', key, selected, node),
  notifyChange: (value: TreeValue | undefined) => {
    emit('change', value);
    emit('update:value', value);
    emit('update:modelValue', value);
  },
  notifySearch: (input, filteredExpandedKeys) => emit('search', input, filteredExpandedKeys),
  notifyRightClick: (event, node: TreeNodeData) => emit('contextMenu', event, node),
  notifyDoubleClick: (event, node: TreeNodeData) => emit('doubleClick', event, node),
  cacheFlattenNodes: (enabled) => {
    state.cachedFlattenNodes = enabled ? [...state.flattenNodes] : undefined;
  },
  setDragNode: (node: Record<string, unknown>) => {
    dragNode.value = node;
  },
};
const foundation = markRaw(new TreeFoundation<FoundationProps, TreeState>(adapter));

async function loadNode(data: TreeNodeData): Promise<void> {
  await new Promise<void>((resolve) => {
    const next = foundation.handleNodeLoad(state.loadedKeys, state.loadingKeys, data, resolve);
    Object.assign(state, next);
    if (!Object.keys(next).length) resolve();
  });
}

function search(value: string): void {
  foundation.handleInputChange(value);
}

function handleInputChange(value: string): void {
  search(value);
}

function handleNodeSelect(event: MouseEvent | KeyboardEvent, node: Record<string, unknown>): void {
  foundation.handleNodeSelect(event, node);
}
function handleNodeExpand(event: MouseEvent | KeyboardEvent, node: Record<string, unknown>): void {
  foundation.handleNodeExpand(event, node);
}
function handleNodeCheck(event: MouseEvent | KeyboardEvent, node: Record<string, unknown>): void {
  foundation.handleNodeSelect(event, node);
}
function handleNodeContextMenu(event: MouseEvent, node: Record<string, unknown>): void {
  foundation.handleNodeRightClick(event, node);
}
function handleNodeDoubleClick(event: MouseEvent, node: Record<string, unknown>): void {
  foundation.handleNodeDoubleClick(event, node);
}
function handleNodeDragStart(event: DragEvent, node: Record<string, unknown>): void {
  foundation.handleNodeDragStart(event, node);
}
function handleNodeDragEnter(event: DragEvent, node: Record<string, unknown>): void {
  foundation.handleNodeDragEnter(event, node, dragNode.value);
}
function handleNodeDragOver(event: DragEvent, node: Record<string, unknown>): void {
  foundation.handleNodeDragOver(event, node, dragNode.value);
}
function handleNodeDragLeave(event: DragEvent, node: Record<string, unknown>): void {
  foundation.handleNodeDragLeave(event, node);
}
function handleNodeDragEnd(event: DragEvent, node: Record<string, unknown>): void {
  foundation.handleNodeDragEnd(event, node);
}
function handleNodeDrop(event: DragEvent, node: Record<string, unknown>): void {
  foundation.handleNodeDrop(event, node, dragNode.value);
}

const rootClasses = computed(() => [
  'semi-tree-wrapper',
  props.class,
  props.className,
  attrs.class,
]);
const listClasses = computed(() => [
  'semi-tree-option-list',
  props.blockNode ? 'semi-tree-option-list-block' : undefined,
]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const noData = computed(
  () =>
    Object.keys(state.keyEntities).length === 0 ||
    (props.showFilteredOnly && Boolean(state.inputValue) && state.filteredKeys.size === 0),
);
const searchPlaceholder = computed(() => {
  if (props.searchPlaceholder) return props.searchPlaceholder;
  const treeLocale = config.value.locale.Tree as { searchPlaceholder?: string } | undefined;
  return (
    treeLocale?.searchPlaceholder ?? (config.value.locale.code === 'en-US' ? 'Search' : '搜索')
  );
});
const emptyContent = computed<VNodeChild>(() => {
  if (slots.empty) return slots.empty();
  if (props.emptyContent !== undefined) return props.emptyContent;
  const treeLocale = config.value.locale.Tree as { emptyText?: string } | undefined;
  return treeLocale?.emptyText ?? (config.value.locale.code === 'en-US' ? 'No Data' : '暂无数据');
});
const searchSlotProps = computed<TreeSearchSlotProps>(() => ({
  className: 'semi-tree-input',
  placeholder: searchPlaceholder.value,
  prefix: h(IconSearch),
  showClear: props.showClear,
  value: state.inputValue,
  onChange: handleInputChange,
}));
const customSearch = computed<VNodeChild>(
  () =>
    slots.search?.(searchSlotProps.value) ??
    (typeof props.searchRender === 'function'
      ? props.searchRender(searchSlotProps.value)
      : undefined),
);

function renderExpandIcon(slotProps: TreeExpandIconSlotProps): VNodeChild {
  return slots.expandIcon?.(slotProps);
}
function renderIcon(slotProps: { node: TreeNodeData; expanded: boolean }): VNodeChild {
  return slots.icon?.(slotProps);
}
function renderLabel(label?: VNodeChild, data?: TreeNodeData, word?: string): VNodeChild {
  return (
    slots.label?.({ label, node: data ?? {}, searchWord: word }) ??
    props.renderLabel?.(label, data, word) ??
    label
  );
}
function renderFullLabel(slotProps: TreeFullLabelSlotProps): VNodeChild {
  return slots.fullLabel?.(slotProps) ?? props.renderFullLabel?.(slotProps);
}

function childData(node: TreeFlattenNode): TreeNodeData[] {
  const value = node.data?.[childrenName.value];
  return Array.isArray(value) ? value : [];
}
function normalizedNode(node: TreeFlattenNode): Record<string, unknown> | null {
  const internal = foundation.getTreeNodeProps(String(node.key));
  if (!internal) return null;
  const children = childData(node);
  const explicitLeaf = node.data?.[keyMaps.value.isLeaf ?? 'isLeaf'];
  const isLeaf =
    explicitLeaf !== undefined
      ? Boolean(explicitLeaf)
      : props.loadData
        ? Boolean(internal.loaded && children.length === 0)
        : children.length === 0;
  return {
    ...node.data,
    ...node,
    ...internal,
    data: node.data,
    children,
    isLeaf,
    label: node.label,
    icon: node.icon,
    showLine: props.showLine,
    directory: props.directory,
    multiple: props.multiple,
    treeDisabled: props.disabled,
    draggable: props.draggable,
    expandAction: props.expandAction,
    expandIcon: resolvedExpandIcon.value,
    labelEllipsis:
      props.labelEllipsis === undefined ? Boolean(props.virtualize) : props.labelEllipsis,
    dragOverNodeKey: state.dragOverNodeKey,
    dropPosition: state.dropPosition,
  };
}

type MotionNodeEntry = TreeFlattenNode | TreeFlattenNode[];
const motionNodeEntries = computed<MotionNodeEntry[]>(() => {
  if (!props.motion || props.virtualize || state.motionKeys.size === 0) return state.flattenNodes;
  const source =
    state.motionType === 'hide' && state.cachedFlattenNodes
      ? state.cachedFlattenNodes
      : state.flattenNodes;
  const motionNodes = source.filter((node) => state.motionKeys.has(String(node.key)));
  if (motionNodes.length === 0) return state.flattenNodes;
  const firstMotionKey = String(motionNodes[0]!.key);
  const entries = source.filter(
    (node) => !state.motionKeys.has(String(node.key)),
  ) as MotionNodeEntry[];
  const rangeStart = source.findIndex((node) => String(node.key) === firstMotionKey);
  entries.splice(Math.max(0, rangeStart), 0, motionNodes);
  return entries;
});

function handleMotionEnd(): void {
  state.motionKeys = new Set();
  state.motionType = null;
  state.cachedFlattenNodes = undefined;
}

function renderTreeNode(node: TreeFlattenNode, style?: Record<string, string>): VNode | null {
  const internal = normalizedNode(node);
  if (!internal) return null;
  return h(TreeNode, {
    ...internal,
    key: String(node.key),
    data: node.data,
    eventKey: String(node.key),
    icon: resolvedIcon.value,
    style,
    renderExpandIcon: slots.expandIcon ? renderExpandIcon : undefined,
    renderFullLabel: slots.fullLabel || props.renderFullLabel ? renderFullLabel : undefined,
    renderIcon: slots.icon ? renderIcon : undefined,
    renderLabel: slots.label || props.renderLabel ? renderLabel : undefined,
    onCheck: handleNodeCheck,
    onContextMenu: handleNodeContextMenu,
    onDoubleClick: handleNodeDoubleClick,
    onDragEnd: handleNodeDragEnd,
    onDragEnter: handleNodeDragEnter,
    onDragLeave: handleNodeDragLeave,
    onDragOver: handleNodeDragOver,
    onDragStart: handleNodeDragStart,
    onDrop: handleNodeDrop,
    onExpand: handleNodeExpand,
    onSelect: handleNodeSelect,
  });
}

const renderedNodeList = computed<VNodeChild>(() =>
  motionNodeEntries.value.map((entry) => {
    if (!Array.isArray(entry)) return renderTreeNode(entry);
    return h(
      TreeNodeMotion,
      {
        key: `motion-${String(entry[0]?.key ?? 'empty')}`,
        initiallyOpen: state.motionType === 'hide',
        onEnd: handleMotionEnd,
      },
      { default: () => entry.map((node) => renderTreeNode(node)) },
    );
  }),
);

const itemSize = computed(() => props.virtualize?.itemSize ?? 32);
const virtualHeight = computed(() => props.virtualize?.height ?? '100%');
const virtualWidth = computed(() => props.virtualize?.width ?? '100%');
const numericHeight = computed(() =>
  typeof virtualHeight.value === 'number' ? virtualHeight.value : 240,
);
const visibleRange = computed(() => {
  if (!props.virtualize) return { start: 0, end: state.flattenNodes.length };
  const start = Math.max(0, Math.floor(virtualScrollTop.value / itemSize.value) - 2);
  const end = Math.min(
    state.flattenNodes.length,
    Math.ceil((virtualScrollTop.value + numericHeight.value) / itemSize.value) + 2,
  );
  return { start, end };
});
const visibleNodes = computed(() =>
  state.flattenNodes.slice(visibleRange.value.start, visibleRange.value.end),
);
function virtualNodeStyle(index: number): Record<string, string> | undefined {
  if (!props.virtualize) return undefined;
  const absoluteIndex = visibleRange.value.start + index;
  return {
    position: 'absolute',
    top: `${absoluteIndex * itemSize.value}px`,
    width: '100%',
    height: `${itemSize.value}px`,
  };
}
function handleVirtualScroll(event: Event): void {
  virtualScrollTop.value = (event.currentTarget as HTMLElement).scrollTop;
}
function scrollTo(data: {
  key: string;
  align?: 'center' | 'start' | 'end' | 'smart' | 'auto';
}): void {
  if (!props.virtualize || !virtualListRef.value) return;
  const index = state.flattenNodes.findIndex((node) => String(node.key) === data.key);
  if (index < 0) return;
  const list = virtualListRef.value;
  const top = index * itemSize.value;
  const bottom = top + itemSize.value;
  const align = data.align ?? 'center';
  if (
    (align === 'auto' || align === 'smart') &&
    top >= list.scrollTop &&
    bottom <= list.scrollTop + list.clientHeight
  )
    return;
  list.scrollTop =
    align === 'start'
      ? top
      : align === 'end'
        ? bottom - list.clientHeight
        : top - (list.clientHeight - itemSize.value) / 2;
  virtualScrollTop.value = list.scrollTop;
}
function focus(): void {
  inputRef.value?.focus();
}
defineExpose<TreeExposed>({ search, scrollTo, focus });

watch(
  () =>
    [
      props.treeData,
      props.treeDataSimpleJson,
      props.keyMaps,
      props.expandAll,
      props.disableStrictly,
    ] as const,
  rebuildData,
  { deep: true, immediate: true },
);
watch(
  incomingValue,
  (value) => {
    if (valueControlled.value) syncValueState(value);
  },
  { deep: true },
);
watch(
  () => props.expandedKeys,
  (keys) => {
    if (!expandedControlled.value) return;
    state.expandedKeys = calcTreeExpandedKeys(
      keys ?? [],
      state.keyEntities,
      props.autoExpandParent,
    );
    state.flattenNodes = flattenTreeData(state.treeData, state.expandedKeys, keyMaps.value);
  },
  { deep: true },
);
watch(
  () => props.loadedKeys,
  (keys) => {
    if (loadedControlled.value) state.loadedKeys = new Set(keys ?? []);
  },
  { deep: true },
);
watch(
  () => [props.multiple, props.checkRelation, props.onChangeWithObject] as const,
  () => syncValueState(incomingValue.value ?? props.defaultValue),
);
watch(
  () => state.flattenNodes.length,
  () =>
    nextTick(() => {
      virtualScrollTop.value = virtualListRef.value?.scrollTop ?? 0;
    }),
);

onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <TreeRoot
    :embedded="props.treeSelectEmbedded"
    v-bind="dataAttrs"
    :aria-label="
      props.treeSelectEmbedded
        ? undefined
        : (ariaLabel ?? (attrs['aria-label'] as string | undefined))
    "
    :class="props.treeSelectEmbedded ? undefined : rootClasses"
    :style="props.treeSelectEmbedded ? undefined : [props.style, attrs.style]"
  >
    <div
      v-if="props.filterTreeNode && !searchHidden"
      :class="['semi-tree-search-wrapper', searchClassName]"
      :style="searchStyle"
    >
      <TreeNodeRenderer v-if="customSearch !== undefined" :content="customSearch" />
      <Input
        v-else
        ref="input"
        aria-label="Filter Tree"
        class-name="semi-tree-input"
        :model-value="state.inputValue"
        :placeholder="searchPlaceholder"
        :prevent-scroll="preventScroll"
        :show-clear="showClear"
        @change="handleInputChange"
      >
        <template #prefix><IconSearch /></template>
      </Input>
    </div>
    <div
      :aria-multiselectable="noData ? undefined : multiple"
      :class="listClasses"
      :role="noData ? 'none' : 'tree'"
    >
      <ul v-if="noData" class="semi-tree-option semi-tree-option-empty">
        <li class="semi-tree-option-label semi-tree-option-label-empty" x-semi-prop="emptyContent">
          <TreeNodeRenderer :content="emptyContent" />
        </li>
      </ul>
      <template v-else-if="!virtualize">
        <CheckboxGroup
          v-if="multiple"
          direction="vertical"
          :value="[...(checkRelation === 'related' ? state.checkedKeys : state.realCheckedKeys)]"
        >
          <TreeNodeRenderer :content="renderedNodeList" />
        </CheckboxGroup>
        <TreeNodeRenderer v-else :content="renderedNodeList" />
      </template>
      <div
        v-else
        ref="virtualList"
        class="semi-tree-virtual-list"
        :style="{
          direction: config.direction,
          height: typeof virtualHeight === 'number' ? `${virtualHeight}px` : virtualHeight,
          width: typeof virtualWidth === 'number' ? `${virtualWidth}px` : virtualWidth,
          overflow: 'auto',
          position: 'relative',
        }"
        @scroll="handleVirtualScroll"
      >
        <div :style="{ height: `${state.flattenNodes.length * itemSize}px`, position: 'relative' }">
          <TreeNode
            v-for="(node, index) in visibleNodes"
            :key="String(node.key)"
            v-bind="normalizedNode(node) ?? {}"
            :data="node.data"
            :event-key="String(node.key)"
            :icon="resolvedIcon"
            :style="virtualNodeStyle(index)"
            :render-expand-icon="slots.expandIcon ? renderExpandIcon : undefined"
            :render-full-label="
              slots.fullLabel || props.renderFullLabel ? renderFullLabel : undefined
            "
            :render-icon="slots.icon ? renderIcon : undefined"
            :render-label="slots.label || props.renderLabel ? renderLabel : undefined"
            @check="handleNodeCheck"
            @context-menu="handleNodeContextMenu"
            @double-click="handleNodeDoubleClick"
            @drag-end="handleNodeDragEnd"
            @drag-enter="handleNodeDragEnter"
            @drag-leave="handleNodeDragLeave"
            @drag-over="handleNodeDragOver"
            @drag-start="handleNodeDragStart"
            @drop="handleNodeDrop"
            @expand="handleNodeExpand"
            @select="handleNodeSelect"
          />
        </div>
      </div>
    </div>
  </TreeRoot>
</template>
