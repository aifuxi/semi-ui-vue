<script setup lang="ts">
import {
  LottieFoundation,
  type LottieAdapter,
  type LottieFoundationProps,
  type LottieLoadParams,
} from '@workspace/foundation-integration';
import isEqual from 'lodash/isEqual.js';
import {
  computed,
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  onMounted,
  useAttrs,
  useTemplateRef,
  watch,
  type PropType,
} from 'vue';

import { semiGlobal } from '../config-provider';
import type { LottieParams, LottieProps } from './types';

defineOptions({ name: 'Lottie', inheritAttrs: false });
const props = defineProps({
  params: { type: Object as PropType<LottieParams>, default: undefined },
  width: { type: String, default: undefined },
  height: { type: String, default: undefined },
  getAnimationInstance: {
    type: Function as PropType<LottieProps['getAnimationInstance']>,
    default: undefined,
  },
  getLottie: { type: Function as PropType<LottieProps['getLottie']>, default: undefined },
  class: { type: null as unknown as PropType<LottieProps['class']>, default: undefined },
  className: {
    type: null as unknown as PropType<LottieProps['className']>,
    default: undefined,
  },
  style: { type: null as unknown as PropType<LottieProps['style']>, default: undefined },
});
const attrs = useAttrs();
const instance = getCurrentInstance();
const containerRef = useTemplateRef<HTMLDivElement>('container');

function hasRawProp(name: keyof LottieProps): boolean {
  const rawProps = instance?.vnode.props;
  const kebabName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, name) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabName)),
  );
}

function configuredValue<Key extends keyof LottieProps>(key: Key): LottieProps[Key] | undefined {
  if (hasRawProp(key)) return props[key] as LottieProps[Key];
  return semiGlobal.config.overrideDefaultProps?.Lottie?.[key] as LottieProps[Key] | undefined;
}

const runtimeParams = computed<LottieParams>(() => configuredValue('params') ?? {});
const runtimeGetAnimationInstance = computed(() => configuredValue('getAnimationInstance'));
const runtimeGetLottie = computed(() => configuredValue('getLottie'));
const externalContainer = computed(() => runtimeParams.value.container ?? null);
const rootClasses = computed(() => [
  'semi-lottie',
  configuredValue('class'),
  configuredValue('className'),
  attrs.class,
]);
const rootStyle = computed(() => [
  { width: configuredValue('width'), height: configuredValue('height') },
  configuredValue('style'),
  attrs.style,
]);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
  ),
);

type LottieFoundationState = Record<string, unknown>;
const foundationProps = computed<LottieFoundationProps>(() => ({
  params: runtimeParams.value,
  getAnimationInstance: runtimeGetAnimationInstance.value,
  getLottie: runtimeGetLottie.value,
}));
const state: LottieFoundationState = {};
const cache = new Map<unknown, unknown>();
let initialized = false;

function getContainer(): Element {
  const container = externalContainer.value ?? containerRef.value;
  if (!container) throw new Error('Lottie container is not available');
  return container;
}

const adapter: LottieAdapter<LottieFoundationProps, LottieFoundationState> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => foundationProps.value[key],
  getProps: () => foundationProps.value,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  getContainer,
  getLoadParams: () =>
    ({
      container: getContainer(),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      ...runtimeParams.value,
    }) as LottieLoadParams,
};
const foundation = markRaw(new LottieFoundation(adapter));

watch(
  runtimeParams,
  (value, previous) => {
    if (initialized && !isEqual(previous, value)) foundation.handleParamsUpdate();
  },
  { flush: 'post' },
);

onMounted(() => {
  foundation.init();
  initialized = true;
  // The pinned React Adapter calls this once in Foundation.init and once again in componentDidMount.
  runtimeGetAnimationInstance.value?.(foundation.animation);
});

onBeforeUnmount(() => {
  if (initialized) foundation.destroy();
  initialized = false;
  cache.clear();
});
</script>

<template>
  <div
    v-if="!externalContainer"
    ref="container"
    v-bind="rootAttrs"
    :class="rootClasses"
    :style="rootStyle"
  />
</template>
