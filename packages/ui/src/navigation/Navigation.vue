<script setup lang="ts">
import { NavigationFoundation, type NavigationAdapter } from '@workspace/foundation-integration';
import {
  Comment,
  Fragment,
  Text,
  computed,
  getCurrentInstance,
  inject,
  isVNode,
  markRaw,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowReactive,
  watch,
  type Component,
  type VNode,
  type VNodeChild,
} from 'vue';

import {
  DEFAULT_CONFIG_LOCALE,
  configContextKey,
  semiGlobal,
  type ConfigContextValue,
} from '../config-provider';
import NavFooter from './NavFooter.vue';
import NavHeader from './NavHeader.vue';
import NavItem from './NavItem';
import NavigationItemTree from './NavigationItemTree.vue';
import NavigationNodeRenderer from './NavigationNodeRenderer';
import SubNav from './SubNav.vue';
import { navigationContextKey, type NavigationContextValue } from './navigation-context';
import type {
  ItemKey,
  NavigationClickData,
  NavigationContent,
  NavigationEmits,
  NavigationItemInput,
  NavigationItemObject,
  NavigationLocale,
  NavigationOpenChangeData,
  NavigationProps,
  NavigationSelectData,
  NavigationSlots,
  NavigationState,
  NavigationWrapperData,
  NavFooterProps,
  NavHeaderProps,
} from './types';

const DEFAULT_ZH_CN_LOCALE: Readonly<NavigationLocale> = Object.freeze({
  collapseText: '收起侧边栏',
  expandText: '展开侧边栏',
});
const DEFAULT_EN_US_LOCALE: Readonly<NavigationLocale> = Object.freeze({
  collapseText: 'Collapse Sidebar',
  expandText: 'Expand Sidebar',
});

defineOptions({ name: 'Navigation', inheritAttrs: false });
const props = defineProps<NavigationProps>();
const emit = defineEmits<NavigationEmits>();
const slots = defineSlots<NavigationSlots>();
const instance = getCurrentInstance();
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({
        direction: 'ltr',
        locale: DEFAULT_CONFIG_LOCALE,
      } as ConfigContextValue),
);

function hasRawProp(name: keyof NavigationProps): boolean {
  const raw = instance?.vnode.props;
  const kebab = String(name).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

function resolveProp<Key extends keyof NavigationProps>(
  key: Key,
  fallback: NonNullable<NavigationProps[Key]>,
): NonNullable<NavigationProps[Key]> {
  if (hasRawProp(key) && props[key] !== undefined) {
    return props[key] as NonNullable<NavigationProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.Navigation?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<NavigationProps[Key]>;
}

const mode = computed(() => resolveProp('mode', 'vertical'));
const prefixCls = computed(() => resolveProp('prefixCls', 'semi-navigation'));
const limitIndent = computed(() => resolveProp('limitIndent', true));
const subNavMotion = computed(() => resolveProp('subNavMotion', true));
const subNavCloseDelay = computed(() => resolveProp('subNavCloseDelay', 100));
const subNavOpenDelay = computed(() => resolveProp('subNavOpenDelay', 0));
const tooltipShowDelay = computed(() => resolveProp('tooltipShowDelay', 0));
const tooltipHideDelay = computed(() => resolveProp('tooltipHideDelay', 100));
const toggleIconPosition = computed(() => resolveProp('toggleIconPosition', 'right'));
const direction = computed(() => config.value.direction);
const locale = computed<NavigationLocale>(() => {
  const providerLocale = config.value.locale.Navigation as NavigationLocale | undefined;
  return (
    providerLocale ??
    (config.value.locale.code === 'en-US' ? DEFAULT_EN_US_LOCALE : DEFAULT_ZH_CN_LOCALE)
  );
});
const getPopupContainer = computed(() => props.getPopupContainer ?? config.value.getPopupContainer);

function normalizeItem(item: NavigationItemInput): NavigationItemObject {
  if (typeof item === 'string') return { itemKey: item, text: item };
  const cloned: NavigationItemObject = { ...item };
  if (Array.isArray(item.items)) cloned.items = item.items.map(normalizeItem);
  return cloned;
}

const normalizedItems = computed(() => (props.items ?? []).map(normalizeItem));

function flattenRenderable(nodes: VNodeChild): VNode[] {
  const output: VNode[] = [];
  const visit = (node: VNodeChild): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!isVNode(node) || node.type === Comment) return;
    if (node.type === Fragment && Array.isArray(node.children)) {
      node.children.forEach((child) => visit(child as VNodeChild));
      return;
    }
    if (node.type === Text && String(node.children ?? '').trim() === '') return;
    output.push(node);
  };
  visit(nodes);
  return output;
}

function componentName(node: VNode): string | undefined {
  if (typeof node.type === 'string') return undefined;
  const type = node.type as Component & { __name?: string; name?: string };
  return type.name ?? type.__name;
}

function isHeader(node: VNode): boolean {
  return node.type === NavHeader || componentName(node) === 'NavHeader';
}

function isFooter(node: VNode): boolean {
  return node.type === NavFooter || componentName(node) === 'NavFooter';
}

const slotNodes = computed(() => flattenRenderable(slots.default?.() ?? []));
const headerNodes = computed(() => slotNodes.value.filter(isHeader));
const footerNodes = computed(() => slotNodes.value.filter(isFooter));
const bodyNodes = computed(() =>
  slotNodes.value.filter((node) => !isHeader(node) && !isFooter(node)),
);

function itemKeyFromVNode(node: VNode): ItemKey | undefined {
  const value = node.props?.itemKey ?? node.props?.['item-key'];
  return typeof value === 'string' || typeof value === 'number' ? value : undefined;
}

function vnodeChildren(node: VNode): VNode[] {
  if (!node.children || typeof node.children !== 'object' || Array.isArray(node.children))
    return [];
  const defaultSlot = (node.children as Record<string, unknown>).default;
  return typeof defaultSlot === 'function'
    ? flattenRenderable((defaultSlot as () => VNodeChild)())
    : [];
}

function buildSlotItemMap(
  nodes: VNode[],
  parentKeys: ItemKey[] = [],
  output: Record<string, ItemKey[]> = {},
): Record<string, ItemKey[]> {
  for (const node of nodes) {
    const name = componentName(node);
    if (node.type !== NavItem && node.type !== SubNav && name !== 'NavItem' && name !== 'SubNav') {
      continue;
    }
    const itemKey = itemKeyFromVNode(node);
    if (itemKey === undefined || itemKey === null || itemKey === '') continue;
    output[String(itemKey)] = [...parentKeys];
    if (node.type === SubNav || name === 'SubNav') {
      buildSlotItemMap(vnodeChildren(node), [...parentKeys, itemKey], output);
    }
  }
  return output;
}

const itemPropKeysMap = computed<Record<string, ItemKey[]>>(() =>
  NavigationFoundation.buildItemKeysMap(
    normalizedItems.value as unknown as Record<string, unknown>[],
  ),
);
const itemKeysMap = computed<Record<string, ItemKey[]>>(() => ({
  ...itemPropKeysMap.value,
  ...buildSlotItemMap(bodyNodes.value),
}));

const selectedKeysControlled = computed(() => hasRawProp('selectedKeys'));
const isCollapsedControlled = computed(() => hasRawProp('isCollapsed'));
const internalSelectedKeys = shallowReactive<ItemKey[]>([...(props.defaultSelectedKeys ?? [])]);
const internalOpenKeys = shallowReactive<ItemKey[]>([
  ...(props.openKeys ?? props.defaultOpenKeys ?? []),
]);
const internal = shallowReactive({
  isCollapsed: Boolean(props.defaultIsCollapsed),
});

const currentSelectedKeys = computed<ItemKey[]>(() =>
  selectedKeysControlled.value ? [...(props.selectedKeys ?? [])] : [...internalSelectedKeys],
);
const currentCollapsed = computed(() =>
  isCollapsedControlled.value ? Boolean(props.isCollapsed) : internal.isCollapsed,
);
const openKeysControlled = computed(
  () => hasRawProp('openKeys') && mode.value === 'vertical' && !currentCollapsed.value,
);
const currentOpenKeys = computed<ItemKey[]>(() =>
  openKeysControlled.value ? [...(props.openKeys ?? [])] : [...internalOpenKeys],
);
const selectedKeysWithParents = computed(() => {
  const parents = NavigationFoundation.getZeroParentKeys(
    itemKeysMap.value,
    ...currentSelectedKeys.value,
  );
  return Array.from(new Set([...currentSelectedKeys.value, ...parents]));
});

function replaceArray(target: ItemKey[], values: readonly ItemKey[]): void {
  target.splice(0, target.length, ...values);
}

function initialAutoOpen(
  keys: readonly ItemKey[],
  map: Record<string, ItemKey[]> = itemKeysMap.value,
): void {
  if (hasRawProp('openKeys') || hasRawProp('defaultOpenKeys') || mode.value !== 'vertical') return;
  const parents = NavigationFoundation.getZeroParentKeys(map, ...keys);
  replaceArray(internalOpenKeys, Array.from(new Set([...internalOpenKeys, ...parents])));
}

initialAutoOpen(currentSelectedKeys.value, itemPropKeysMap.value);
onMounted(() => initialAutoOpen(currentSelectedKeys.value));
watch(
  () => props.openKeys,
  (keys) => {
    if (hasRawProp('openKeys')) replaceArray(internalOpenKeys, keys ?? []);
  },
);
watch(
  () => props.selectedKeys,
  (keys) => {
    if (selectedKeysControlled.value) initialAutoOpen(keys ?? []);
  },
);

const state = computed<NavigationState>(() => ({
  isCollapsed: currentCollapsed.value,
  itemKeysMap: itemKeysMap.value,
  items: normalizedItems.value,
  openKeys: currentOpenKeys.value,
  selectedKeys: selectedKeysWithParents.value,
}));
const cache = new Map<unknown, unknown>();
let itemsChanged = true;

function foundationProps(): NavigationProps {
  const output = {
    ...props,
    items: normalizedItems.value,
    mode: mode.value,
  } as NavigationProps;
  if (!isCollapsedControlled.value) delete output.isCollapsed;
  if (!selectedKeysControlled.value) delete output.selectedKeys;
  if (!hasRawProp('openKeys')) delete output.openKeys;
  return output;
}

const adapter: NavigationAdapter<NavigationProps, NavigationState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => foundationProps()[key],
  getProps: foundationProps,
  getState: (key) => state.value[key],
  getStates: () => state.value,
  setState: () => undefined,
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  notifySelect: (data) => {
    const selected = [data.itemKey];
    emit('update:selectedKeys', selected);
    const payload: NavigationSelectData = {
      ...data,
      domEvent: data.domEvent as MouseEvent | KeyboardEvent,
      itemKey: data.itemKey,
      selectedItems: (data.selectedItems ?? []) as NavigationSelectData['selectedItems'],
      selectedKeys: selected,
      text: data.text as NavigationContent | undefined,
    };
    emit('select', payload);
  },
  notifyOpenChange: (data) => emit('openChange', data as unknown as NavigationOpenChangeData),
  setIsCollapsed: (collapsed) => {
    internal.isCollapsed = collapsed;
  },
  notifyCollapseChange: (collapsed) => {
    emit('update:isCollapsed', collapsed);
    emit('collapseChange', collapsed);
  },
  updateItems: () => undefined,
  setItemKeysMap: () => undefined,
  addSelectedKeys: (...keys) =>
    replaceArray(internalSelectedKeys, Array.from(new Set([...internalSelectedKeys, ...keys]))),
  removeSelectedKeys: (...keys) =>
    replaceArray(
      internalSelectedKeys,
      internalSelectedKeys.filter((key) => !keys.includes(key)),
    ),
  updateSelectedKeys: (keys) => replaceArray(internalSelectedKeys, keys),
  updateOpenKeys: (keys) => replaceArray(internalOpenKeys, keys),
  addOpenKeys: (...keys) =>
    replaceArray(internalOpenKeys, Array.from(new Set([...internalOpenKeys, ...keys]))),
  removeOpenKeys: (...keys) =>
    replaceArray(
      internalOpenKeys,
      internalOpenKeys.filter((key) => !keys.includes(key)),
    ),
  setItemsChanged: (changed) => {
    itemsChanged = changed;
  },
};
const foundation = markRaw(new NavigationFoundation<NavigationProps, NavigationState>(adapter));
onBeforeUnmount(() => foundation.destroy());

function setSelectedKeys(keys: ItemKey[]): void {
  if (!selectedKeysControlled.value) replaceArray(internalSelectedKeys, keys);
}

function notifySelect(data: NavigationSelectData): void {
  foundation.handleSelect(data as unknown as Parameters<typeof foundation.handleSelect>[0]);
}

function notifyClick(data: NavigationClickData): void {
  emit('click', data);
}

function notifyOpenChange(data: NavigationOpenChangeData): void {
  emit('update:openKeys', [...data.openKeys]);
  emit('openChange', data);
}

function addOpenKey(key: ItemKey): void {
  if (openKeysControlled.value) return;
  replaceArray(internalOpenKeys, Array.from(new Set([...internalOpenKeys, key])));
}

function removeOpenKey(key: ItemKey): void {
  if (openKeysControlled.value) return;
  replaceArray(
    internalOpenKeys,
    internalOpenKeys.filter((entry) => entry !== key),
  );
}

function toggleCollapsed(): void {
  foundation.handleCollapseChange();
}

function wrapItem(data: NavigationWrapperData): VNodeChild {
  return slots.itemWrapper?.(data) ?? props.renderWrapper?.(data) ?? data.itemElement;
}

const context: NavigationContextValue = {
  addOpenKey,
  direction,
  expandIcon: computed(() => props.expandIcon),
  getPopupContainer,
  isCollapsed: currentCollapsed,
  isInSubNav: false,
  limitIndent,
  locale,
  mode,
  notifyClick,
  notifyOpenChange,
  notifySelect,
  openKeys: currentOpenKeys,
  openKeysControlled,
  prefixCls,
  removeOpenKey,
  selectedKeys: selectedKeysWithParents,
  selectedKeysControlled,
  setSelectedKeys,
  subDropdownProps: computed(() => props.subDropdownProps),
  subNavCloseDelay,
  subNavMotion,
  subNavOpenDelay,
  toggleCollapsed,
  toggleIconPosition,
  tooltipHideDelay,
  tooltipShowDelay,
  wrapItem,
};
provide(navigationContextKey, context);

const rootClasses = computed(() => [
  prefixCls.value,
  currentCollapsed.value ? `${prefixCls.value}-collapsed` : undefined,
  `${prefixCls.value}-${mode.value}`,
  props.class,
  props.className,
]);
const headerOuterClasses = computed(() => [
  `${prefixCls.value}-header-list-outer`,
  currentCollapsed.value ? `${prefixCls.value}-header-list-outer-collapsed` : undefined,
]);
const dataAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(instance?.attrs ?? {}).filter(([name]) => name.startsWith('data-')),
  ),
);

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value) || isVNode(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

const headerConfig = computed<NavHeaderProps | undefined>(() =>
  isPlainRecord(props.header) ? (props.header as NavHeaderProps) : undefined,
);
const footerConfig = computed<NavFooterProps | undefined>(() =>
  isPlainRecord(props.footer) ? (props.footer as NavFooterProps) : undefined,
);
const headerContent = computed<NavigationContent | undefined>(() =>
  headerConfig.value ? undefined : (props.header as NavigationContent | undefined),
);
const footerContent = computed<NavigationContent | undefined>(() =>
  footerConfig.value ? undefined : (props.footer as NavigationContent | undefined),
);

void itemsChanged;
</script>

<template>
  <div v-bind="dataAttrs" :class="rootClasses" :style="props.style">
    <div :class="`${prefixCls}-inner`">
      <div :class="headerOuterClasses">
        <NavHeader v-if="headerConfig" v-bind="headerConfig" />
        <NavHeader v-else-if="headerContent"
          ><NavigationNodeRenderer :content="headerContent"
        /></NavHeader>
        <NavHeader v-if="$slots.header"><slot name="header" /></NavHeader>
        <NavigationNodeRenderer :content="headerNodes" />
        <div :style="props.bodyStyle" :class="`${prefixCls}-list-wrapper`">
          <ul role="menu" :aria-orientation="mode" :class="`${prefixCls}-list`">
            <NavigationItemTree
              v-for="(item, index) in normalizedItems"
              :key="item.itemKey ?? `0-${index}`"
              :item="item"
              :level="0"
            />
            <NavigationNodeRenderer :content="bodyNodes" />
          </ul>
        </div>
      </div>
      <NavFooter v-if="footerConfig" v-bind="footerConfig" />
      <NavFooter v-else-if="footerContent"
        ><NavigationNodeRenderer :content="footerContent"
      /></NavFooter>
      <NavFooter v-if="$slots.footer"><slot name="footer" /></NavFooter>
      <NavigationNodeRenderer :content="footerNodes" />
    </div>
  </div>
</template>
