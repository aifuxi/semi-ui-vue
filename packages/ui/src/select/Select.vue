<script setup lang="ts">
import {
  IconChevronDown,
  IconClear,
  IconClose,
  IconSearch,
  IconTick,
} from '@aifuxi/semi-icons-vue';
import {
  Fragment,
  Text,
  computed,
  getCurrentInstance,
  inject,
  isVNode,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useAttrs,
  useId,
  useSlots,
  useTemplateRef,
  watch,
  type CSSProperties,
  type VNode,
  type VNodeChild,
} from 'vue';

import { configContextKey, semiGlobal, type ConfigContextValue } from '../config-provider';
import Tooltip from '../tooltip/Tooltip.vue';
import SelectNodeRenderer from './SelectNodeRenderer';
import SelectOptionCollector from './SelectOptionCollector';
import SelectFragment from './SelectFragment';
import type {
  SelectEmits,
  SelectExposed,
  SelectOptionGroupRuntime,
  SelectOptionRuntime,
  SelectProps,
  SelectSlots,
} from './types';
import { useSelectFoundation } from './use-select-foundation';
import type { SelectRuntimeProps } from './use-select-foundation';

defineOptions({ name: 'Select', inheritAttrs: false });
const props = defineProps<SelectProps>();
const emit = defineEmits<SelectEmits>();
defineSlots<SelectSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const injectedConfig = inject(configContextKey, undefined);
const triggerElement = useTemplateRef<HTMLDivElement>('triggerElement');
const listElement = useTemplateRef<HTMLDivElement>('listElement');
const multipleContentElement = useTemplateRef<HTMLDivElement>('multipleContentElement');
const selectId = props.id ?? `semi-select-${useId().replaceAll(':', '')}`;
const listId = `${selectId}-list`;
const virtualScrollTop = shallowRef(0);
const adaptiveTagCount = shallowRef<number>();
const tagWidthCache = new Map<number, number>();
let tagResizeObserver: ResizeObserver | undefined;
let latestOptionNodes: VNodeChild = [];
let optionSignature = '';
let foundationMounted = false;

const config = computed<ConfigContextValue>(
  () =>
    injectedConfig?.value ??
    ({
      direction: 'ltr',
      getPopupContainer: undefined,
    } as ConfigContextValue),
);
const selectLocale = computed(
  () => (config.value.locale?.Select ?? {}) as { createText?: string; emptyContent?: VNodeChild },
);

function resolveProp<Key extends keyof SelectProps>(
  key: Key,
  fallback: NonNullable<SelectProps[Key]>,
): NonNullable<SelectProps[Key]> {
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  const rawProps = instance?.vnode.props;
  const explicit = Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, key) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabKey)),
  );
  if (explicit && props[key] !== undefined) return props[key] as NonNullable<SelectProps[Key]>;
  const globalValue = semiGlobal.config.overrideDefaultProps?.Select?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<SelectProps[Key]>;
}

const runtimeProps = computed<SelectRuntimeProps>(
  () =>
    ({
      ...props,
      allowCreate: resolveProp('allowCreate', false),
      autoAdjustOverflow: resolveProp('autoAdjustOverflow', true),
      autoClearSearchValue: resolveProp('autoClearSearchValue', true),
      borderless: resolveProp('borderless', false),
      defaultActiveFirstOption: resolveProp('defaultActiveFirstOption', true),
      defaultOpen: resolveProp('defaultOpen', false),
      disabled: resolveProp('disabled', false),
      dropdownMatchSelectWidth: resolveProp('dropdownMatchSelectWidth', true),
      filter: resolveProp('filter', false),
      maxHeight: resolveProp('maxHeight', 270),
      motion: resolveProp('motion', true),
      multiple: resolveProp('multiple', false),
      onChangeWithObject: resolveProp('onChangeWithObject', false),
      placeholder: resolveProp('placeholder', ''),
      remote: resolveProp('remote', false),
      searchPosition: resolveProp('searchPosition', 'trigger'),
      showArrow: resolveProp('showArrow', true),
      showClear: resolveProp('showClear', false),
      showRestTagsPopover: resolveProp('showRestTagsPopover', false),
      size: resolveProp('size', 'default'),
      stopPropagation: resolveProp('stopPropagation', true),
      validateStatus: resolveProp('validateStatus', 'default'),
      zIndex: resolveProp('zIndex', 1030),
    }) as SelectRuntimeProps,
);
const controlled = computed(() => {
  const raw = instance?.vnode.props;
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, 'value') ||
      Object.prototype.hasOwnProperty.call(raw, 'modelValue') ||
      Object.prototype.hasOwnProperty.call(raw, 'model-value')),
  );
});

function flatten(nodes: VNodeChild): VNode[] {
  const output: VNode[] = [];
  const visit = (node: VNodeChild): void => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!isVNode(node)) return;
    if (node.type === Fragment && Array.isArray(node.children))
      return node.children.forEach((child) => visit(child as VNodeChild));
    output.push(node);
  };
  visit(nodes);
  return output;
}

function vnodeSlot(node: VNode): VNodeChild {
  const children = node.children;
  if (children && typeof children === 'object' && !Array.isArray(children)) {
    const defaultSlot = (children as { default?: () => VNodeChild }).default;
    if (defaultSlot) return defaultSlot();
  }
  return children as VNodeChild;
}

function componentName(node: VNode): string | undefined {
  if (typeof node.type !== 'object') return undefined;
  const type = node.type as { name?: string; __name?: string };
  return type.name ?? type.__name;
}

function plainText(nodes: VNodeChild): string | undefined {
  let output = '';
  let found = false;
  const visit = (node: VNodeChild): boolean => {
    if (Array.isArray(node)) return node.every(visit);
    if (typeof node === 'string' || typeof node === 'number') {
      output += String(node);
      found = true;
      return true;
    }
    if (!isVNode(node)) return node == null;
    if (node.type === Text) return visit(node.children as VNodeChild);
    if (node.type === Fragment && Array.isArray(node.children))
      return node.children.every((child) => visit(child as VNodeChild));
    return false;
  };
  return visit(nodes) && found ? output : undefined;
}

function collectOptions(): SelectOptionRuntime[] {
  if (runtimeProps.value.optionList?.length) {
    return runtimeProps.value.optionList.map((option, index) => ({
      _scrollIndex: index,
      _selected: false,
      _show: true,
      showTick: true,
      ...option,
      label: option.label ?? option.value,
    }));
  }
  const result: SelectOptionRuntime[] = [];
  const appendOption = (node: VNode, parent?: SelectOptionGroupRuntime): void => {
    const optionProps = (node.props ?? {}) as Record<string, unknown>;
    const children = vnodeSlot(node);
    const textLabel = plainText(children);
    const disabled =
      Object.prototype.hasOwnProperty.call(optionProps, 'disabled') &&
      optionProps.disabled !== false;
    const showTick =
      !Object.prototype.hasOwnProperty.call(optionProps, 'showTick') ||
      optionProps.showTick !== false;
    result.push({
      ...optionProps,
      _key: node.key ?? result.length,
      ...(parent ? { _parentGroup: parent } : {}),
      _scrollIndex: result.length,
      _selected: false,
      _show: true,
      children,
      disabled,
      label:
        (optionProps.label as VNodeChild | undefined) ??
        textLabel ??
        children ??
        (optionProps.value as VNodeChild),
      showTick,
      ...(optionProps.value === undefined ? {} : { value: optionProps.value as string | number }),
    });
  };
  for (const node of flatten(latestOptionNodes)) {
    const name = componentName(node);
    if (name === 'SelectOption') appendOption(node);
    if (name === 'SelectOptionGroup') {
      const groupProps = (node.props ?? {}) as Record<string, unknown>;
      const group: SelectOptionGroupRuntime = {
        _key: node.key ?? result.length,
        class: groupProps.class as SelectOptionGroupRuntime['class'],
        label: groupProps.label as VNodeChild,
        style: groupProps.style as CSSProperties,
      };
      for (const child of flatten(vnodeSlot(node)))
        if (componentName(child) === 'SelectOption') appendOption(child, group);
    }
  }
  return result;
}

function collectRenderedOptions(nodes: VNodeChild): void {
  latestOptionNodes = nodes;
  const nextSignature = flatten(nodes).map((node) => ({
    key: node.key,
    name: componentName(node),
    value: node.props?.value,
    label:
      typeof node.props?.label === 'string' || typeof node.props?.label === 'number'
        ? node.props.label
        : node.props?.label === undefined
          ? undefined
          : '[VNode]',
    disabled: node.props?.disabled,
    children: String(vnodeSlot(node)),
  }));
  const serialized = JSON.stringify(nextSignature);
  if (serialized === optionSignature) return;
  optionSignature = serialized;
  if (typeof document === 'undefined' && state.options.length === 0) {
    const options = collectOptions();
    const rawValue = controlled.value
      ? (runtimeProps.value.value ?? runtimeProps.value.modelValue)
      : runtimeProps.value.defaultValue;
    const values = runtimeProps.value.multiple
      ? Array.isArray(rawValue)
        ? rawValue
        : rawValue === undefined
          ? []
          : [rawValue]
      : rawValue === undefined
        ? []
        : [rawValue];
    const selections = new Map<unknown, SelectOptionRuntime>();
    state.options = options.map((option) => {
      const selected = values.some((value) =>
        runtimeProps.value.onChangeWithObject && typeof value === 'object' && value !== null
          ? (value as { value?: unknown }).value === option.value
          : value === option.value,
      );
      const nextOption = { ...option, _selected: selected };
      if (selected) selections.set(option.value, nextOption);
      return nextOption;
    });
    state.selections = selections;
  }
  if (foundationMounted) {
    queueMicrotask(() => {
      foundation.handleOptionListChange();
      if (!controlled.value) foundation.handleOptionListChangeHadDefaultValue();
    });
  }
}

const { foundation, state } = useSelectFoundation({
  controlled,
  emit,
  getOptions: collectOptions,
  listElement,
  runtimeProps,
  triggerElement,
});
queueMicrotask(() => {
  foundationMounted = true;
});

const visibleOptions = computed(() => state.options.filter((option) => option._show));
const selectedItems = computed(() => [...state.selections.values()]);
const shownTags = computed(() => {
  if (runtimeProps.value.expandRestTagsOnClick && state.isOpen) {
    return selectedItems.value;
  }
  const explicitLimit = runtimeProps.value.maxTagCount ?? selectedItems.value.length;
  const adaptiveLimit = runtimeProps.value.ellipsisTrigger
    ? (adaptiveTagCount.value ?? explicitLimit)
    : explicitLimit;
  return selectedItems.value.slice(0, Math.min(explicitLimit, adaptiveLimit));
});
const hiddenTagCount = computed(() => selectedItems.value.length - shownTags.value.length);
const renderEllipsisTags = computed(
  () =>
    Boolean(runtimeProps.value.ellipsisTrigger) &&
    !(runtimeProps.value.expandRestTagsOnClick && state.isOpen),
);
const renderTagGroup = computed(
  () =>
    Boolean(runtimeProps.value.maxTagCount) &&
    !renderEllipsisTags.value &&
    !(runtimeProps.value.expandRestTagsOnClick && state.isOpen),
);
const tagContainer = computed(() =>
  renderTagGroup.value || renderEllipsisTags.value ? 'div' : SelectFragment,
);
const tagContainerProps = computed(() =>
  renderTagGroup.value
    ? { class: 'semi-tag-group semi-tag-group-max semi-tag-group-large' }
    : renderEllipsisTags.value
      ? { class: 'semi-select-content-wrapper-collapse' }
      : {},
);
const tagItemsContainer = computed(() => (renderEllipsisTags.value ? 'div' : SelectFragment));
const tagItemsContainerProps = computed(() =>
  renderEllipsisTags.value ? { class: 'semi-overflow-list' } : {},
);
const groupedOptions = computed(() => {
  const entries: Array<{
    group: SelectOptionGroupRuntime | undefined;
    option: SelectOptionRuntime;
    index: number;
    first: boolean;
  }> = [];
  const seen = new Set<unknown>();
  visibleOptions.value.forEach((option, index) => {
    const key = option._parentGroup?._key ?? option._parentGroup?.label;
    const first = option._parentGroup !== undefined && !seen.has(key);
    if (first) seen.add(key);
    entries.push({ group: option._parentGroup, option, index, first });
  });
  return entries;
});
const virtualWindow = computed(() => {
  if (!runtimeProps.value.virtualize) return groupedOptions.value;
  const itemSize = runtimeProps.value.virtualize.itemSize ?? 32;
  const height = runtimeProps.value.virtualize.height ?? 270;
  const start = Math.max(0, Math.floor(virtualScrollTop.value / itemSize) - 2);
  const count = Math.ceil(height / itemSize) + 4;
  return groupedOptions.value.slice(start, start + count);
});
const triggerClasses = computed(() => [
  attrs.class,
  'semi-select',
  runtimeProps.value.borderless ? 'semi-select-borderless' : undefined,
  state.isOpen ? 'semi-select-open' : undefined,
  state.isFocus ? 'semi-select-focus' : undefined,
  runtimeProps.value.disabled ? 'semi-select-disabled' : undefined,
  runtimeProps.value.multiple ? 'semi-select-multiple' : 'semi-select-single',
  runtimeProps.value.filter ? 'semi-select-filterable' : undefined,
  runtimeProps.value.size === 'small' ? 'semi-select-small' : undefined,
  runtimeProps.value.size === 'large' ? 'semi-select-large' : undefined,
  runtimeProps.value.validateStatus === 'error' ? 'semi-select-error' : undefined,
  runtimeProps.value.validateStatus === 'warning' ? 'semi-select-warning' : undefined,
  !runtimeProps.value.showArrow ? 'semi-select-no-arrow' : undefined,
  slots.prefix || slots.insetLabel ? 'semi-select-with-prefix' : undefined,
  slots.suffix ? 'semi-select-with-suffix' : undefined,
]);
const showClear = computed(
  () =>
    runtimeProps.value.showClear &&
    !runtimeProps.value.disabled &&
    (selectedItems.value.length > 0 || state.inputValue) &&
    (state.isHovering || state.isOpen),
);
const listStyle = computed<CSSProperties>(() => ({
  maxHeight:
    typeof runtimeProps.value.maxHeight === 'number'
      ? `${runtimeProps.value.maxHeight}px`
      : runtimeProps.value.maxHeight,
  ...(runtimeProps.value.virtualize
    ? { height: `${runtimeProps.value.virtualize.height ?? 270}px`, position: 'relative' }
    : {}),
}));
const dropdownStyle = computed(() => [
  {
    minWidth:
      typeof state.dropdownMinWidth === 'number'
        ? `${state.dropdownMinWidth}px`
        : state.dropdownMinWidth,
  },
  runtimeProps.value.dropdownStyle,
]);
const popupContainer = computed(
  () => runtimeProps.value.getPopupContainer ?? config.value.getPopupContainer,
);
const activeDescendant = computed(() =>
  state.focusIndex >= 0 ? `${selectId}-option-${state.focusIndex}` : '',
);

function elementOuterWidth(element: HTMLElement): number {
  const style = getComputedStyle(element);
  return (
    element.getBoundingClientRect().width +
    Number.parseFloat(style.marginLeft || '0') +
    Number.parseFloat(style.marginRight || '0')
  );
}

function measureEllipsisTags(): void {
  if (!runtimeProps.value.ellipsisTrigger) {
    adaptiveTagCount.value = undefined;
    tagWidthCache.clear();
    return;
  }
  const container = multipleContentElement.value;
  if (!container) return;
  for (const element of container.querySelectorAll<HTMLElement>('[data-select-tag-index]')) {
    const index = Number(element.dataset.selectTagIndex);
    if (Number.isInteger(index)) tagWidthCache.set(index, elementOuterWidth(element));
  }
  const total = selectedItems.value.length;
  const candidateLimit = Math.min(runtimeProps.value.maxTagCount ?? total, total);
  const collapseElement = container.querySelector<HTMLElement>('[data-select-collapse-tag]');
  const collapseWidth = collapseElement ? elementOuterWidth(collapseElement) : 28;
  const availableWidth = container.clientWidth;
  let occupiedWidth = 0;
  let visibleCount = 0;
  for (let index = 0; index < candidateLimit; index += 1) {
    const tagWidth = tagWidthCache.get(index);
    if (tagWidth === undefined) break;
    const willCollapse = index + 1 < total;
    if (occupiedWidth + tagWidth + (willCollapse ? collapseWidth : 0) > availableWidth) break;
    occupiedWidth += tagWidth;
    visibleCount += 1;
  }
  adaptiveTagCount.value = visibleCount;
}

function scheduleEllipsisMeasurement(): void {
  void nextTick(() => measureEllipsisTags());
}

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined' && multipleContentElement.value) {
    tagResizeObserver = new ResizeObserver(scheduleEllipsisMeasurement);
    tagResizeObserver.observe(multipleContentElement.value);
  }
  window.addEventListener('resize', scheduleEllipsisMeasurement);
  scheduleEllipsisMeasurement();
});
onBeforeUnmount(() => {
  tagResizeObserver?.disconnect();
  window.removeEventListener('resize', scheduleEllipsisMeasurement);
});
watch(
  () => [
    selectedItems.value.map((option) => option.value),
    runtimeProps.value.ellipsisTrigger,
    runtimeProps.value.maxTagCount,
  ],
  scheduleEllipsisMeasurement,
  { deep: true },
);

function inputChanged(event: Event): void {
  foundation.handleInputChange((event.target as HTMLInputElement).value, event);
}
function clear(event: MouseEvent): void {
  foundation.handleClearClick(event);
}
function selectOption(option: SelectOptionRuntime, index: number, event: MouseEvent): void {
  if (!option.disabled) foundation.onSelect(option, index, event);
}
function optionContent(option: SelectOptionRuntime): VNodeChild {
  return option.label ?? option.children ?? option.value;
}
function maxHeightVirtualStyle(entryIndex: number): CSSProperties | undefined {
  if (!runtimeProps.value.virtualize) return undefined;
  const itemSize = runtimeProps.value.virtualize.itemSize ?? 32;
  return {
    position: 'absolute',
    left: 0,
    right: 0,
    top: `${entryIndex * itemSize}px`,
    height: `${itemSize}px`,
  };
}
function handleListScroll(event: Event): void {
  virtualScrollTop.value = (event.currentTarget as HTMLElement).scrollTop;
  foundation.handleListScroll(event);
}
function open(): void {
  foundation.open();
}
function close(): void {
  foundation.close();
}
function focus(): void {
  foundation.focus(undefined, false);
}
function clearInput(): void {
  foundation.clearInput();
}
function deselectAll(): void {
  foundation.clearSelected();
}
function selectAll(): void {
  foundation.selectAll();
}
function search(value: string, event?: Event): void {
  foundation.handleInputChange(value, event);
}
function rePosition(): void {
  state.optionKey += 1;
}
defineExpose<SelectExposed>({
  clearInput,
  close,
  deselectAll,
  focus,
  open,
  rePosition,
  search,
  selectAll,
});
</script>

<template>
  <SelectOptionCollector :collect="collectRenderedOptions"><slot /></SelectOptionCollector>
  <Tooltip
    prefix-cls="semi-popover"
    role="presentation"
    trigger="custom"
    :visible="state.isOpen"
    :position="runtimeProps.position ?? (config.direction === 'rtl' ? 'bottomRight' : 'bottomLeft')"
    :show-arrow="false"
    :spacing="runtimeProps.spacing ?? 4"
    :z-index="runtimeProps.zIndex"
    :motion="runtimeProps.motion"
    :auto-adjust-overflow="runtimeProps.autoAdjustOverflow"
    :margin="runtimeProps.dropdownMargin ?? 0"
    :mouse-enter-delay="runtimeProps.mouseEnterDelay ?? 0"
    :mouse-leave-delay="runtimeProps.mouseLeaveDelay ?? 0"
    :stop-propagation="runtimeProps.stopPropagation"
    :re-pos-key="`${state.optionKey}-${runtimeProps.rePosKey ?? ''}`"
    v-bind="popupContainer ? { getPopupContainer: popupContainer } : {}"
    @after-close="() => foundation.handlePopoverClose()"
    @update:visible="
      (visible) => {
        if (!visible && state.isOpen) foundation.close();
      }
    "
  >
    <template #content>
      <div
        :class="['semi-select-option-list-wrapper', runtimeProps.dropdownClassName]"
        :style="dropdownStyle"
        @keydown="foundation.handleContainerKeyDown"
      >
        <div
          v-if="$slots.outerTop"
          class="semi-select-option-list-outer-top-slot"
          @mouseenter="foundation.handleSlotMouseEnter()"
        >
          <slot name="outerTop" />
        </div>
        <div
          v-if="runtimeProps.filter && runtimeProps.searchPosition === 'dropdown'"
          class="semi-select-dropdown-search-wrapper"
        >
          <div class="semi-input-wrapper semi-input-wrapper-default semi-input-wrapper-prefix">
            <span class="semi-input-prefix"><IconSearch /></span>
            <input
              class="semi-input semi-input-default semi-select-dropdown-input"
              :value="state.inputValue"
              :placeholder="runtimeProps.searchPlaceholder"
              :aria-activedescendant="activeDescendant"
              @input="inputChanged"
              @keydown="foundation._handleKeyDown"
            />
          </div>
        </div>
        <div
          :id="listId"
          ref="listElement"
          :class="[
            'semi-select-option-list',
            selectedItems.length ? 'semi-select-option-list-chosen' : undefined,
          ]"
          :style="listStyle"
          role="listbox"
          :aria-multiselectable="runtimeProps.multiple"
          @scroll="handleListScroll"
        >
          <div
            v-if="$slots.innerTop"
            class="semi-select-option-list-inner-top-slot"
            @mouseenter="foundation.handleSlotMouseEnter()"
          >
            <slot name="innerTop" />
          </div>
          <div v-if="runtimeProps.loading" class="semi-select-loading-wrapper">
            <span class="semi-spin semi-spin-middle"
              ><span class="semi-spin-wrapper"><span class="semi-spin-spinIcon" /></span
            ></span>
          </div>
          <template v-else-if="visibleOptions.length">
            <div
              v-if="runtimeProps.virtualize"
              aria-hidden="true"
              :style="{
                height: `${groupedOptions.length * (runtimeProps.virtualize.itemSize ?? 32)}px`,
              }"
            />
            <template
              v-for="entry in virtualWindow"
              :key="
                entry.option._key ?? `${entry.option.label}-${entry.option.value}-${entry.index}`
              "
            >
              <div
                v-if="entry.first"
                :class="['semi-select-group', entry.group?.class]"
                :style="entry.group?.style"
              >
                <SelectNodeRenderer :content="entry.group?.label" />
              </div>
              <div
                v-if="entry.option._inputCreateOnly && $slots.createItem"
                role="button"
                aria-label="Use the input box to create an optional item"
                @click="selectOption(entry.option, entry.index, $event)"
                @mouseenter="foundation.handleOptionMouseEnter(entry.index)"
              >
                <slot
                  name="createItem"
                  :input-value="entry.option.value ?? state.inputValue"
                  :focused="entry.index === state.focusIndex"
                  :style="entry.option.style"
                />
              </div>
              <slot
                v-else-if="$slots.option"
                name="option"
                v-bind="entry.option"
                :focused="entry.index === state.focusIndex"
                :selected="entry.option._selected"
                :input-value="state.inputValue"
                :on-click="(event) => selectOption(entry.option, entry.index, event)"
                :on-mouseenter="() => foundation.handleOptionMouseEnter(entry.index)"
              />
              <div
                v-else
                :id="`${selectId}-option-${entry.index}`"
                :class="[
                  'semi-select-option',
                  entry.option.class,
                  entry.option.disabled ? 'semi-select-option-disabled' : undefined,
                  entry.option._selected ? 'semi-select-option-selected' : undefined,
                  entry.index === state.focusIndex ? 'semi-select-option-focused' : undefined,
                ]"
                :style="[entry.option.style, maxHeightVirtualStyle(entry.index)]"
                :data-option-index="entry.index"
                role="option"
                :aria-selected="entry.option._selected"
                :aria-disabled="Boolean(entry.option.disabled)"
                @click="selectOption(entry.option, entry.index, $event)"
                @mouseenter="foundation.handleOptionMouseEnter(entry.index)"
              >
                <div v-if="entry.option.showTick !== false" class="semi-select-option-icon">
                  <IconTick />
                </div>
                <div class="semi-select-option-text">
                  <template v-if="entry.option._inputCreateOnly">
                    <span class="semi-select-create-tips">{{
                      selectLocale.createText ?? '创建'
                    }}</span
                    >{{ entry.option.value }}
                  </template>
                  <template
                    v-else-if="typeof optionContent(entry.option) === 'string' && state.inputValue"
                  >
                    <template
                      v-for="(part, partIndex) in String(optionContent(entry.option)).split(
                        new RegExp(
                          `(${state.inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
                          'ig',
                        ),
                      )"
                      :key="partIndex"
                    >
                      <span
                        v-if="part.toLocaleLowerCase() === state.inputValue.toLocaleLowerCase()"
                        class="semi-select-option-keyword"
                        >{{ part }}</span
                      ><template v-else>{{ part }}</template>
                    </template>
                  </template>
                  <SelectNodeRenderer v-else :content="optionContent(entry.option)" />
                </div>
              </div>
            </template>
          </template>
          <div
            v-else-if="runtimeProps.emptyContent !== null"
            class="semi-select-option semi-select-option-empty"
            x-semi-prop="emptyContent"
          >
            <slot name="emptyContent"
              ><SelectNodeRenderer
                :content="runtimeProps.emptyContent ?? selectLocale.emptyContent ?? '暂无数据'"
            /></slot>
          </div>
          <div
            v-if="$slots.innerBottom"
            class="semi-select-option-list-inner-bottom-slot"
            @mouseenter="foundation.handleSlotMouseEnter()"
          >
            <slot name="innerBottom" />
          </div>
        </div>
        <div
          v-if="$slots.outerBottom"
          class="semi-select-option-list-outer-bottom-slot"
          @mouseenter="foundation.handleSlotMouseEnter()"
        >
          <slot name="outerBottom" />
        </div>
      </div>
    </template>

    <div
      :id="selectId"
      ref="triggerElement"
      role="combobox"
      :aria-disabled="runtimeProps.disabled"
      :aria-expanded="state.isOpen"
      :aria-controls="listId"
      aria-haspopup="listbox"
      :aria-label="selectedItems.length ? 'selected' : ''"
      :aria-invalid="props.ariaInvalid"
      :aria-errormessage="props.ariaErrormessage"
      :aria-labelledby="props.ariaLabelledby"
      :aria-describedby="props.ariaDescribedby"
      :aria-required="props.ariaRequired"
      :aria-activedescendant="activeDescendant"
      :class="triggerClasses"
      :style="attrs.style"
      :tabindex="
        runtimeProps.disabled || (runtimeProps.filter && (state.showInput || runtimeProps.multiple))
          ? -1
          : 0
      "
      v-bind="Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('data-')))"
      @click="foundation.handleClick"
      @mouseenter="foundation.handleMouseEnter"
      @mouseleave="foundation.handleMouseLeave"
      @focus="foundation.handleTriggerFocus"
      @blur="foundation.handleTriggerBlur"
      @keydown="state.keyboardEventSet.keydown?.($event)"
    >
      <slot
        v-if="$slots.trigger"
        name="trigger"
        :value="selectedItems"
        :input-value="state.inputValue"
        :disabled="runtimeProps.disabled"
        :placeholder="runtimeProps.placeholder"
        :on-search="search"
        :on-clear="clear"
        :on-remove="foundation.removeTag.bind(foundation)"
      />
      <template v-else>
        <div
          v-if="$slots.prefix || $slots.insetLabel"
          :id="props.insetLabelId"
          :class="[
            'semi-select-prefix',
            $slots.insetLabel ? 'semi-select-inset-label' : undefined,
            'semi-select-prefix-text',
          ]"
          x-semi-prop="prefix,insetLabel"
        >
          <slot v-if="$slots.prefix" name="prefix" />
          <slot v-else name="insetLabel" />
        </div>
        <div class="semi-select-selection">
          <div
            v-if="runtimeProps.multiple"
            ref="multipleContentElement"
            :class="[
              'semi-select-content-wrapper',
              selectedItems.length ? undefined : 'semi-select-content-wrapper-empty',
              (runtimeProps.maxTagCount || runtimeProps.ellipsisTrigger) && !state.isOpen
                ? 'semi-select-content-wrapper-one-line'
                : undefined,
            ]"
          >
            <component :is="tagContainer" v-if="selectedItems.length" v-bind="tagContainerProps">
              <component :is="tagItemsContainer" v-bind="tagItemsContainerProps">
                <div
                  v-for="(option, index) in shownTags"
                  :key="option.value ?? index"
                  :data-select-tag-index="index"
                  :class="[
                    'semi-tag semi-tag-large semi-tag-light semi-tag-white-light semi-tag-closable',
                    option.disabled || runtimeProps.disabled ? 'semi-tag-disabled' : undefined,
                  ]"
                  :aria-label="`Closable Tag: ${String(option.label ?? option.value ?? '')}`"
                  :aria-disabled="option.disabled || runtimeProps.disabled"
                  role="button"
                  tabindex="-1"
                >
                  <div class="semi-tag-content semi-tag-content-ellipsis">
                    <slot name="selectedItem" :option="option" :index="index"
                      ><SelectNodeRenderer :content="option.label"
                    /></slot>
                  </div>
                  <div
                    v-if="!option.disabled && !runtimeProps.disabled"
                    class="semi-tag-close"
                    @click.stop.prevent="foundation.removeTag(option)"
                  >
                    <IconClose size="small" />
                  </div>
                </div>
              </component>
              <Tooltip
                v-if="hiddenTagCount > 0 && runtimeProps.showRestTagsPopover"
                prefix-cls="semi-popover"
                position="top"
                :show-arrow="true"
                :auto-adjust-overflow="true"
                v-bind="runtimeProps.restTagsPopoverProps"
              >
                <template #content>
                  <div
                    class="semi-tag-group"
                    style="display: flex; flex-wrap: wrap; gap: 2px; max-width: 400px"
                  >
                    <div
                      v-for="(option, index) in selectedItems.slice(shownTags.length)"
                      :key="option.value ?? index"
                      class="semi-tag semi-tag-large semi-tag-light semi-tag-white-light"
                    >
                      <div class="semi-tag-content semi-tag-content-ellipsis">
                        <SelectNodeRenderer :content="option.label" />
                      </div>
                    </div>
                  </div>
                </template>
                <div
                  :class="[
                    'semi-tag semi-tag-large semi-tag-light semi-tag-grey-light',
                    renderEllipsisTags ? 'semi-select-content-wrapper-collapse-tag' : undefined,
                  ]"
                  data-select-collapse-tag
                  style="margin-right: 0; flex-shrink: 0; background-color: transparent"
                >
                  <div class="semi-tag-content semi-tag-content-ellipsis">
                    +{{ hiddenTagCount }}
                  </div>
                </div>
              </Tooltip>
              <div
                v-if="hiddenTagCount > 0 && !runtimeProps.showRestTagsPopover"
                :class="[
                  'semi-tag semi-tag-large semi-tag-light semi-tag-grey-light',
                  renderEllipsisTags ? 'semi-select-content-wrapper-collapse-tag' : undefined,
                ]"
                data-select-collapse-tag
                style="margin-right: 0; flex-shrink: 0; background-color: transparent"
              >
                <div class="semi-tag-content semi-tag-content-ellipsis">+{{ hiddenTagCount }}</div>
              </div>
            </component>
            <span
              v-else-if="!state.inputValue"
              class="semi-select-selection-text semi-select-selection-placeholder"
              ><SelectNodeRenderer :content="runtimeProps.placeholder"
            /></span>
            <div
              v-if="runtimeProps.filter && runtimeProps.searchPosition === 'trigger'"
              class="semi-input-wrapper semi-input-wrapper-default"
              :style="{ width: state.inputValue ? `${state.inputValue.length * 16}px` : '2px' }"
            >
              <input
                class="semi-input semi-input-default semi-select-input semi-select-input-multiple"
                :value="state.inputValue"
                :aria-activedescendant="activeDescendant"
                v-bind="runtimeProps.inputProps"
                @input="inputChanged"
                @focus.stop
                @blur="foundation.handleInputBlur"
              />
            </div>
          </div>
          <div v-else class="semi-select-content-wrapper">
            <span
              :class="[
                'semi-select-selection-text',
                selectedItems.length || state.inputValue
                  ? undefined
                  : 'semi-select-selection-placeholder',
                state.showInput ? 'semi-select-selection-text-inactive' : undefined,
              ]"
              ><slot
                v-if="selectedItems[0]"
                name="selectedItem"
                :option="selectedItems[0]"
                :index="0"
                ><SelectNodeRenderer :content="selectedItems[0].label" /></slot
              ><SelectNodeRenderer
                v-else-if="!state.inputValue"
                :content="runtimeProps.placeholder"
            /></span>
            <div
              v-if="
                runtimeProps.filter && runtimeProps.searchPosition === 'trigger' && state.showInput
              "
              class="semi-input-wrapper semi-input-wrapper-default"
            >
              <input
                class="semi-input semi-input-default semi-select-input semi-select-input-single"
                :value="state.inputValue"
                :aria-activedescendant="activeDescendant"
                v-bind="runtimeProps.inputProps"
                @input="inputChanged"
                @focus.stop
                @blur="foundation.handleInputBlur"
              />
            </div>
          </div>
        </div>
        <div v-if="$slots.suffix" class="semi-select-suffix"><slot name="suffix" /></div>
        <div v-if="showClear" class="semi-select-clear" @click="clear">
          <slot name="clearIcon"><IconClear /></slot>
        </div>
        <div v-else-if="runtimeProps.showArrow" class="semi-select-arrow">
          <slot name="arrowIcon"><IconChevronDown aria-label="" /></slot>
        </div>
        <div v-else class="semi-select-arrow-empty" />
      </template>
    </div>
  </Tooltip>
</template>
