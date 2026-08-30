<script setup lang="ts">
import { IconChevronDown, IconClear, IconSearch } from '@aifuxi/semi-icons-vue';
import {
  calcTreeCheckedKeys,
  calcTreeDisabledKeys,
  calcTreeExpandedKeys,
  calcTreeExpandedKeysForValues,
  convertTreeDataToEntities,
  findTreeKeysForValues,
  flattenTreeData,
  normalizeTreeKeyList,
  normalizeTreeValue,
  TreeSelectFoundation,
  type TreeSelectAdapter,
} from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  h,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type VNodeChild,
} from 'vue';

import { configContextKey, type ConfigContextValue } from '../config-provider';
import { Input, type InputExposed } from '../input';
import { Popover } from '../popover';
import { Tag, TagGroup } from '../tag';
import { TagInput, type TagInputExposed } from '../tag-input';
import { Tree, type TreeExposed } from '../tree';
import TreeSelectNodeRenderer from './TreeSelectNodeRenderer';
import type {
  TreeNodeData,
  TreeSelectEmits,
  TreeSelectExposed,
  TreeSelectProps,
  TreeSelectSearchRenderProps,
  TreeSelectSelectedItemProps,
  TreeSelectSlots,
  TreeSelectTriggerRenderProps,
  TreeValue,
} from './types';

defineOptions({ name: 'TreeSelect', inheritAttrs: false });
const props = withDefaults(defineProps<TreeSelectProps>(), {
  autoAdjustOverflow: true,
  autoExpandParent: false,
  autoMergeValue: true,
  borderless: false,
  checkRelation: 'related',
  clickToHide: true,
  clickTriggerToHide: true,
  defaultExpandAll: false,
  defaultExpandedKeys: () => [],
  defaultOpen: false,
  disabled: false,
  disableStrictly: false,
  dropdownMatchSelectWidth: true,
  expandAction: false,
  expandAll: false,
  filterTreeNode: false,
  leafOnly: false,
  motion: true,
  motionExpand: true,
  multiple: false,
  onChangeWithObject: false,
  remote: false,
  restTagsPopoverProps: () => ({}),
  searchAutoFocus: false,
  searchPosition: 'dropdown',
  showClear: false,
  showFilteredOnly: false,
  showLine: false,
  showRestTagsPopover: false,
  showSearchClear: true,
  size: 'default',
  stopPropagation: true,
  treeData: () => [],
  treeNodeFilterProp: 'label',
  treeNodeLabelProp: 'label',
  triggerTagWrap: false,
  validateStatus: 'default',
  zIndex: 1030,
});
const emit = defineEmits<TreeSelectEmits>();
defineSlots<TreeSelectSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const triggerRef = useTemplateRef<HTMLDivElement>('trigger');
const popupRef = useTemplateRef<HTMLDivElement>('popup');
const inputRef = useTemplateRef<InputExposed>('input');
const tagInputRef = useTemplateRef<TagInputExposed>('tagInput');
const treeRef = useTemplateRef<TreeExposed>('tree');
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', locale: { code: 'zh-CN' } } as ConfigContextValue),
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

function resolvedBoolean(name: keyof TreeSelectProps, fallback: boolean): boolean {
  return hasRawProp(String(name)) ? props[name] !== false : fallback;
}

const modelControlled = computed(() => hasRawProp('modelValue'));
const valueControlled = computed(() => hasRawProp('value'));
const controlled = computed(() => modelControlled.value || valueControlled.value);
const incomingValue = computed<TreeValue | undefined>(() =>
  modelControlled.value ? props.modelValue : valueControlled.value ? props.value : undefined,
);
const expandedControlled = computed(() => hasRawProp('expandedKeys'));
const loadedControlled = computed(() => hasRawProp('loadedKeys'));
const keyMaps = computed(() => props.keyMaps ?? {});
const keyName = computed(() => keyMaps.value.key ?? 'key');
const valueName = computed(() => keyMaps.value.value ?? 'value');
const labelName = computed(() => keyMaps.value.label ?? props.treeNodeLabelProp);
const childrenName = computed(() => keyMaps.value.children ?? 'children');
const runtimeAutoAdjustOverflow = computed(() => resolvedBoolean('autoAdjustOverflow', true));
const runtimeAutoMergeValue = computed(() => resolvedBoolean('autoMergeValue', true));
const runtimeClickToHide = computed(() => resolvedBoolean('clickToHide', true));
const runtimeClickTriggerToHide = computed(() => resolvedBoolean('clickTriggerToHide', true));
const runtimeDropdownMatchWidth = computed(() => resolvedBoolean('dropdownMatchSelectWidth', true));
const runtimeMotion = computed(() => resolvedBoolean('motion', true));
const runtimeMotionExpand = computed(() => resolvedBoolean('motionExpand', true));
const runtimeShowSearchClear = computed(() => resolvedBoolean('showSearchClear', true));

interface InternalTreeEntity extends Record<string, unknown> {
  data: TreeNodeData;
  key: string;
}
interface InternalFlattenNode extends Record<string, unknown> {
  data: TreeNodeData;
  key: string;
}
interface TreeSelectState {
  inputTriggerFocus: boolean;
  isOpen: boolean;
  isFocus: boolean;
  rePosKey: number;
  dropdownMinWidth: null | number | string;
  inputValue: string;
  keyEntities: Record<string, InternalTreeEntity>;
  treeData: TreeNodeData[];
  flattenNodes: InternalFlattenNode[];
  cachedFlattenNodes: InternalFlattenNode[] | undefined;
  selectedKeys: string[];
  checkedKeys: Set<string>;
  halfCheckedKeys: Set<string>;
  realCheckedKeys: Set<string>;
  disabledKeys: Set<string>;
  motionKeys: Set<string>;
  motionType: string | null;
  expandedKeys: Set<string>;
  filteredKeys: Set<string>;
  filteredExpandedKeys: Set<string>;
  filteredShownKeys: Set<string>;
  prevProps: TreeSelectProps | null;
  isHovering: boolean;
  cachedKeyValuePairs: Record<string, string>;
  loadedKeys: Set<string>;
  loadingKeys: Set<string>;
}

const state = shallowReactive<TreeSelectState>({
  inputTriggerFocus: false,
  isOpen: false,
  isFocus: false,
  rePosKey: 0,
  dropdownMinWidth: null,
  inputValue: '',
  keyEntities: {},
  treeData: [],
  flattenNodes: [],
  cachedFlattenNodes: undefined,
  selectedKeys: [],
  checkedKeys: new Set(),
  halfCheckedKeys: new Set(),
  realCheckedKeys: new Set(),
  disabledKeys: new Set(),
  motionKeys: new Set(),
  motionType: 'hide',
  expandedKeys: new Set(),
  filteredKeys: new Set(),
  filteredExpandedKeys: new Set(),
  filteredShownKeys: new Set(),
  prevProps: null,
  isHovering: false,
  cachedKeyValuePairs: {},
  loadedKeys: new Set(props.loadedKeys ?? []),
  loadingKeys: new Set(),
});
const cache = new Map<unknown, unknown>();
const lastInteraction = shallowRef<MouseEvent | KeyboardEvent | null>(null);
let clickOutsideHandler: ((event: MouseEvent) => void) | null = null;
let initialized = false;

function nodeKey(node: TreeNodeData): string {
  return String(node[keyName.value] ?? node.key ?? '');
}
function nodeValue(node: TreeNodeData): unknown {
  return node[valueName.value] ?? node[keyName.value] ?? node.key;
}
function nodeChildren(node: TreeNodeData): TreeNodeData[] {
  const children = node[childrenName.value];
  return Array.isArray(children) ? (children as TreeNodeData[]) : [];
}
function nodeForKey(key: string): TreeNodeData {
  return (
    state.keyEntities[key]?.data ??
    ({ [keyName.value]: key, [labelName.value]: key } as TreeNodeData)
  );
}
function syncValueState(value: TreeValue | undefined): void {
  const normalized = normalizeTreeValue(value, props.onChangeWithObject, keyMaps.value);
  const keys = findTreeKeysForValues(normalized, state.cachedKeyValuePairs, props.multiple);
  if (!props.multiple) {
    state.selectedKeys = keys;
    return;
  }
  if (props.checkRelation === 'related') {
    const result = calcTreeCheckedKeys(keys, state.keyEntities);
    state.checkedKeys = result.checkedKeys;
    state.halfCheckedKeys = result.halfCheckedKeys;
  } else {
    state.realCheckedKeys = new Set(keys);
  }
}

function rebuildData(): void {
  const entities = convertTreeDataToEntities(props.treeData, keyMaps.value);
  state.treeData = props.treeData;
  state.keyEntities = entities.keyEntities as Record<string, InternalTreeEntity>;
  state.cachedKeyValuePairs = entities.valueEntities;
  const sourceValue = controlled.value ? incomingValue.value : props.defaultValue;
  if (!initialized) {
    if (expandedControlled.value) {
      state.expandedKeys = calcTreeExpandedKeys(
        props.expandedKeys ?? [],
        state.keyEntities,
        props.autoExpandParent,
      );
    } else if (props.defaultExpandAll || props.expandAll) {
      state.expandedKeys = new Set(Object.keys(state.keyEntities));
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
    state.expandedKeys = new Set(Object.keys(state.keyEntities));
  }
  if (props.disableStrictly && props.checkRelation === 'related') {
    state.disabledKeys = calcTreeDisabledKeys(state.keyEntities, keyMaps.value);
  } else {
    state.disabledKeys = new Set();
  }
  syncValueState(sourceValue);
  state.flattenNodes = flattenTreeData(
    state.treeData,
    state.expandedKeys,
    keyMaps.value,
  ) as InternalFlattenNode[];
  initialized = true;
  state.rePosKey += 1;
}

type FoundationProps = TreeSelectProps & {
  autoMergeValue: boolean;
  clickToHide: boolean;
  clickTriggerToHide: boolean;
  dropdownMatchSelectWidth: boolean;
  motionExpand: boolean;
};

function getFoundationProps(): FoundationProps {
  const output = {
    ...props,
    autoMergeValue: runtimeAutoMergeValue.value,
    clickToHide: runtimeClickToHide.value,
    clickTriggerToHide: runtimeClickTriggerToHide.value,
    dropdownMatchSelectWidth: runtimeDropdownMatchWidth.value,
    keyMaps: keyMaps.value,
    motionExpand: runtimeMotionExpand.value,
    value: incomingValue.value,
  } as FoundationProps;
  if (!controlled.value) delete output.value;
  if (!expandedControlled.value) delete output.expandedKeys;
  if (!loadedControlled.value) delete output.loadedKeys;
  return output;
}

const adapter: TreeSelectAdapter<FoundationProps, TreeSelectState> = {
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
  registerClickOutsideHandler: (callback) => {
    adapter.unregisterClickOutsideHandler();
    clickOutsideHandler = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const path = event.composedPath?.() ?? [];
      const inTrigger = Boolean(
        triggerRef.value?.contains(target) || path.includes(triggerRef.value!),
      );
      const inPopup = Boolean(popupRef.value?.contains(target) || path.includes(popupRef.value!));
      if (!inTrigger && !inPopup) callback(event);
    };
    document.addEventListener('mousedown', clickOutsideHandler);
  },
  unregisterClickOutsideHandler: () => {
    if (!clickOutsideHandler || typeof document === 'undefined') return;
    document.removeEventListener('mousedown', clickOutsideHandler);
    clickOutsideHandler = null;
  },
  rePositionDropdown: () => {
    state.rePosKey += 1;
  },
  updateState: (nextState) => Object.assign(state, nextState),
  notifySelect: (key, selected, node) => emit('select', key, selected, node as TreeNodeData),
  notifySearch: (input, filteredExpandedKeys, filteredNodes) =>
    emit('search', input, filteredExpandedKeys, filteredNodes as TreeNodeData[]),
  cacheFlattenNodes: (enabled) => {
    state.cachedFlattenNodes = enabled ? [...state.flattenNodes] : undefined;
  },
  openMenu: () => {
    if (state.isOpen) return;
    state.isOpen = true;
    emit('visibleChange', true);
  },
  closeMenu: (callback) => {
    if (!state.isOpen) return;
    state.isOpen = false;
    callback?.();
    emit('visibleChange', false);
  },
  getTriggerWidth: () => triggerRef.value?.getBoundingClientRect().width ?? false,
  setOptionWrapperWidth: (width) => {
    state.dropdownMinWidth = width;
  },
  notifyClear: (event) => emit('clear', event),
  notifyChange: (value, node, event) => {
    emit('change', value, node, event);
    emit('update:value', value);
    emit('update:modelValue', value);
  },
  notifyChangeWithObject: (node, event) => {
    emit('change', node, event);
    emit('update:value', node);
    emit('update:modelValue', node);
  },
  notifyExpand: (keys, detail) => {
    const expandedKeys = [...keys];
    emit('expand', expandedKeys, detail as { expanded: boolean; node: TreeNodeData });
    emit('update:expandedKeys', expandedKeys);
  },
  notifyFocus: (event) => emit('focus', event),
  notifyBlur: (event) => emit('blur', event),
  toggleHovering: (hovering) => {
    state.isHovering = hovering;
  },
  notifyLoad: (keys, node) => emit('load', keys, node as TreeNodeData),
  updateInputFocus: (focus) => {
    if (focus) {
      inputRef.value?.focus();
      tagInputRef.value?.focus();
    } else {
      inputRef.value?.blur();
      tagInputRef.value?.blur();
    }
  },
  updateLoadKeys: (_node, resolve) => resolve(),
  updateIsFocus: (focus) => {
    state.isFocus = focus;
  },
};
const foundation = markRaw(new TreeSelectFoundation<FoundationProps, TreeSelectState>(adapter));

const displayKeys = computed(() => {
  if (!props.multiple) return state.selectedKeys;
  if (props.checkRelation === 'unRelated') return [...state.realCheckedKeys];
  return runtimeAutoMergeValue.value
    ? normalizeTreeKeyList([...state.checkedKeys], state.keyEntities, props.leafOnly, true)
    : [...state.checkedKeys];
});
const selectedNodes = computed(() => displayKeys.value.map(nodeForKey));
const treeValue = computed<TreeValue | undefined>(() => {
  const keys = props.multiple
    ? props.checkRelation === 'related'
      ? [...state.checkedKeys]
      : [...state.realCheckedKeys]
    : state.selectedKeys;
  const nodes = keys.map(nodeForKey);
  if (props.onChangeWithObject) return props.multiple ? nodes : nodes[0];
  const values = nodes.map(nodeValue) as Array<string | number>;
  return props.multiple ? values : values[0];
});
const treeExpandedKeys = computed(() => [...state.expandedKeys]);
const visibleTreeData = computed<TreeNodeData[]>(() => {
  if (
    !props.showFilteredOnly ||
    !state.inputValue ||
    props.remote ||
    state.filteredShownKeys.size === 0
  ) {
    return props.treeData;
  }
  const filterNodes = (nodes: TreeNodeData[]): TreeNodeData[] =>
    nodes.flatMap((node) => {
      const key = nodeKey(node);
      if (!state.filteredShownKeys.has(key)) return [];
      const children = filterNodes(nodeChildren(node));
      return [
        children.length || nodeChildren(node).length
          ? ({ ...node, [childrenName.value]: children } as TreeNodeData)
          : node,
      ];
    });
  return filterNodes(props.treeData);
});
const hasValue = computed(() => displayKeys.value.length > 0);
const filterable = computed(() => Boolean(props.filterTreeNode));
const triggerSearch = computed(() => filterable.value && props.searchPosition === 'trigger');
const showClearButton = computed(
  () =>
    props.showClear &&
    (hasValue.value || (triggerSearch.value && Boolean(state.inputValue))) &&
    !props.disabled &&
    (state.isOpen || state.isHovering),
);
const triggerClasses = computed(() => [
  'semi-tree-select',
  props.class,
  props.className,
  attrs.class,
  props.borderless ? 'semi-tree-select-borderless' : undefined,
  state.isFocus ? 'semi-tree-select-focus' : undefined,
  props.disabled ? 'semi-tree-select-disabled' : undefined,
  props.multiple ? 'semi-tree-select-multiple' : 'semi-tree-select-single',
  filterable.value ? 'semi-tree-select-filterable' : undefined,
  props.validateStatus === 'error' ? 'semi-tree-select-error' : undefined,
  props.validateStatus === 'warning' ? 'semi-tree-select-warning' : undefined,
  props.size === 'small' ? 'semi-tree-select-small' : undefined,
  props.size === 'large' ? 'semi-tree-select-large' : undefined,
  prefixContent.value || insetLabelContent.value ? 'semi-tree-select-with-prefix' : undefined,
  suffixContent.value ? 'semi-tree-select-with-suffix' : undefined,
  props.multiple && triggerSearch.value && !hasValue.value
    ? 'semi-tree-select-multiple-tagInput-empty'
    : undefined,
  props.multiple && triggerSearch.value && hasValue.value
    ? 'semi-tree-select-multiple-tagInput-notEmpty'
    : undefined,
  props.triggerTagWrap && props.multiple && triggerSearch.value
    ? 'semi-tree-select-triggerTagWrap'
    : undefined,
]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const prefixContent = computed(
  () => slots.prefix?.() ?? (hasRawProp('prefix') ? props.prefix : undefined),
);
const insetLabelContent = computed(() => (hasRawProp('insetLabel') ? props.insetLabel : undefined));
const suffixContent = computed(
  () => slots.suffix?.() ?? (hasRawProp('suffix') ? props.suffix : undefined),
);
const arrowContent = computed(
  () =>
    slots.arrowIcon?.() ??
    (hasRawProp('arrowIcon') ? props.arrowIcon : undefined) ??
    h(IconChevronDown),
);
const clearContent = computed(
  () =>
    slots.clearIcon?.() ?? (hasRawProp('clearIcon') ? props.clearIcon : undefined) ?? h(IconClear),
);
const outerTopContent = computed(
  () => slots.outerTop?.() ?? (hasRawProp('outerTopSlot') ? props.outerTopSlot : undefined),
);
const outerBottomContent = computed(
  () =>
    slots.outerBottom?.() ?? (hasRawProp('outerBottomSlot') ? props.outerBottomSlot : undefined),
);
const searchPlaceholder = computed(() => {
  if (props.searchPlaceholder) return props.searchPlaceholder;
  const locale = config.value.locale.TreeSelect as { searchPlaceholder?: string } | undefined;
  return locale?.searchPlaceholder ?? (config.value.locale.code === 'en-US' ? 'Search' : '搜索');
});
const emptyContent = computed<VNodeChild>(() => {
  if (slots.empty) return slots.empty();
  if (hasRawProp('emptyContent')) return props.emptyContent;
  const locale = config.value.locale.Tree as { emptyText?: string } | undefined;
  return locale?.emptyText ?? (config.value.locale.code === 'en-US' ? 'No Data' : '暂无数据');
});
const popupStyle = computed(() => [
  state.dropdownMinWidth === null
    ? undefined
    : {
        minWidth:
          typeof state.dropdownMinWidth === 'number'
            ? `${state.dropdownMinWidth}px`
            : state.dropdownMinWidth,
      },
  props.dropdownStyle,
]);
const searchRenderProps = computed<TreeSelectSearchRenderProps>(() => ({
  className:
    props.searchPosition === 'dropdown' ? 'semi-tree-input' : 'semi-tree-select-inputTrigger',
  value: state.inputValue,
  placeholder: props.searchPosition === 'dropdown' ? searchPlaceholder.value : '',
  showClear: runtimeShowSearchClear.value,
  disabled: props.disabled,
  preventScroll: props.preventScroll,
  onChange: search,
}));
const customSearch = computed<VNodeChild>(
  () =>
    slots.search?.(searchRenderProps.value) ??
    (typeof props.searchRender === 'function'
      ? props.searchRender(searchRenderProps.value)
      : undefined),
);
const searchHidden = computed(() => hasRawProp('searchRender') && props.searchRender === false);

function selectedItemContent(
  node: TreeNodeData,
  index: number,
): {
  content: VNodeChild;
  isRenderInTag: boolean;
} {
  const onClose = (_content?: VNodeChild, event?: MouseEvent | KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    foundation.removeTag(nodeKey(node));
  };
  const slotProps: TreeSelectSelectedItemProps = { node, index, onClose };
  const custom = slots.selectedItem?.(slotProps) ?? props.renderSelectedItem?.(node, slotProps);
  if (custom && typeof custom === 'object' && !Array.isArray(custom) && 'isRenderInTag' in custom) {
    return custom as { content: VNodeChild; isRenderInTag: boolean };
  }
  return {
    content: custom ?? (node[labelName.value] as VNodeChild) ?? nodeValue(node)?.toString(),
    isRenderInTag: true,
  };
}

function renderTagForNode(node: TreeNodeData, index: number): VNodeChild {
  const resolved = selectedItemContent(node, index);
  if (!resolved.isRenderInTag) return resolved.content;
  const disabled =
    props.disabled ||
    Boolean(node[keyMaps.value.disabled ?? 'disabled']) ||
    (props.disableStrictly && state.disabledKeys.has(nodeKey(node)));
  return h(
    Tag,
    {
      key: `tree-select-tag-${nodeKey(node)}-${index}`,
      className: 'semi-tree-select-selection-tag',
      closable: !disabled,
      color: 'white',
      size: props.size === 'small' ? 'small' : 'large',
      onClose: (_content: VNodeChild, event: MouseEvent | KeyboardEvent) => {
        event.preventDefault();
        event.stopPropagation();
        foundation.removeTag(nodeKey(node));
      },
    },
    { default: () => resolved.content },
  );
}
const multipleTagList = computed(() =>
  selectedNodes.value.map((node, index) => renderTagForNode(node, index)),
);
function renderTriggerTag(value: string, index: number): VNodeChild {
  return renderTagForNode(nodeForKey(value), index);
}
const singleText = computed<VNodeChild>(() => {
  const node = selectedNodes.value[0];
  if (!node) return undefined;
  const slotContent = slots.selectedItem?.({ node, index: 0, onClose: () => undefined });
  if (slotContent !== undefined) return slotContent;
  const customContent = props.renderSelectedItem?.(node);
  if (
    customContent &&
    typeof customContent === 'object' &&
    !Array.isArray(customContent) &&
    'content' in customContent
  ) {
    return customContent.content;
  }
  return customContent ?? (node[labelName.value] as VNodeChild) ?? String(nodeValue(node));
});
const triggerRenderProps = computed<TreeSelectTriggerRenderProps>(() => ({
  componentProps: props as TreeSelectProps,
  disabled: props.disabled,
  inputValue: state.inputValue,
  placeholder: props.placeholder ?? '',
  value: selectedNodes.value,
  onClear: (event) => handleClear(event ?? (new Event('clear') as MouseEvent)),
  onSearch: search,
  onRemove: (key) => foundation.removeTag(key),
}));
const customTrigger = computed<VNodeChild>(
  () =>
    slots.trigger?.(triggerRenderProps.value) ?? props.triggerRender?.(triggerRenderProps.value),
);
const popoverOptionalProps = computed(() => ({
  ...(props.getPopupContainer ? { getPopupContainer: props.getPopupContainer } : {}),
  ...(props.dropdownMargin !== undefined ? { margin: props.dropdownMargin } : {}),
  ...(props.mouseEnterDelay !== undefined ? { mouseEnterDelay: props.mouseEnterDelay } : {}),
  ...(props.mouseLeaveDelay !== undefined ? { mouseLeaveDelay: props.mouseLeaveDelay } : {}),
}));
const treeOptionalProps = computed(() => ({
  ...(treeValue.value !== undefined ? { modelValue: treeValue.value } : {}),
  ...(hasRawProp('expandIcon') || slots.expandIcon ? { expandIcon: resolvedExpandIcon.value } : {}),
  ...(props.labelEllipsis !== undefined ? { labelEllipsis: props.labelEllipsis } : {}),
  ...(props.loadData ? { loadData: props.loadData } : {}),
  ...(props.loadedKeys !== undefined ? { loadedKeys: props.loadedKeys } : {}),
  ...(slots.fullLabel || props.renderFullLabel ? { renderFullLabel: resolveFullLabel } : {}),
  ...(slots.label || props.renderLabel ? { renderLabel: resolveLabel } : {}),
  ...(props.virtualize ? { virtualize: props.virtualize } : {}),
}));
const tagInputOptionalProps = computed(() => ({
  ...(props.maxTagCount !== undefined ? { maxTagCount: props.maxTagCount } : {}),
  ...(props.placeholder !== undefined ? { placeholder: props.placeholder } : {}),
}));
const tagGroupOptionalProps = computed(() => ({
  ...(props.maxTagCount !== undefined ? { maxTagCount: props.maxTagCount } : {}),
}));

function recordInteraction(event: MouseEvent | KeyboardEvent): void {
  lastInteraction.value = event;
}
function handleTriggerClick(event: MouseEvent): void {
  recordInteraction(event);
  foundation.handleClick(event);
}
function handleTriggerKeypress(event: KeyboardEvent): void {
  recordInteraction(event);
  foundation.handleSelectionEnterPress(event);
}
function handleKeydown(event: KeyboardEvent): void {
  recordInteraction(event);
  foundation.handleKeyDown(event);
}
function handleClear(event: MouseEvent | KeyboardEvent): void {
  event.stopPropagation?.();
  foundation.handleClear(event);
}
function handleClearKeypress(event: KeyboardEvent): void {
  event.stopPropagation();
  foundation.handleClearEnterPress(event);
}
function search(value: string): void {
  if (!state.isOpen) foundation.open();
  foundation.handleInputChange(value);
  if (!props.remote) void nextTick(() => treeRef.value?.search(value));
}
function handleTreeSelect(key: string, _selected: boolean, node: TreeNodeData): void {
  const internal = foundation.getTreeNodeProps(key) ?? {};
  foundation.handleNodeSelect(lastInteraction.value, {
    ...internal,
    data: node,
    disabled: Boolean(node[keyMaps.value.disabled ?? 'disabled']),
    eventKey: key,
    children: nodeChildren(node),
  });
}
function handleTagRemove(key: string): void {
  foundation.removeTag(key);
}
function handleTreeExpand(keys: string[], detail: { expanded: boolean; node: TreeNodeData }): void {
  if (!expandedControlled.value) state.expandedKeys = new Set(keys);
  state.flattenNodes = flattenTreeData(
    state.treeData,
    expandedControlled.value ? new Set(props.expandedKeys ?? []) : state.expandedKeys,
    keyMaps.value,
  ) as InternalFlattenNode[];
  emit('expand', keys, detail);
  emit('update:expandedKeys', keys);
  state.rePosKey += 1;
}
function handleLoad(keys: Set<string>, node?: TreeNodeData): void {
  if (!loadedControlled.value) state.loadedKeys = new Set(keys);
  emit('load', keys, node);
}
function handlePopoverVisibleChange(visible: boolean): void {
  foundation.handlePopoverVisibleChange(visible);
}
function handleAfterClose(): void {
  foundation.handleAfterClose();
  if (!props.remote && state.inputValue === '') treeRef.value?.search('');
}
function close(): void {
  foundation.close(null);
}
function resolveLabel(label?: VNodeChild, node?: TreeNodeData, searchWord?: string): VNodeChild {
  return (
    slots.label?.({ label, node: node ?? {}, searchWord }) ??
    props.renderLabel?.(label, node, searchWord) ??
    label
  );
}
function resolveFullLabel(
  slotProps: Parameters<NonNullable<TreeSelectProps['renderFullLabel']>>[0],
): VNodeChild {
  return slots.fullLabel?.(slotProps) ?? props.renderFullLabel?.(slotProps);
}
const resolvedExpandIcon = computed(() =>
  slots.expandIcon
    ? (slotProps: Parameters<NonNullable<TreeSelectSlots['expandIcon']>>[0]) =>
        slots.expandIcon?.(slotProps)
    : hasRawProp('expandIcon')
      ? props.expandIcon
      : undefined,
);

defineExpose<TreeSelectExposed>({ close, search });

watch(
  () => [props.treeData, props.keyMaps, props.expandAll, props.disableStrictly] as const,
  rebuildData,
  { deep: true, immediate: true },
);
watch(
  incomingValue,
  (value) => {
    if (controlled.value) syncValueState(value);
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
    state.flattenNodes = flattenTreeData(
      state.treeData,
      state.expandedKeys,
      keyMaps.value,
    ) as InternalFlattenNode[];
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
  () => syncValueState(controlled.value ? incomingValue.value : props.defaultValue),
);
watch(
  () => [state.checkedKeys.size, state.realCheckedKeys.size, state.selectedKeys.length],
  () => nextTick(() => adapter.rePositionDropdown()),
);

onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <Popover
    v-bind="popoverOptionalProps"
    :auto-adjust-overflow="runtimeAutoAdjustOverflow"
    :motion="runtimeMotion"
    :position="position ?? 'bottomLeft'"
    :re-pos-key="state.rePosKey"
    :stop-propagation="stopPropagation === true"
    trigger="custom"
    :visible="state.isOpen"
    :z-index="zIndex"
    @after-close="handleAfterClose"
    @visible-change="handlePopoverVisibleChange"
  >
    <template #content>
      <div
        ref="popup"
        :class="['semi-tree-select-popover', dropdownClassName]"
        :style="popupStyle"
        @click.capture="recordInteraction"
        @keydown.capture="handleKeydown"
      >
        <div class="semi-tree-wrapper">
          <TreeSelectNodeRenderer v-if="outerTopContent != null" :content="outerTopContent" />
          <div
            v-else-if="filterable && searchPosition === 'dropdown' && !searchHidden"
            class="semi-tree-search-wrapper"
          >
            <TreeSelectNodeRenderer v-if="customSearch != null" :content="customSearch" />
            <Input
              v-else
              ref="input"
              aria-label="Filter TreeSelect item"
              class-name="semi-tree-input"
              :model-value="state.inputValue"
              :placeholder="searchPlaceholder"
              :prevent-scroll="preventScroll"
              :show-clear="runtimeShowSearchClear"
              @change="search"
            >
              <template #prefix><IconSearch /></template>
            </Input>
          </div>
          <Tree
            ref="tree"
            v-bind="treeOptionalProps"
            :tree-select-embedded="true"
            :auto-expand-parent="autoExpandParent"
            :auto-merge-value="runtimeAutoMergeValue"
            :check-relation="checkRelation"
            :default-expand-all="defaultExpandAll"
            :disabled="disabled"
            :disable-strictly="disableStrictly"
            :empty-content="emptyContent"
            :expand-action="expandAction"
            :expanded-keys="treeExpandedKeys"
            :filter-tree-node="filterTreeNode"
            :key-maps="keyMaps"
            :leaf-only="leafOnly"
            :motion="runtimeMotionExpand"
            :multiple="multiple"
            :on-change-with-object="onChangeWithObject"
            :search-render="false"
            :show-filtered-only="showFilteredOnly"
            :show-line="showLine"
            :tree-data="visibleTreeData"
            :tree-node-filter-prop="treeNodeFilterProp"
            @expand="handleTreeExpand"
            @load="handleLoad"
            @select="handleTreeSelect"
          />
          <TreeSelectNodeRenderer v-if="outerBottomContent != null" :content="outerBottomContent" />
        </div>
      </div>
    </template>

    <TreeSelectNodeRenderer v-if="customTrigger != null" :content="customTrigger" />
    <div
      v-else
      ref="trigger"
      v-bind="dataAttrs"
      role="combobox"
      :aria-describedby="ariaDescribedby ?? (attrs['aria-describedby'] as string | undefined)"
      :aria-disabled="disabled"
      :aria-errormessage="ariaErrormessage ?? (attrs['aria-errormessage'] as string | undefined)"
      :aria-haspopup="'tree'"
      :aria-invalid="ariaInvalid ?? (attrs['aria-invalid'] as boolean | undefined)"
      :aria-label="ariaLabel ?? (attrs['aria-label'] as string | undefined) ?? 'TreeSelect'"
      :aria-labelledby="ariaLabelledby ?? (attrs['aria-labelledby'] as string | undefined)"
      :aria-required="ariaRequired ?? (attrs['aria-required'] as boolean | undefined)"
      :class="triggerClasses"
      :style="[style, attrs.style]"
      :tabindex="disabled ? undefined : 0"
      @click="handleTriggerClick"
      @keydown="handleKeydown"
      @keypress="handleTriggerKeypress"
      @mouseenter="showClear ? foundation.toggleHoverState(true) : undefined"
      @mouseleave="showClear ? foundation.toggleHoverState(false) : undefined"
    >
      <div
        v-if="prefixContent != null || insetLabelContent != null"
        :id="insetLabelId"
        :class="[
          'semi-tree-select-prefix',
          insetLabelContent != null ? 'semi-tree-select-inset-label' : undefined,
          typeof (prefixContent ?? insetLabelContent) === 'string'
            ? 'semi-tree-select-prefix-text'
            : undefined,
        ]"
        x-semi-prop="prefix,insetLabel"
      >
        <TreeSelectNodeRenderer :content="prefixContent ?? insetLabelContent" />
      </div>
      <div class="semi-tree-select-selection">
        <template v-if="triggerSearch">
          <TagInput
            v-if="multiple"
            ref="tagInput"
            v-bind="tagInputOptionalProps"
            :auto-focus="searchAutoFocus"
            :disabled="disabled"
            :expand-rest-tags-on-click="false"
            :input-value="state.inputValue"
            :model-value="displayKeys"
            :prevent-scroll="preventScroll"
            :render-tag-item="renderTriggerTag"
            :rest-tags-popover-props="restTagsPopoverProps"
            :show-rest-tags-popover="showRestTagsPopover"
            :size="size"
            @input-change="search"
            @remove="handleTagRemove"
          />
          <template v-else>
            <div
              :class="[
                'semi-tree-select-triggerSingleSearch-wrapper',
                state.inputTriggerFocus ? 'semi-tree-select-triggerSingleSearch-upper' : undefined,
              ]"
            >
              <TreeSelectNodeRenderer v-if="customSearch != null" :content="customSearch" />
              <Input
                v-else
                ref="input"
                aria-label="Filter TreeSelect item"
                class-name="semi-tree-select-inputTrigger"
                :auto-focus="searchAutoFocus"
                :disabled="disabled"
                :model-value="state.inputValue"
                :prevent-scroll="preventScroll"
                @blur="foundation.handleInputTriggerBlur()"
                @change="search"
                @focus="foundation.handleInputTriggerFocus()"
              />
            </div>
            <span
              v-if="!state.inputValue"
              :class="[
                'semi-tree-select-selection-TriggerSearchItem',
                (state.inputTriggerFocus || !singleText) && !disabled
                  ? 'semi-tree-select-selection-TriggerSearchItem-placeholder'
                  : undefined,
                disabled ? 'semi-tree-select-selection-TriggerSearchItem-disabled' : undefined,
              ]"
              @click="foundation.onClickSingleTriggerSearchItem?.($event)"
            >
              <TreeSelectNodeRenderer :content="singleText ?? placeholder" />
            </span>
          </template>
        </template>
        <span
          v-else-if="!multiple || !hasValue"
          :class="[
            'semi-tree-select-selection-content',
            !singleText ? 'semi-tree-select-selection-placeholder' : undefined,
          ]"
        >
          <TreeSelectNodeRenderer :content="singleText ?? placeholder" />
        </span>
        <TagGroup
          v-else
          v-bind="tagGroupOptionalProps"
          mode="custom"
          :popover-props="restTagsPopoverProps"
          :show-popover="showRestTagsPopover"
          size="large"
          :tag-list="multipleTagList"
        />
      </div>
      <div v-if="suffixContent != null" class="semi-tree-select-suffix" x-semi-prop="suffix">
        <TreeSelectNodeRenderer :content="suffixContent" />
      </div>
      <div
        v-if="showClearButton"
        role="button"
        tabindex="0"
        aria-label="Clear TreeSelect value"
        class="semi-tree-select-clearbtn"
        @click="handleClear"
        @keypress="handleClearKeypress"
      >
        <TreeSelectNodeRenderer :content="clearContent" />
      </div>
      <div v-else-if="arrowContent != null" class="semi-tree-select-arrow" x-semi-prop="arrowIcon">
        <TreeSelectNodeRenderer :content="arrowContent" />
      </div>
    </div>
  </Popover>
</template>
