<script setup lang="ts">
import { SpinFoundation, type SpinAdapter } from '@workspace/foundation-integration';
import {
  Comment,
  Text,
  computed,
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useAttrs,
  useId,
  useSlots,
  watch,
  type PropType,
  type VNode,
  type VNodeChild,
} from 'vue';

import { semiGlobal } from '../config-provider';

import SpinNodeRenderer from './SpinNodeRenderer';
import type { SpinProps, SpinSize, SpinSlots } from './types';

defineOptions({ name: 'Spin', inheritAttrs: false });
const props = defineProps({
  childStyle: {
    type: null as unknown as PropType<SpinProps['childStyle']>,
    default: undefined,
  },
  class: { type: null as unknown as PropType<SpinProps['class']>, default: undefined },
  className: { type: null as unknown as PropType<SpinProps['className']>, default: undefined },
  delay: { type: Number, default: undefined },
  indicator: {
    type: null as unknown as PropType<SpinProps['indicator']>,
    default: undefined,
  },
  size: { type: String as PropType<SpinSize>, default: undefined },
  spinning: { type: Boolean, default: undefined },
  style: { type: null as unknown as PropType<SpinProps['style']>, default: undefined },
  tip: { type: null as unknown as PropType<SpinProps['tip']>, default: undefined },
  wrapperClassName: { type: String, default: undefined },
});
defineSlots<SpinSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();

function hasRawProp(name: keyof SpinProps): boolean {
  const raw = instance?.vnode.props;
  const kebab = String(name).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

function resolveProp<Key extends keyof SpinProps>(
  key: Key,
  fallback: SpinProps[Key],
): SpinProps[Key] {
  const explicitValue = props[key];
  if (hasRawProp(key)) return explicitValue;
  const configured = semiGlobal.config.overrideDefaultProps?.Spin?.[key];
  return (configured === undefined ? fallback : configured) as SpinProps[Key];
}

function hasReactTruthyContent(content: VNodeChild): boolean {
  if (Array.isArray(content)) return true;
  if (
    content === null ||
    content === undefined ||
    content === false ||
    content === '' ||
    content === 0
  ) {
    return false;
  }
  if (typeof content !== 'object') return Boolean(content);
  const vnode = content as VNode;
  if (vnode.type === Comment) return false;
  if (vnode.type === Text) return hasReactTruthyContent(vnode.children as VNodeChild);
  return true;
}

function hasSlotContent(content: VNodeChild): boolean {
  if (Array.isArray(content)) return content.some((node) => hasSlotContent(node));
  return hasReactTruthyContent(content);
}

const runtimeSize = computed(() => resolveProp('size', 'middle') as SpinSize);
const runtimeSpinning = computed(() => Boolean(resolveProp('spinning', true)));
const runtimeDelay = computed(() => Number(resolveProp('delay', 0) ?? 0));
const runtimeClassName = computed(() => resolveProp('className', undefined));
const runtimeWrapperClassName = computed(() => resolveProp('wrapperClassName', undefined));
const runtimeStyle = computed(() => resolveProp('style', undefined));
const runtimeChildStyle = computed(() => resolveProp('childStyle', undefined));
const indicatorContent = computed<VNodeChild>(() =>
  slots.indicator ? slots.indicator() : resolveProp('indicator', undefined),
);
const tipContent = computed<VNodeChild>(() =>
  slots.tip ? slots.tip() : resolveProp('tip', undefined),
);
const childrenContent = computed<VNodeChild>(() => slots.default?.());
const hasIndicator = computed(() =>
  slots.indicator
    ? hasSlotContent(indicatorContent.value)
    : hasReactTruthyContent(indicatorContent.value),
);
const hasTip = computed(() =>
  slots.tip ? hasSlotContent(tipContent.value) : hasReactTruthyContent(tipContent.value),
);
const hasChildren = computed(() => hasSlotContent(childrenContent.value));
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);

interface SpinState {
  delay: number;
  loading: boolean;
}

const state = shallowReactive<SpinState>({
  delay: runtimeDelay.value,
  loading: runtimeDelay.value && !runtimeSpinning.value ? false : runtimeSpinning.value,
});
const cache = new Map<string, unknown>();
const adapter: SpinAdapter<SpinProps, SpinState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) =>
    ({ spinning: runtimeSpinning.value, delay: runtimeDelay.value })[key as 'spinning' | 'delay'],
  getProps: () => ({ spinning: runtimeSpinning.value, delay: runtimeDelay.value }),
  getState: (key) => state[key as keyof SpinState],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(String(key), value),
  stopPropagation: (event) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  setLoading: (value) => {
    state.loading = value;
  },
};
const foundation = markRaw(new SpinFoundation<SpinProps, SpinState>(adapter));

watch(
  [runtimeSpinning, runtimeDelay],
  ([spinning, delay], previous) => {
    if (!previous) {
      state.delay = delay;
      state.loading = delay && !spinning ? false : spinning;
    } else if (!delay) {
      state.delay = 0;
      state.loading = spinning;
    } else if (!spinning) {
      state.delay = 0;
      state.loading = false;
    } else {
      state.delay = delay;
    }
    foundation.updateLoadingIfNeedDelay();
  },
  { immediate: true },
);

const fallbackGradientId = 'linearGradient-semi-spin';
const vueInstanceId = useId();
const gradientId = shallowRef(fallbackGradientId);

onMounted(() => {
  foundation.init();
  gradientId.value = `linearGradient-semi-spin-gradient-${vueInstanceId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
});
onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <div
    v-bind="dataAttrs"
    :class="[
      'semi-spin',
      `semi-spin-${runtimeSize}`,
      hasChildren && 'semi-spin-block',
      !state.loading && 'semi-spin-hidden',
      props.class,
      runtimeClassName,
      runtimeWrapperClassName,
      attrs.class,
    ]"
    :style="[runtimeStyle, attrs.style]"
  >
    <div v-if="state.loading" class="semi-spin-wrapper">
      <div v-if="hasIndicator" class="semi-spin-animate" x-semi-prop="indicator">
        <slot name="indicator">
          <SpinNodeRenderer :content="indicatorContent" />
        </slot>
      </div>
      <svg
        v-else
        width="48"
        height="48"
        viewBox="0 0 36 36"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        data-icon="spin"
      >
        <defs>
          <linearGradient :id="gradientId" x1="0%" y1="100%" x2="100%" y2="100%">
            <stop stop-color="currentColor" stop-opacity="0" offset="0%" />
            <stop stop-color="currentColor" stop-opacity="0.50" offset="39.9430698%" />
            <stop stop-color="currentColor" offset="100%" />
          </linearGradient>
        </defs>
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <rect fill-opacity="0.01" fill="none" x="0" y="0" width="36" height="36" />
          <path
            d="M34,18 C34,9.163444 26.836556,2 18,2 C11.6597233,2 6.18078805,5.68784135 3.59122325,11.0354951"
            :stroke="`url(#${gradientId})`"
            stroke-width="4"
            stroke-linecap="round"
          />
        </g>
      </svg>
      <div v-if="hasTip" x-semi-prop="tip">
        <slot name="tip">
          <SpinNodeRenderer :content="tipContent" />
        </slot>
      </div>
    </div>
    <div class="semi-spin-children" :style="runtimeChildStyle" x-semi-prop="children">
      <slot />
    </div>
  </div>
</template>
