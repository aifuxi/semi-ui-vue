<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text as VueText,
  computed,
  getCurrentInstance,
  inject,
  isVNode,
  markRaw,
  onBeforeUnmount,
  onBeforeUpdate,
  provide,
  shallowReactive,
  useAttrs,
  useSlots,
  watch,
  type VNode,
  type VNodeChild,
} from 'vue';
import { TabsFoundation, type TabsAdapter } from '@workspace/foundation-integration';

import { configContextKey, type ConfigContextValue } from '../config-provider';
import TabBar from './TabBar.vue';
import TabPane from './TabPane.vue';
import TabsNodeRenderer from './TabsNodeRenderer';
import { tabsContextKey } from './tabs-context';
import type { PlainTab, TabsEmits, TabsProps, TabsSlots } from './types';

defineOptions({ name: 'Tabs', inheritAttrs: false });
const props = withDefaults(defineProps<TabsProps>(), {
  collapsible: false,
  keepDOM: true,
  lazyRender: false,
  showRestInDropdown: true,
  size: 'large',
  tabPaneMotion: true,
  tabPosition: 'top',
  type: 'line',
  preventScroll: false,
  arrowPosition: 'both',
});
const emit = defineEmits<TabsEmits>();
defineSlots<TabsSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
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

function flattenValidVNodes(nodes: VNodeChild[]): VNode[] {
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
    if (node.type === VueText && String(node.children ?? '').trim() === '') return;
    output.push(node);
  };
  nodes.forEach(visit);
  return output;
}

function collectSourceNodes(): VNode[] {
  return flattenValidVNodes((slots.default?.() ?? []) as VNodeChild[]);
}

function isTabPaneVNode(node: VNode): boolean {
  if (node.type === TabPane) return true;
  if (typeof node.type !== 'object' && typeof node.type !== 'function') return false;
  const type = node.type as { name?: string; __name?: string };
  return type.name === 'TabPane' || type.__name === 'TabPane';
}

function vnodeSlot(node: VNode, name: 'tab' | 'icon'): VNodeChild {
  if (!node.children || typeof node.children !== 'object' || Array.isArray(node.children)) {
    return undefined;
  }
  const slot = (node.children as Record<string, unknown>)[name];
  return typeof slot === 'function' ? (slot as () => VNodeChild)() : undefined;
}

const renderVersion = shallowReactive({ value: 0 });
const sourceNodes = computed(() => {
  void renderVersion.value;
  return collectSourceNodes();
});
onBeforeUpdate(() => {
  renderVersion.value += 1;
});

const collectedPanes = computed<PlainTab[]>(() => {
  if (Array.isArray(props.tabList) && props.tabList.length) return props.tabList;
  return sourceNodes.value.filter(isTabPaneVNode).map((node) => ({
    closable: node.props?.closable === '' || node.props?.closable === true,
    disabled: node.props?.disabled === '' || node.props?.disabled === true,
    icon: vnodeSlot(node, 'icon') ?? node.props?.icon,
    itemKey: String(node.props?.itemKey ?? node.props?.['item-key'] ?? ''),
    tab: vnodeSlot(node, 'tab') ?? node.props?.tab,
  }));
});
const modelControlled = computed(() => hasRawProp('modelValue'));
const activeKeyControlled = computed(() => hasRawProp('activeKey'));
const controlled = computed(() => modelControlled.value || activeKeyControlled.value);
const incomingActiveKey = computed(() =>
  modelControlled.value ? props.modelValue : props.activeKey,
);
const defaultFromPanes = (): string =>
  collectedPanes.value.find((pane) => !pane.disabled)?.itemKey ?? '';

interface TabsState {
  activeKey: string;
  panes: PlainTab[];
  prevActiveKey: string | null;
  forceDisableMotion: boolean;
}

const state = shallowReactive<TabsState>({
  activeKey: incomingActiveKey.value ?? props.defaultActiveKey ?? '',
  forceDisableMotion: false,
  panes: [],
  prevActiveKey: null,
});
const cache = new Map<unknown, unknown>();
type FoundationProps = TabsProps & { activeKey?: string };

function getFoundationProps(): FoundationProps {
  const output = {} as FoundationProps;
  Object.assign(output, props);
  if (controlled.value) output.activeKey = incomingActiveKey.value ?? '';
  else delete output.activeKey;
  return output;
}

const adapter: TabsAdapter<FoundationProps, TabsState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key],
  getProps: getFoundationProps,
  getState: (key) => (key === 'activeKey' ? activeKey.value : state[key]),
  getStates: () => ({ ...state, activeKey: activeKey.value, panes: collectedPanes.value }),
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  collectPane: () => {
    state.panes = collectedPanes.value;
  },
  collectActiveKey: () => {
    if (controlled.value) return;
    if (!state.panes.some((pane) => pane.itemKey === state.activeKey)) {
      state.activeKey = defaultFromPanes();
    }
  },
  notifyTabClick: (activeKey, event) => emit('tabClick', activeKey, event),
  notifyChange: (activeKey) => {
    emit('change', activeKey);
    emit('update:activeKey', activeKey);
    emit('update:modelValue', activeKey);
  },
  setNewActiveKey: (activeKey) => {
    state.prevActiveKey = state.activeKey;
    state.activeKey = activeKey;
  },
  getDefaultActiveKeyFromChildren: defaultFromPanes,
  notifyTabDelete: (tabKey) => emit('tabClose', tabKey),
};

const foundation = markRaw(new TabsFoundation<FoundationProps, TabsState>(adapter));
onBeforeUnmount(() => foundation.destroy());

watch(incomingActiveKey, (value) => {
  if (!controlled.value || value === undefined || value === state.activeKey) return;
  state.prevActiveKey = state.activeKey;
  state.activeKey = value;
});
const activeKey = computed(() => {
  if (controlled.value) return incomingActiveKey.value ?? '';
  return collectedPanes.value.some((pane) => pane.itemKey === state.activeKey)
    ? state.activeKey
    : defaultFromPanes();
});
const panes = computed(() => collectedPanes.value);
const lazyRender = computed(() => props.lazyRender);
const tabPaneMotion = computed(() => props.tabPaneMotion && props.keepDOM);
const tabPosition = computed(() => props.tabPosition);
const prevActiveKey = computed(() => state.prevActiveKey);
const forceDisableMotion = computed(() => state.forceDisableMotion);
provide(tabsContextKey, {
  activeKey,
  forceDisableMotion,
  lazyRender,
  panes,
  prevActiveKey,
  tabPaneMotion,
  tabPosition,
});

const renderedNodes = computed(() => {
  if (props.tabList?.length) return sourceNodes.value;
  if (props.keepDOM) return sourceNodes.value;
  return sourceNodes.value.filter(
    (node) =>
      !isTabPaneVNode(node) ||
      String(node.props?.itemKey ?? node.props?.['item-key'] ?? '') === activeKey.value,
  );
});
const rootClasses = computed(() => [
  'semi-tabs',
  `semi-tabs-${props.tabPosition}`,
  props.class,
  props.className,
  attrs.class,
]);
const dataAndAriaAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name.startsWith('data-') || name.startsWith('aria-')),
  ),
);
const moreLabel = computed(() => {
  const tabsLocale = config.value.locale.Tabs as { more?: string } | undefined;
  return tabsLocale?.more ?? (config.value.locale.code === 'en-US' ? 'More' : '更多');
});

function handleTabClick(itemKey: string, event: MouseEvent | KeyboardEvent): void {
  foundation.handleTabClick(itemKey, event);
}

function handleClose(itemKey: string, event: MouseEvent): void {
  event.stopPropagation();
  foundation.handleTabDelete(itemKey);
}

function handleKeyDown(event: KeyboardEvent, itemKey: string, closable: boolean): void {
  foundation.handleKeyDown(event, itemKey, closable);
}
</script>

<template>
  <div v-bind="dataAndAriaAttrs" :class="rootClasses" :style="[style, attrs.style]">
    <slot
      v-if="$slots.tabBar"
      name="tabBar"
      :active-key="activeKey"
      :list="panes"
      :on-tab-click="handleTabClick"
    />
    <TabBar
      v-else
      :active-key="activeKey"
      :arrow-position="arrowPosition"
      :class-name="tabBarClassName"
      :collapsible="collapsible"
      :data-more-label="moreLabel"
      :dropdown-props="dropdownProps"
      :list="panes"
      :more="more"
      :show-rest-in-dropdown="showRestInDropdown"
      :size="size"
      :style="tabBarStyle"
      :tab-bar-extra-content="tabBarExtraContent"
      :tab-position="tabPosition"
      :type="type"
      :visible-tabs-style="visibleTabsStyle"
      @close="handleClose"
      @key-down="handleKeyDown"
      @select="handleTabClick"
      @visible-change="emit('visibleTabsChange', $event)"
    >
      <template v-if="$slots.tabBarExtraContent" #tabBarExtraContent>
        <slot name="tabBarExtraContent" />
      </template>
      <template v-if="$slots.more" #more="slotProps">
        <slot name="more" v-bind="slotProps" />
      </template>
      <template v-if="$slots.arrow" #arrow="slotProps">
        <slot name="arrow" v-bind="slotProps" />
      </template>
    </TabBar>
    <div :class="['semi-tabs-content', `semi-tabs-content-${tabPosition}`]" :style="contentStyle">
      <TabsNodeRenderer
        v-for="(node, index) in renderedNodes"
        :key="node.key ?? index"
        :content="node"
      />
    </div>
  </div>
</template>
