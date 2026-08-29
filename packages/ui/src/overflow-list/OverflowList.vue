<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useAttrs,
  useSlots,
  watch,
  type PropType,
  type StyleValue,
  type VNodeChild,
} from 'vue';
import {
  OverflowListFoundation,
  type OverflowListAdapter,
} from '@workspace/foundation-integration';

import { semiGlobal } from '../config-provider';
import OverflowListNodeRenderer from './OverflowListNodeRenderer';
import type {
  OverflowItem,
  OverflowListCollapseFrom,
  OverflowListEmits,
  OverflowListKey,
  OverflowListProps,
  OverflowListRenderDirection,
  OverflowListRenderMode,
  OverflowListSlots,
} from './types';

defineOptions({ name: 'OverflowList', inheritAttrs: false });
const props = defineProps({
  items: { type: Array as PropType<readonly OverflowItem[]>, default: undefined },
  collapseFrom: { type: String as PropType<OverflowListCollapseFrom>, default: undefined },
  minVisibleItems: { type: Number, default: undefined },
  renderMode: { type: String as PropType<OverflowListRenderMode>, default: undefined },
  threshold: { type: Number, default: undefined },
  class: { type: null as unknown as PropType<OverflowListProps['class']>, default: undefined },
  className: { type: String, default: undefined },
  style: { type: null as unknown as PropType<OverflowListProps['style']>, default: undefined },
  wrapperClassName: { type: String, default: undefined },
  wrapperStyle: {
    type: null as unknown as PropType<OverflowListProps['wrapperStyle']>,
    default: undefined,
  },
  itemKey: {
    type: [String, Number, Function] as PropType<OverflowListProps['itemKey']>,
    default: undefined,
  },
  overflowRenderDirection: {
    type: String as PropType<OverflowListRenderDirection>,
    default: undefined,
  },
});
const emit = defineEmits<OverflowListEmits>();
defineSlots<OverflowListSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();

function hasRawProp(name: keyof OverflowListProps): boolean {
  const raw = instance?.vnode.props;
  const kebab = String(name).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

function resolveProp<Key extends keyof OverflowListProps>(
  key: Key,
  fallback: NonNullable<OverflowListProps[Key]>,
): NonNullable<OverflowListProps[Key]> {
  if (hasRawProp(key) && props[key] !== undefined) {
    return props[key] as NonNullable<OverflowListProps[Key]>;
  }
  const configured = semiGlobal.config.overrideDefaultProps?.OverflowList?.[key];
  return (configured === undefined ? fallback : configured) as NonNullable<OverflowListProps[Key]>;
}

const runtimeItems = computed(() => resolveProp('items', [] as OverflowItem[]));
const runtimeCollapseFrom = computed(() => resolveProp('collapseFrom', 'end'));
const runtimeMinVisibleItems = computed(() => resolveProp('minVisibleItems', 0));
const runtimeRenderMode = computed(() => resolveProp('renderMode', 'collapse'));
const runtimeThreshold = computed(() => resolveProp('threshold', 0.75));
const runtimeOverflowRenderDirection = computed(() =>
  resolveProp('overflowRenderDirection', 'both'),
);

interface OverflowListState {
  visibleState: Map<string, boolean>;
  visible: OverflowItem[];
  overflow: OverflowItem[];
  containerWidth: number;
  overflowWidth: number;
  overflowStatus: 'calculating' | 'overflowed' | 'normal';
  pivot: number;
  scrollOverflow: [OverflowItem[], OverflowItem[]];
  isScrollOverflowCalculating: boolean;
}

const state = shallowReactive<OverflowListState>({
  visibleState: new Map(),
  visible: [...runtimeItems.value],
  overflow: [],
  containerWidth: 0,
  overflowWidth: 0,
  overflowStatus: 'calculating',
  pivot: -1,
  scrollOverflow: [[], []],
  isScrollOverflowCalculating: true,
});
const cache = new Map<unknown, unknown>();
const itemSizeMap = new Map<OverflowListKey, number>();

type FoundationProps = Required<
  Pick<
    OverflowListProps,
    | 'items'
    | 'collapseFrom'
    | 'minVisibleItems'
    | 'renderMode'
    | 'threshold'
    | 'overflowRenderDirection'
  >
> & {
  onOverflow: (items: OverflowItem[]) => void;
};

function foundationProps(): FoundationProps {
  return {
    items: runtimeItems.value,
    collapseFrom: runtimeCollapseFrom.value,
    minVisibleItems: runtimeMinVisibleItems.value,
    renderMode: runtimeRenderMode.value,
    threshold: runtimeThreshold.value,
    overflowRenderDirection: runtimeOverflowRenderDirection.value,
    onOverflow: (items) => emit('overflow', [...items]),
  };
}

const adapter: OverflowListAdapter<FoundationProps, OverflowListState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => foundationProps()[key],
  getProps: foundationProps,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => {
    cache.set(key, value);
    return value;
  },
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  updateStates: (nextState) => Object.assign(state, nextState),
  updateVisibleState: (visibleState) => {
    state.visibleState = visibleState;
    emit('visibleStateChange', new Map(visibleState));
  },
  notifyIntersect: (result) => emit('intersect', result),
  getItemSizeMap: () => itemSizeMap,
};

const foundation = markRaw(new OverflowListFoundation<FoundationProps, OverflowListState>(adapter));
const root = shallowRef<HTMLElement>();
const overflowElement = shallowRef<HTMLElement>();
const scroller = shallowRef<HTMLElement>();
const itemElements = new Map<OverflowListKey, HTMLElement>();
const scrollElements = new Map<string, Element>();
const itemRefCallbacks = new Map<OverflowListKey, (value: unknown) => void>();
const scrollRefCallbacks = new Map<string, (value: unknown) => void>();
let rootObserver: ResizeObserver | undefined;
let itemObserver: ResizeObserver | undefined;
let intersectionObserver: IntersectionObserver | undefined;
let mounted = false;
let calculationQueued = false;

function resolveItemKey(item: OverflowItem, index: number): OverflowListKey {
  if (typeof props.itemKey === 'function') return props.itemKey(item);
  const keyName = props.itemKey ?? 'key';
  const value = item[String(keyName)];
  return typeof value === 'string' || typeof value === 'number' ? value : index;
}

function elementWidth(element: Element | undefined): number {
  return element instanceof HTMLElement ? element.clientWidth : 0;
}

function calculateCollapse(): void {
  calculationQueued = false;
  if (!mounted || runtimeRenderMode.value !== 'collapse') return;
  state.containerWidth = elementWidth(root.value);
  state.overflowWidth = elementWidth(overflowElement.value);
  for (const [key, element] of itemElements) itemSizeMap.set(key, elementWidth(element));
  if (itemSizeMap.size < state.visible.length || state.containerWidth <= 0) return;
  foundation.handleCollapseOverflow();
}

function scheduleCalculation(): void {
  if (calculationQueued) return;
  calculationQueued = true;
  void nextTick(calculateCollapse);
}

function setItemElement(key: OverflowListKey, value: unknown): void {
  const previous = itemElements.get(key);
  if (value === previous) return;
  if (previous) itemObserver?.unobserve(previous);
  if (value instanceof HTMLElement) {
    itemElements.set(key, value);
    itemObserver?.observe(value);
  } else {
    itemElements.delete(key);
  }
  scheduleCalculation();
}

function setScrollElement(key: string, value: unknown): void {
  const previous = scrollElements.get(key);
  if (value === previous) return;
  if (previous) intersectionObserver?.unobserve(previous);
  if (value instanceof Element) {
    scrollElements.set(key, value);
    intersectionObserver?.observe(value);
  } else {
    scrollElements.delete(key);
  }
}

function getItemRef(key: OverflowListKey): (value: unknown) => void {
  let callback = itemRefCallbacks.get(key);
  if (!callback) {
    callback = (value) => setItemElement(key, value);
    itemRefCallbacks.set(key, callback);
  }
  return callback;
}

function getScrollRef(key: string): (value: unknown) => void {
  let callback = scrollRefCallbacks.get(key);
  if (!callback) {
    callback = (value) => setScrollElement(key, value);
    scrollRefCallbacks.set(key, callback);
  }
  return callback;
}

function bindIntersectionObserver(): void {
  intersectionObserver?.disconnect();
  intersectionObserver = undefined;
  if (
    !mounted ||
    runtimeRenderMode.value !== 'scroll' ||
    !scroller.value ||
    typeof IntersectionObserver === 'undefined'
  ) {
    return;
  }
  intersectionObserver = new IntersectionObserver(
    (entries) => foundation.handleIntersect(entries),
    { root: scroller.value, threshold: runtimeThreshold.value, rootMargin: '0px' },
  );
  scrollElements.forEach((element) => intersectionObserver?.observe(element));
}

function resetForItems(): void {
  const nextItems = [...runtimeItems.value];
  itemSizeMap.clear();
  itemElements.clear();
  state.visibleState = new Map();
  state.overflowStatus = 'calculating';
  state.isScrollOverflowCalculating = true;
  if (runtimeRenderMode.value === 'scroll') {
    state.visible = nextItems;
    state.overflow = [];
  } else {
    state.visible = nextItems;
    state.overflow = [];
  }
  void nextTick(() => {
    bindIntersectionObserver();
    scheduleCalculation();
  });
}

watch(() => runtimeItems.value.map((item, index) => resolveItemKey(item, index)), resetForItems, {
  deep: true,
});
watch([runtimeRenderMode, runtimeThreshold], resetForItems);
watch(
  () => props.style,
  () => {
    state.overflowStatus = 'calculating';
    scheduleCalculation();
  },
  { deep: true },
);

const overflowItems = computed(
  () => foundation.getOverflowItem() as OverflowItem[] | [OverflowItem[], OverflowItem[]],
);
const collapseOverflowItems = computed(() => overflowItems.value as OverflowItem[]);
const scrollOverflowItems = computed(() => overflowItems.value as [OverflowItem[], OverflowItem[]]);
const collapseOverflowContent = computed<VNodeChild>(() =>
  slots.overflow?.({ items: collapseOverflowItems.value, position: runtimeCollapseFrom.value }),
);
const hasCollapseOverflowContent = computed(() => {
  const value = collapseOverflowContent.value;
  if (Array.isArray(value))
    return value.some((node) => node !== null && node !== undefined && node !== false);
  return value !== null && value !== undefined && value !== false;
});
const rootClasses = computed(() => [
  'semi-overflow-list',
  props.class,
  props.className,
  attrs.class,
]);
const rootStyle = computed(
  () =>
    [
      props.style,
      attrs.style,
      runtimeRenderMode.value === 'collapse'
        ? {
            maxWidth: '100%',
            visibility:
              state.overflowStatus === 'calculating' && state.pivot < 0 ? 'hidden' : 'visible',
          }
        : undefined,
    ] as StyleValue,
);

onMounted(() => {
  mounted = true;
  foundation.init();
  if (typeof ResizeObserver !== 'undefined') {
    rootObserver = new ResizeObserver(() => {
      state.overflowStatus = 'calculating';
      scheduleCalculation();
    });
    itemObserver = new ResizeObserver(() => {
      state.overflowStatus = 'calculating';
      scheduleCalculation();
    });
    if (root.value) rootObserver.observe(root.value);
    itemElements.forEach((element) => itemObserver?.observe(element));
    if (overflowElement.value) itemObserver.observe(overflowElement.value);
  }
  bindIntersectionObserver();
  scheduleCalculation();
});

watch(overflowElement, (value, previous) => {
  if (previous) itemObserver?.unobserve(previous);
  if (value) itemObserver?.observe(value);
  scheduleCalculation();
});
watch(scroller, () => void nextTick(bindIntersectionObserver));

onBeforeUnmount(() => {
  mounted = false;
  rootObserver?.disconnect();
  itemObserver?.disconnect();
  intersectionObserver?.disconnect();
  foundation.destroy();
});
</script>

<template>
  <div ref="root" :class="rootClasses" :style="rootStyle">
    <template v-if="runtimeRenderMode === 'scroll'">
      <template
        v-if="
          runtimeOverflowRenderDirection === 'both' || runtimeOverflowRenderDirection === 'start'
        "
      >
        <slot name="overflow" :items="scrollOverflowItems[0]" position="start" />
        <slot
          v-if="runtimeOverflowRenderDirection === 'start'"
          name="overflow"
          :items="scrollOverflowItems[1]"
          position="end"
        />
      </template>
      <div
        ref="scroller"
        :class="[wrapperClassName, 'semi-overflow-list-scroll-wrapper']"
        :style="wrapperStyle"
      >
        <OverflowListNodeRenderer
          v-for="(item, index) in state.visible"
          :key="resolveItemKey(item, index)"
          :content="slots.visibleItem?.({ item, index })"
          :scroll-key="String(resolveItemKey(item, index))"
          :set-element="getScrollRef(String(resolveItemKey(item, index)))"
        />
      </div>
      <template
        v-if="runtimeOverflowRenderDirection === 'both' || runtimeOverflowRenderDirection === 'end'"
      >
        <slot
          v-if="runtimeOverflowRenderDirection === 'end'"
          name="overflow"
          :items="scrollOverflowItems[0]"
          position="start"
        />
        <slot name="overflow" :items="scrollOverflowItems[1]" position="end" />
      </template>
    </template>
    <template v-else>
      <div
        v-if="runtimeCollapseFrom === 'start' && hasCollapseOverflowContent"
        ref="overflowElement"
        class="semi-overflow-list-overflow"
      >
        <OverflowListNodeRenderer :content="collapseOverflowContent" />
      </div>
      <div
        v-for="(item, index) in state.visible"
        :key="resolveItemKey(item, index)"
        :ref="getItemRef(resolveItemKey(item, index))"
        class="semi-overflow-list-item"
      >
        <slot name="visibleItem" :item="item" :index="index" />
      </div>
      <div
        v-if="runtimeCollapseFrom === 'end' && hasCollapseOverflowContent"
        ref="overflowElement"
        class="semi-overflow-list-overflow"
      >
        <OverflowListNodeRenderer :content="collapseOverflowContent" />
      </div>
    </template>
  </div>
</template>
