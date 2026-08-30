<script setup lang="ts">
import {
  calcCascaderMergeType,
  calcTreeCheckedKeys,
  calcTreeDisabledKeys,
  cascaderStrings,
  CascaderFoundation,
  convertCascaderDataToEntities,
  getCascaderKeyByValuePath,
  getCascaderValueOrKey,
  normalizeTreeKeyList,
  type CascaderAdapter,
} from '@workspace/foundation-integration';
import { IconChevronDown, IconClear } from '@aifuxi/semi-icons-vue';
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
import { Tag } from '../tag';
import { TagInput, type TagInputExposed } from '../tag-input';
import CascaderNodeRenderer from './CascaderNodeRenderer';
import CascaderPanel from './CascaderPanel.vue';
import type {
  CascaderData,
  CascaderEmits,
  CascaderEntity,
  CascaderExposed,
  CascaderFilterData,
  CascaderFilterRenderProps,
  CascaderProps,
  CascaderSlots,
  CascaderTriggerRenderProps,
  CascaderValue,
} from './types';

type NormalizedPanelNode = Exclude<VNodeChild, boolean | void>;

defineOptions({ name: 'Cascader', inheritAttrs: false });
const props = withDefaults(defineProps<CascaderProps>(), {
  ariaLabel: 'Cascader',
  autoAdjustOverflow: true,
  autoClearSearchValue: true,
  autoMergeValue: true,
  borderless: false,
  changeOnSelect: false,
  checkRelation: 'related',
  clickToSelect: false,
  defaultOpen: false,
  disabled: false,
  disableStrictly: false,
  displayProp: 'label',
  enableLeafClick: false,
  filterLeafOnly: true,
  filterTreeNode: false,
  keyMaps: () => ({}),
  leafOnly: false,
  motion: true,
  multiple: false,
  onChangeWithObject: false,
  remote: false,
  restTagsPopoverProps: () => ({}),
  searchPosition: 'trigger',
  separator: ' / ',
  showClear: false,
  showNext: 'click',
  showRestTagsPopover: false,
  size: 'default',
  stopPropagation: true,
  treeData: () => [],
  treeNodeFilterProp: 'label',
  validateStatus: 'default',
  zIndex: 1030,
});
const emit = defineEmits<CascaderEmits>();
defineSlots<CascaderSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const triggerRef = useTemplateRef<HTMLDivElement>('trigger');
const popupRef = useTemplateRef<HTMLDivElement>('popup');
const inputRef = useTemplateRef<InputExposed>('input');
const tagInputRef = useTemplateRef<TagInputExposed>('tagInput');
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({
        direction: 'ltr',
        locale: { code: 'zh-CN' },
        getPopupContainer: undefined,
      } as ConfigContextValue),
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
function resolvedBoolean(name: keyof CascaderProps, fallback: boolean): boolean {
  return hasRawProp(String(name)) ? props[name] !== false : fallback;
}

const modelControlled = computed(() => hasRawProp('modelValue'));
const valueControlled = computed(() => hasRawProp('value'));
const controlled = computed(() => modelControlled.value || valueControlled.value);
const incomingValue = computed<CascaderValue | undefined>(() =>
  modelControlled.value ? props.modelValue : valueControlled.value ? props.value : undefined,
);
const runtimeAutoAdjustOverflow = computed(() => resolvedBoolean('autoAdjustOverflow', true));
const runtimeAutoMergeValue = computed(() => resolvedBoolean('autoMergeValue', true));
const runtimeFilterLeafOnly = computed(() => resolvedBoolean('filterLeafOnly', true));
const runtimeMotion = computed(() => resolvedBoolean('motion', true));
const runtimeStopPropagation = computed(() => resolvedBoolean('stopPropagation', true));
const keyMaps = computed(() => props.keyMaps ?? {});
const keyDisabledName = computed(() => keyMaps.value.disabled ?? 'disabled');
const mergeType = computed(() =>
  calcCascaderMergeType(runtimeAutoMergeValue.value, props.leafOnly),
);

interface CascaderState {
  emptyContentMinWidth: null | number | string;
  isOpen: boolean;
  rePosKey: number;
  keyEntities: Record<string, CascaderEntity>;
  selectedKeys: Set<string>;
  activeKeys: Set<string>;
  filteredKeys: Set<string>;
  inputValue: string;
  isSearching: boolean;
  inputPlaceHolder: string;
  prevProps: Record<string, unknown>;
  isHovering: boolean;
  checkedKeys: Set<string>;
  halfCheckedKeys: Set<string>;
  resolvedCheckedKeys: Set<string>;
  loadedKeys: Set<string>;
  loadingKeys: Set<string>;
  loading: boolean;
  treeData: CascaderData[];
  isFocus: boolean;
  isInput: boolean;
  disabledKeys: Set<string>;
  showInput: boolean;
}

const state = shallowReactive<CascaderState>({
  emptyContentMinWidth: null,
  isOpen: false,
  rePosKey: 0,
  keyEntities: {},
  selectedKeys: new Set(),
  activeKeys: new Set(),
  filteredKeys: new Set(),
  inputValue: '',
  isSearching: false,
  inputPlaceHolder: props.searchPlaceholder ?? props.placeholder ?? '',
  prevProps: {},
  isHovering: false,
  checkedKeys: new Set(),
  halfCheckedKeys: new Set(),
  resolvedCheckedKeys: new Set(),
  loadedKeys: new Set(props.loadedKeys ?? []),
  loadingKeys: new Set(),
  loading: false,
  treeData: props.treeData,
  isFocus: false,
  isInput: false,
  disabledKeys: new Set(),
  showInput: false,
});
const cache = new Map<unknown, unknown>();
const loadingKeysRef = shallowRef(new Set<string>());
const loadedKeysRef = shallowRef(new Set<string>(props.loadedKeys ?? []));
let clickOutsideHandler: ((event: MouseEvent) => void) | null = null;
let mounted = false;

function normalizeValuePaths(value: CascaderValue | undefined): Array<Array<string | number>> {
  if (value === undefined || value === null) return [];
  let paths: unknown[][];
  if (!Array.isArray(value)) {
    paths = [[value]];
  } else if (Array.isArray(value[0])) {
    paths = value as unknown[][];
  } else {
    paths = [value as unknown[]];
  }
  return paths
    .map((path) =>
      path.map((item) => {
        if (props.onChangeWithObject && item && typeof item === 'object') {
          return getCascaderValueOrKey(item as Record<string, unknown>, keyMaps.value) as
            string | number;
        }
        return item as string | number;
      }),
    )
    .filter((path) => path.length > 0);
}
function valueKeys(value: CascaderValue | undefined): string[] {
  return normalizeValuePaths(value)
    .map((path) => getCascaderKeyByValuePath(path))
    .filter((key) => Boolean(state.keyEntities[key]));
}
function syncSingleValue(value: CascaderValue | undefined): void {
  const keys = valueKeys(value);
  const key = keys[0];
  if (!key) {
    state.selectedKeys = new Set();
    state.activeKeys = new Set();
    return;
  }
  const entity = state.keyEntities[key];
  if (!entity) return;
  const isLeaf = props.loadData ? Boolean(entity.data.isLeaf) : !entity.children?.length;
  if (!props.changeOnSelect && !isLeaf) {
    state.selectedKeys = new Set();
    state.activeKeys = new Set(entity.path);
    return;
  }
  state.selectedKeys = new Set([key]);
  state.activeKeys = new Set(entity.path);
}
function syncMultipleValue(value: CascaderValue | undefined): void {
  const keys = valueKeys(value);
  if (props.checkRelation === 'related') {
    const result = calcTreeCheckedKeys(keys, state.keyEntities);
    state.checkedKeys = new Set(result.checkedKeys);
    state.halfCheckedKeys = new Set(result.halfCheckedKeys);
    const leafOnlyMerge = mergeType.value === cascaderStrings.LEAF_ONLY_MERGE_TYPE;
    state.resolvedCheckedKeys = new Set(
      normalizeTreeKeyList([...state.checkedKeys], state.keyEntities, leafOnlyMerge),
    );
  } else {
    state.checkedKeys = new Set(keys);
    state.halfCheckedKeys = new Set();
    state.resolvedCheckedKeys = new Set(keys);
  }
}
function rebuildData(): void {
  state.treeData = props.treeData;
  state.keyEntities = convertCascaderDataToEntities(
    props.treeData as Record<string, unknown>[],
    keyMaps.value,
  ) as Record<string, CascaderEntity>;
  state.disabledKeys =
    props.disableStrictly && props.checkRelation === 'related'
      ? new Set(
          calcTreeDisabledKeys(
            state.keyEntities,
            keyMaps.value as Record<string, string | undefined>,
          ),
        )
      : new Set();
  const sourceValue = controlled.value ? incomingValue.value : props.defaultValue;
  if (props.multiple) syncMultipleValue(sourceValue);
  else syncSingleValue(sourceValue);
  state.rePosKey += 1;
}

type FoundationProps = CascaderProps & {
  autoMergeValue: boolean;
  filterLeafOnly: boolean;
  motion: boolean;
  stopPropagation: boolean;
};
function getFoundationProps(): FoundationProps {
  const output = {
    ...props,
    autoMergeValue: runtimeAutoMergeValue.value,
    filterLeafOnly: runtimeFilterLeafOnly.value,
    keyMaps: keyMaps.value,
    motion: runtimeMotion.value,
    stopPropagation: runtimeStopPropagation.value,
    value: incomingValue.value,
  } as FoundationProps;
  if (!controlled.value) delete output.value;
  return output;
}

const adapter: CascaderAdapter<FoundationProps, CascaderState> = {
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
  updateInputPlaceHolder: (value) => {
    state.inputPlaceHolder = value;
  },
  focusInput: () => {
    inputRef.value?.focus();
    tagInputRef.value?.focus();
  },
  blurInput: () => {
    inputRef.value?.blur();
    tagInputRef.value?.blur();
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
    document.addEventListener('mousedown', clickOutsideHandler, false);
  },
  unregisterClickOutsideHandler: () => {
    if (!clickOutsideHandler || typeof document === 'undefined') return;
    document.removeEventListener('mousedown', clickOutsideHandler, false);
    clickOutsideHandler = null;
  },
  rePositionDropdown: () => {
    state.rePosKey += 1;
  },
  updateStates: (nextState) => Object.assign(state, nextState),
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
  updateSelection: (selectedKeys) => {
    state.selectedKeys = selectedKeys;
  },
  notifyChange: (value) => {
    const output = value as CascaderValue;
    emit('change', output);
    emit('update:value', output);
    emit('update:modelValue', output);
  },
  notifySelect: (value) => emit('select', value as string | number | Array<string | number>),
  notifyOnSearch: (input) => emit('search', input),
  notifyFocus: (event) => emit('focus', event),
  notifyBlur: (event) => emit('blur', event),
  notifyDropdownVisibleChange: () => undefined,
  toggleHovering: (hovering) => {
    state.isHovering = hovering;
  },
  notifyLoadData: (selectedOptions, callback) => {
    if (!props.loadData) return;
    void props.loadData(selectedOptions as CascaderData[]).then(() => {
      setTimeout(() => {
        callback();
        state.loading = false;
      });
    });
  },
  notifyOnLoad: (loadedKeys, data) => emit('load', loadedKeys, data as CascaderData),
  notifyListScroll: (event, panel) =>
    emit('listScroll', event, panel as unknown as { panelIndex: number; activeNode: CascaderData }),
  notifyOnExceed: (data) => emit('exceed', data as CascaderEntity[]),
  notifyClear: () => emit('clear'),
  toggleInputShow: (show, callback) => {
    state.showInput = show;
    void nextTick(callback);
  },
  updateFocusState: (focus) => {
    state.isFocus = focus;
  },
  updateLoadingKeyRefValue: (keys) => {
    loadingKeysRef.value = keys;
  },
  getLoadingKeyRefValue: () => loadingKeysRef.value,
  updateLoadedKeyRefValue: (keys) => {
    loadedKeysRef.value = keys;
  },
  getLoadedKeyRefValue: () => loadedKeysRef.value,
  setEmptyContentMinWidth: (width) => {
    state.emptyContentMinWidth = width;
  },
  getTriggerWidth: () => triggerRef.value?.getBoundingClientRect().width ?? 0,
};
const foundation = markRaw(new CascaderFoundation<FoundationProps, CascaderState>(adapter));

const filterable = computed(() => Boolean(props.filterTreeNode));
const triggerSearch = computed(
  () => filterable.value && props.searchPosition === cascaderStrings.SEARCH_POSITION_TRIGGER,
);
const renderData = computed(
  () => foundation.getRenderData() as Array<CascaderEntity | CascaderFilterData>,
);
const popupStyle = computed(() => [
  renderData.value.length === 0 && state.emptyContentMinWidth != null
    ? {
        minWidth:
          typeof state.emptyContentMinWidth === 'number'
            ? `${state.emptyContentMinWidth}px`
            : state.emptyContentMinWidth,
      }
    : undefined,
  props.dropdownStyle,
]);
const displayKeys = computed(() => {
  if (!props.multiple) return [...state.selectedKeys];
  if (
    mergeType.value === cascaderStrings.NONE_MERGE_TYPE ||
    props.checkRelation === cascaderStrings.UN_RELATED
  ) {
    return [...state.checkedKeys];
  }
  return [...state.resolvedCheckedKeys];
});
const hasValue = computed(() => displayKeys.value.length > 0);
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
const expandContent = computed(
  () => slots.expandIcon?.() ?? (hasRawProp('expandIcon') ? props.expandIcon : undefined),
);
const panelExpandContent = computed(() =>
  typeof expandContent.value === 'boolean'
    ? null
    : (expandContent.value as NormalizedPanelNode | undefined),
);
const topContent = computed(
  () => slots.top?.() ?? (hasRawProp('topSlot') ? props.topSlot : undefined),
);
const bottomContent = computed(
  () => slots.bottom?.() ?? (hasRawProp('bottomSlot') ? props.bottomSlot : undefined),
);
const emptyContent = computed<VNodeChild>(() => {
  if (slots.empty) return slots.empty();
  if (hasRawProp('emptyContent')) return props.emptyContent;
  const locale = config.value.locale.Cascader as { emptyText?: string } | undefined;
  return locale?.emptyText ?? (config.value.locale.code === 'en-US' ? 'No Data' : '暂无数据');
});
const panelEmptyContent = computed(() =>
  typeof emptyContent.value === 'boolean'
    ? null
    : (emptyContent.value as NormalizedPanelNode | undefined),
);
const popupContainer = computed(() => props.getPopupContainer ?? config.value.getPopupContainer);
const popoverOptionalProps = computed(() => ({
  ...(popupContainer.value ? { getPopupContainer: popupContainer.value } : {}),
  ...(props.dropdownMargin !== undefined ? { margin: props.dropdownMargin } : {}),
  ...(props.mouseEnterDelay !== undefined ? { mouseEnterDelay: props.mouseEnterDelay } : {}),
  ...(props.mouseLeaveDelay !== undefined ? { mouseLeaveDelay: props.mouseLeaveDelay } : {}),
}));
const panelOptionalProps = computed(() => ({
  ...(panelExpandContent.value !== undefined ? { expandIcon: panelExpandContent.value } : {}),
  ...(slots.filter || props.filterRender ? { filterRender: resolveFilterRender } : {}),
  ...(props.loadData ? { loadData: props.loadData } : {}),
  ...(props.virtualizeInSearch ? { virtualize: props.virtualizeInSearch } : {}),
}));
const tagInputOptionalProps = computed(() => ({
  ...(props.maxTagCount !== undefined ? { maxTagCount: props.maxTagCount } : {}),
  ...(props.preventScroll !== undefined ? { preventScroll: props.preventScroll } : {}),
}));
const triggerClasses = computed(() => [
  'semi-cascader',
  props.class,
  props.className,
  attrs.class,
  props.borderless ? 'semi-cascader-borderless' : undefined,
  state.isFocus || (state.isOpen && !state.isInput) ? 'semi-cascader-focus' : undefined,
  props.disabled ? 'semi-cascader-disabled' : undefined,
  'semi-cascader-single',
  filterable.value ? 'semi-cascader-filterable' : undefined,
  props.validateStatus === 'error' ? 'semi-cascader-error' : undefined,
  props.validateStatus === 'warning' ? 'semi-cascader-warning' : undefined,
  props.size === 'small' ? 'semi-cascader-small' : undefined,
  props.size === 'large' ? 'semi-cascader-large' : undefined,
  prefixContent.value || insetLabelContent.value ? 'semi-cascader-with-prefix' : undefined,
  suffixContent.value ? 'semi-cascader-with-suffix' : undefined,
]);
const showClearButton = computed(
  () =>
    props.showClear &&
    (Boolean(state.inputValue) || hasValue.value) &&
    !props.disabled &&
    (state.isOpen || state.isHovering),
);
const singleDisplay = computed<VNodeChild>(() => {
  const key = [...state.selectedKeys][0];
  if (!key) return undefined;
  const path = foundation.getItemPropPath(key, props.displayProp) as VNodeChild[];
  const content = path.flatMap((item, index) =>
    index < path.length - 1 ? [item, props.separator] : [item],
  );
  return slots.display?.({ selected: path }) ?? props.displayRender?.(path) ?? content;
});
const searchDisplay = computed<VNodeChild>(() => singleDisplay.value ?? state.inputPlaceHolder);

function entityTagContent(entity: CascaderEntity, index: number): VNodeChild {
  return (
    slots.display?.({ selected: entity, index }) ??
    props.displayRender?.(entity, index) ??
    (entity.data[props.displayProp] as VNodeChild)
  );
}
function renderTag(key: string, index: number): VNodeChild {
  const entity = state.keyEntities[key];
  if (!entity) return undefined;
  const disabled =
    props.disabled ||
    Boolean(entity.data[keyDisabledName.value]) ||
    (props.disableStrictly && state.disabledKeys.has(key));
  return h(
    Tag,
    {
      key: `cascader-tag-${key}-${index}`,
      className: [
        'semi-cascader-selection-tag',
        disabled ? 'semi-cascader-selection-tag-disabled' : undefined,
      ],
      closable: true,
      color: 'white',
      size: props.size === 'default' ? 'large' : props.size,
      tagKey: key,
      onClose: (_content: VNodeChild, event: MouseEvent | KeyboardEvent) => {
        event.preventDefault();
        if (!disabled) foundation.handleTagRemoveByKey(key);
      },
    },
    { default: () => entityTagContent(entity, index) },
  );
}
const visibleTagNodes = computed(() => {
  const count = props.maxTagCount ?? Number.POSITIVE_INFINITY;
  return displayKeys.value.slice(0, count).map(renderTag);
});
const hiddenTagNodes = computed(() => {
  const count = props.maxTagCount ?? Number.POSITIVE_INFINITY;
  return displayKeys.value.slice(count).map((key, index) => renderTag(key, index + count));
});
const triggerRenderProps = computed<CascaderTriggerRenderProps>(() => {
  let value: string | Set<string> | undefined;
  if (props.multiple) {
    value = new Set(
      displayKeys.value
        .map((key) => state.keyEntities[key]?.pos)
        .filter((position): position is string => Boolean(position)),
    );
  } else {
    value = state.keyEntities[[...state.selectedKeys][0] ?? '']?.pos;
  }
  const output: CascaderTriggerRenderProps = {
    componentProps: props as CascaderProps,
    disabled: props.disabled,
    inputValue: state.inputValue,
    placeholder: state.inputPlaceHolder,
    onSearch: search,
    onChange: search,
    onClear: (event) => handleClear(event),
    onRemove: (position) => foundation.handleTagRemoveInTrigger(position),
  };
  if (value !== undefined) output.value = value;
  return output;
});
const customTrigger = computed<VNodeChild>(
  () =>
    slots.trigger?.(triggerRenderProps.value) ?? props.triggerRender?.(triggerRenderProps.value),
);
function resolveFilterRender(filterProps: CascaderFilterRenderProps): VNodeChild {
  return slots.filter?.(filterProps) ?? props.filterRender?.(filterProps);
}

function handleTriggerClick(event: MouseEvent): void {
  foundation.handleClick(event);
}
function handleTriggerKeypress(event: KeyboardEvent): void {
  foundation.handleSelectionEnterPress(event);
}
function handleKeydown(event: KeyboardEvent): void {
  foundation.handleKeyDown(event);
}
function handleClear(event?: MouseEvent | KeyboardEvent): void {
  event?.stopPropagation?.();
  foundation.handleClear();
}
function handleClearKeypress(event: KeyboardEvent): void {
  event.stopPropagation();
  foundation.handleClearEnterPress(event);
}
function handlePopoverVisibleChange(visible: boolean): void {
  if (visible === state.isOpen) return;
  if (visible) foundation.open();
  else foundation.close();
}
function handleItemClick(
  event: MouseEvent | KeyboardEvent,
  item: CascaderEntity | CascaderFilterData,
): void {
  foundation.handleItemClick(event, item);
}
function handleItemHover(event: MouseEvent, item: CascaderEntity): void {
  foundation.handleItemHover(event, item);
}
function handleListScroll(event: Event, panelIndex: number): void {
  foundation.handleListScroll(event, panelIndex);
}
function handleCheck(item: CascaderEntity | CascaderFilterData): void {
  foundation.onItemCheckboxClick(item);
}
function search(value: string): void {
  if (!state.isOpen) foundation.open();
  foundation.handleInputChange(value);
}
function open(): void {
  foundation.open();
}
function close(): void {
  foundation.close();
}
function focus(): void {
  triggerRef.value?.focus({ preventScroll: props.preventScroll });
  foundation.focus();
}
function blur(): void {
  triggerRef.value?.blur();
  foundation.blur();
}
defineExpose<CascaderExposed>({ open, close, focus, blur, search });

watch(
  () => [props.treeData, props.keyMaps, props.multiple, props.disableStrictly] as const,
  () => {
    rebuildData();
    if (!mounted) return;
    if (props.multiple) foundation.recalculateFilteredKeys();
    else foundation.collectOptions();
  },
  { deep: true, immediate: true },
);
watch(
  incomingValue,
  (value) => {
    if (!controlled.value) return;
    if (props.multiple) syncMultipleValue(value);
    else foundation.handleValueChange(value);
  },
  { deep: true },
);
watch(
  () => [props.checkRelation, props.leafOnly, runtimeAutoMergeValue.value] as const,
  () => {
    if (props.multiple)
      syncMultipleValue(controlled.value ? incomingValue.value : props.defaultValue);
  },
);
watch(
  () => props.loadedKeys,
  (keys) => {
    if (!hasRawProp('loadedKeys')) return;
    loadedKeysRef.value = new Set(keys ?? []);
    state.loadedKeys = new Set(keys ?? []);
  },
  { deep: true },
);
watch(
  () => props.searchPlaceholder ?? props.placeholder,
  (placeholder) => {
    if (!hasValue.value) state.inputPlaceHolder = placeholder ?? '';
  },
);

onMounted(() => {
  mounted = true;
  foundation.init();
});
onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <Popover
    v-bind="popoverOptionalProps"
    :auto-adjust-overflow="runtimeAutoAdjustOverflow"
    :motion="runtimeMotion"
    :position="position ?? (config.direction === 'rtl' ? 'bottomRight' : 'bottomLeft')"
    :re-pos-key="state.rePosKey"
    :stop-propagation="runtimeStopPropagation"
    trigger="custom"
    :visible="state.isOpen"
    :z-index="zIndex"
    @after-close="foundation.updateSearching(false)"
    @visible-change="handlePopoverVisibleChange"
  >
    <template #content>
      <div
        ref="popup"
        role="listbox"
        :class="['semi-cascader-popover', dropdownClassName]"
        :style="popupStyle"
        @keydown="handleKeydown"
      >
        <CascaderNodeRenderer v-if="topContent != null" :content="topContent" />
        <CascaderPanel
          v-bind="panelOptionalProps"
          :active-keys="state.activeKeys"
          :checked-keys="state.checkedKeys"
          :data="renderData"
          :direction="config.direction"
          :empty-content="panelEmptyContent"
          :half-checked-keys="state.halfCheckedKeys"
          :keyword="state.inputValue"
          :loaded-keys="state.loadedKeys"
          :loading-keys="state.loadingKeys"
          :multiple="multiple"
          :searchable="filterable && state.isSearching"
          :selected-keys="state.selectedKeys"
          :separator="separator"
          :show-next="showNext"
          @check="handleCheck"
          @item-click="handleItemClick"
          @item-hover="handleItemHover"
          @list-scroll="handleListScroll"
        />
        <CascaderNodeRenderer v-if="bottomContent != null" :content="bottomContent" />
      </div>
    </template>

    <CascaderNodeRenderer v-if="customTrigger != null" :content="customTrigger" />
    <div
      v-else
      :id="id"
      ref="trigger"
      v-bind="dataAttrs"
      role="combobox"
      :aria-describedby="ariaDescribedby ?? (attrs['aria-describedby'] as string | undefined)"
      :aria-disabled="disabled"
      :aria-errormessage="ariaErrormessage ?? (attrs['aria-errormessage'] as string | undefined)"
      :aria-invalid="ariaInvalid ?? (attrs['aria-invalid'] as boolean | undefined)"
      :aria-label="ariaLabel ?? (attrs['aria-label'] as string | undefined) ?? 'Cascader'"
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
          'semi-cascader-prefix',
          insetLabelContent != null ? 'semi-cascader-inset-label' : undefined,
          typeof (prefixContent ?? insetLabelContent) === 'string'
            ? 'semi-cascader-prefix-text'
            : undefined,
        ]"
        x-semi-prop="prefix,insetLabel"
      >
        <CascaderNodeRenderer :content="prefixContent ?? insetLabelContent" />
      </div>
      <div
        :class="[
          'semi-cascader-selection',
          multiple && hasValue ? 'semi-cascader-selection-multiple' : undefined,
        ]"
      >
        <template v-if="triggerSearch">
          <TagInput
            v-if="multiple"
            ref="tagInput"
            v-bind="tagInputOptionalProps"
            class-name="semi-cascader-tagInput-wrapper"
            :disabled="disabled"
            :expand-rest-tags-on-click="false"
            :input-value="state.inputValue"
            :model-value="displayKeys"
            :placeholder="state.inputPlaceHolder"
            :render-tag-item="renderTag"
            :rest-tags-popover-props="restTagsPopoverProps"
            :show-rest-tags-popover="showRestTagsPopover"
            :size="size"
            @input-change="search"
            @remove="foundation.handleTagRemoveByKey"
          />
          <div
            v-else
            :class="[
              'semi-cascader-search-wrapper',
              size !== 'default' ? `semi-cascader-search-wrapper-${size}` : undefined,
            ]"
          >
            <span
              :class="[
                !singleDisplay ? 'semi-cascader-selection-placeholder' : undefined,
                state.showInput && state.inputValue
                  ? 'semi-cascader-selection-text-hide'
                  : undefined,
                state.showInput && !state.inputValue
                  ? 'semi-cascader-selection-text-inactive'
                  : undefined,
              ]"
            >
              <CascaderNodeRenderer :content="searchDisplay" />
            </span>
            <Input
              v-if="state.showInput"
              ref="input"
              class-name="semi-cascader-input"
              :disabled="disabled"
              :model-value="state.inputValue"
              :prevent-scroll="preventScroll"
              :size="size"
              @change="search"
            />
          </div>
        </template>
        <span
          v-else-if="!multiple"
          :class="!singleDisplay ? 'semi-cascader-selection-placeholder' : undefined"
        >
          <CascaderNodeRenderer :content="singleDisplay ?? placeholder" />
        </span>
        <template v-else-if="hasValue">
          <CascaderNodeRenderer
            v-for="(tag, index) in visibleTagNodes"
            :key="index"
            :content="tag"
          />
          <Popover
            v-if="hiddenTagNodes.length && showRestTagsPopover"
            :auto-adjust-overflow="true"
            :content="hiddenTagNodes"
            position="top"
            :show-arrow="true"
            trigger="hover"
            v-bind="restTagsPopoverProps"
          >
            <span class="semi-cascader-selection-n">+{{ hiddenTagNodes.length }}</span>
          </Popover>
          <span v-else-if="hiddenTagNodes.length" class="semi-cascader-selection-n">
            +{{ hiddenTagNodes.length }}
          </span>
        </template>
        <span v-else class="semi-cascader-selection-placeholder">{{ placeholder }}</span>
      </div>
      <div v-if="suffixContent != null" class="semi-cascader-suffix" x-semi-prop="suffix">
        <CascaderNodeRenderer :content="suffixContent" />
      </div>
      <div
        v-if="showClearButton"
        role="button"
        tabindex="0"
        aria-label="Clear Cascader value"
        class="semi-cascader-clearbtn"
        @click="handleClear"
        @keypress="handleClearKeypress"
      >
        <CascaderNodeRenderer :content="clearContent" />
      </div>
      <div v-else-if="arrowContent != null" class="semi-cascader-arrow" x-semi-prop="arrowIcon">
        <CascaderNodeRenderer :content="arrowContent" />
      </div>
    </div>
  </Popover>
</template>
