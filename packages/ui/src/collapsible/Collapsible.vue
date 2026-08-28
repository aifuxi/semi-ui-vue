<script setup lang="ts">
import { CollapsibleFoundation, type CollapsibleAdapter } from '@workspace/foundation-integration';
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
  useTemplateRef,
  watch,
  type CSSProperties,
  type PropType,
} from 'vue';

import { semiGlobal } from '../config-provider';
import type {
  CollapsibleEmits,
  CollapsibleProps,
  CollapsibleSlots,
  CollapsibleState,
} from './types';

defineOptions({ name: 'Collapsible', inheritAttrs: false });
const props = defineProps({
  class: { type: null as unknown as PropType<CollapsibleProps['class']>, default: undefined },
  className: {
    type: null as unknown as PropType<CollapsibleProps['className']>,
    default: undefined,
  },
  collapseHeight: { type: Number, default: undefined },
  collapseHeightAdaptive: { type: Boolean, default: undefined },
  duration: { type: Number, default: undefined },
  fade: { type: Boolean, default: undefined },
  id: { type: String, default: undefined },
  isOpen: { type: Boolean, default: undefined },
  keepDOM: { type: Boolean, default: undefined },
  lazyRender: { type: Boolean, default: undefined },
  motion: { type: Boolean, default: undefined },
  reCalcKey: { type: [Number, String] as PropType<number | string>, default: undefined },
  style: { type: null as unknown as PropType<CollapsibleProps['style']>, default: undefined },
});
const emit = defineEmits<CollapsibleEmits>();
defineSlots<CollapsibleSlots>();
const attrs = useAttrs();
const instance = getCurrentInstance();
const content = useTemplateRef<HTMLDivElement>('content');

function hasRawProp(name: keyof CollapsibleProps): boolean {
  const rawProps = instance?.vnode.props;
  const kebabName = String(name).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, name) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabName)),
  );
}

function resolveProp<Key extends keyof CollapsibleProps>(
  key: Key,
  fallback: NonNullable<CollapsibleProps[Key]>,
): NonNullable<CollapsibleProps[Key]> {
  if (hasRawProp(key) && props[key] !== undefined) {
    return props[key] as NonNullable<CollapsibleProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.Collapsible?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<CollapsibleProps[Key]>;
}

const runtimeProps = computed(() => ({
  collapseHeight: resolveProp('collapseHeight', 0),
  collapseHeightAdaptive: resolveProp('collapseHeightAdaptive', false),
  duration: resolveProp('duration', 250),
  fade: resolveProp('fade', false),
  isOpen: resolveProp('isOpen', false),
  keepDOM: resolveProp('keepDOM', false),
  lazyRender: resolveProp('lazyRender', false),
  motion: resolveProp('motion', true),
  reCalcKey: props.reCalcKey,
}));

const state = shallowReactive<CollapsibleState>({
  domHeight: 0,
  domInRenderTree: false,
  isTransitioning: false,
  visible: runtimeProps.value.isOpen,
});
const hasBeenRendered = shallowRef(
  runtimeProps.value.isOpen ||
    runtimeProps.value.collapseHeight !== 0 ||
    (runtimeProps.value.keepDOM && !runtimeProps.value.lazyRender),
);
const cache = new Map<unknown, unknown>();

const adapter: CollapsibleAdapter<typeof runtimeProps.value, CollapsibleState> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => runtimeProps.value[key],
  getProps: () => runtimeProps.value,
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
  setDOMInRenderTree: (domInRenderTree) => {
    if (state.domInRenderTree !== domInRenderTree) state.domInRenderTree = domInRenderTree;
  },
  setDOMHeight: (domHeight) => {
    if (state.domHeight !== domHeight) state.domHeight = domHeight;
  },
  setVisible: (visible) => {
    if (state.visible !== visible) state.visible = visible;
  },
  setIsTransitioning: (isTransitioning) => {
    if (state.isTransitioning !== isTransitioning) state.isTransitioning = isTransitioning;
  },
};
const foundation = markRaw(new CollapsibleFoundation(adapter));

const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const collapsedHeight = computed(() =>
  runtimeProps.value.collapseHeightAdaptive
    ? Math.min(state.domHeight, runtimeProps.value.collapseHeight)
    : runtimeProps.value.collapseHeight,
);
const wrapperClasses = computed(() => [
  'semi-collapsible-wrapper',
  runtimeProps.value.motion && state.isTransitioning ? 'semi-collapsible-transition' : undefined,
  attrs.class,
  props.class,
  props.className,
]);
const internalStyle = computed<CSSProperties>(() => ({
  overflow: 'hidden',
  height: `${runtimeProps.value.isOpen ? state.domHeight : collapsedHeight.value}px`,
  opacity:
    runtimeProps.value.isOpen || !runtimeProps.value.fade || runtimeProps.value.collapseHeight !== 0
      ? 1
      : 0,
  transitionDuration: `${runtimeProps.value.motion && state.isTransitioning ? runtimeProps.value.duration : 0}ms`,
}));
const wrapperStyle = computed(() => [internalStyle.value, props.style, attrs.style]);
const shouldRender = computed(
  () =>
    (runtimeProps.value.keepDOM &&
      (runtimeProps.value.lazyRender ? hasBeenRendered.value : true)) ||
    runtimeProps.value.collapseHeight !== 0 ||
    state.visible ||
    runtimeProps.value.isOpen,
);

let resizeObserver: ResizeObserver | undefined;

function measureContent(): void {
  const element = content.value;
  if (!element) return;
  const inRenderTree = element.offsetHeight > 0;
  foundation.updateDOMInRenderTree(inRenderTree);
  if (inRenderTree) foundation.updateDOMHeight(element.scrollHeight);
}

function getEntryInfo(entry: ResizeObserverEntry): { height: number; isShown: boolean } {
  const borderBox = entry.borderBoxSize?.[0];
  if (borderBox) {
    return {
      height: Math.ceil(borderBox.blockSize),
      isShown: !(borderBox.blockSize === 0 && borderBox.inlineSize === 0),
    };
  }
  return {
    height: (entry.target as HTMLElement).clientHeight,
    isShown: !(entry.contentRect.height === 0 && entry.contentRect.width === 0),
  };
}

function handleResize(entries: ResizeObserverEntry[]): void {
  const entry = entries[0];
  if (!entry) return;
  const entryInfo = getEntryInfo(entry);
  const wasInRenderTree = state.domInRenderTree;
  foundation.updateDOMHeight(entryInfo.height);
  foundation.updateDOMInRenderTree(entryInfo.isShown);
  if (entryInfo.isShown && !wasInRenderTree) void nextTick(measureContent);
}

function handleTransitionEnd(): void {
  if (!runtimeProps.value.isOpen) foundation.updateVisible(false);
  foundation.updateIsTransitioning(false);
  emit('motionEnd');
}

watch(
  () => runtimeProps.value.isOpen,
  (isOpen, previous) => {
    if (isOpen === previous) return;
    if (isOpen) hasBeenRendered.value = true;
    if (isOpen || !runtimeProps.value.motion) foundation.updateVisible(isOpen);
    if (runtimeProps.value.motion) foundation.updateIsTransitioning(true);
    if (isOpen) void nextTick(measureContent);
  },
);
watch(
  () => runtimeProps.value.reCalcKey,
  (value, previous) => {
    if (value !== previous) measureContent();
  },
  { flush: 'post' },
);
watch(
  () =>
    [
      runtimeProps.value.keepDOM,
      runtimeProps.value.lazyRender,
      runtimeProps.value.collapseHeight,
    ] as const,
  ([keepDOM, lazyRender, collapseHeight]) => {
    if ((keepDOM && !lazyRender) || collapseHeight !== 0) hasBeenRendered.value = true;
  },
);

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined' && content.value) {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(content.value);
  }
  measureContent();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = undefined;
  foundation.destroy();
  cache.clear();
});
</script>

<template>
  <div
    v-bind="dataAttrs"
    :class="wrapperClasses"
    :style="wrapperStyle"
    @transitionend="handleTransitionEnd"
  >
    <div :id="props.id" ref="content" x-semi-prop="children" style="overflow: hidden">
      <slot v-if="shouldRender" />
    </div>
  </div>
</template>
