<script setup lang="ts">
import {
  HotKeysFoundation,
  type HotKeysAdapter,
  type HotKeysFoundationProps,
} from '@workspace/foundation-integration';
import {
  Comment,
  computed,
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  onMounted,
  useAttrs,
  useSlots,
  type PropType,
  type VNode,
} from 'vue';

import { semiGlobal } from '../config-provider';
import type { HotKeysEmits, HotKeysKey, HotKeysProps, HotKeysSlots } from './types';

defineOptions({ name: 'HotKeys', inheritAttrs: false });
const props = defineProps({
  hotKeys: { type: Array as PropType<HotKeysKey[]>, required: true },
  content: { type: Array as PropType<string[]>, default: undefined },
  preventDefault: { type: Boolean, default: undefined },
  mergeMetaCtrl: { type: Boolean, default: undefined },
  getListenerTarget: {
    type: Function as PropType<HotKeysProps['getListenerTarget']>,
    default: undefined,
  },
  class: { type: null as unknown as PropType<HotKeysProps['class']>, default: undefined },
  className: {
    type: null as unknown as PropType<HotKeysProps['className']>,
    default: undefined,
  },
  style: { type: null as unknown as PropType<HotKeysProps['style']>, default: undefined },
});
const emit = defineEmits<HotKeysEmits>();
defineSlots<HotKeysSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();

function hasRawProp(name: keyof HotKeysProps): boolean {
  const rawProps = instance?.vnode.props;
  const kebabName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, name) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabName)),
  );
}

function configuredValue<Key extends keyof HotKeysProps>(key: Key): HotKeysProps[Key] | undefined {
  if (hasRawProp(key)) return props[key] as HotKeysProps[Key];
  return semiGlobal.config.overrideDefaultProps?.HotKeys?.[key] as HotKeysProps[Key] | undefined;
}

const runtimeHotKeys = computed<HotKeysKey[]>(() => configuredValue('hotKeys') ?? []);
const runtimeContent = computed<string[] | undefined>(() => configuredValue('content'));
const runtimePreventDefault = computed(() => configuredValue('preventDefault') ?? false);
const runtimeMergeMetaCtrl = computed(() => configuredValue('mergeMetaCtrl') ?? false);
const runtimeGetListenerTarget = computed(() => configuredValue('getListenerTarget'));
const displayedKeys = computed(() => runtimeContent.value ?? runtimeHotKeys.value);
const rootClasses = computed(() => [
  'semi-hotKeys',
  configuredValue('class'),
  configuredValue('className'),
  attrs.class,
]);
const rootStyle = computed(() => [configuredValue('style'), attrs.style]);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
  ),
);
const customContent = computed(() => slots.default?.() ?? []);
const hasCustomRender = computed(() => Boolean(slots.default));
const hasCustomContent = computed(() =>
  customContent.value.some((node) => {
    if (typeof node !== 'object' || node === null) return node !== null && node !== undefined;
    return (node as VNode).type !== Comment;
  }),
);

type HotKeysFoundationState = Record<string, unknown>;
const state: HotKeysFoundationState = {};
const cache = new Map<unknown, unknown>();
let listenerTarget: HTMLElement | null = null;
let initialized = false;

const foundationProps = computed<HotKeysFoundationProps>(() => ({
  hotKeys: runtimeHotKeys.value,
  mergeMetaCtrl: runtimeMergeMetaCtrl.value,
  preventDefault: runtimePreventDefault.value,
}));
const adapter: HotKeysAdapter<HotKeysFoundationProps, HotKeysFoundationState> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => foundationProps.value[key],
  getProps: () => foundationProps.value,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (_nextState, callback) => callback?.(),
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  notifyHotKey: (event) => emit('hotKey', event),
  registerEvent: () => {
    listenerTarget = runtimeGetListenerTarget.value?.() ?? document.body;
    listenerTarget.addEventListener('keydown', foundation.handleKeyDown);
  },
  unregisterEvent: () => {
    listenerTarget?.removeEventListener('keydown', foundation.handleKeyDown);
    listenerTarget = null;
  },
};
const foundation = markRaw(new HotKeysFoundation(adapter));

function handleClick(event: MouseEvent): void {
  emit('click', event);
}

onMounted(() => {
  try {
    foundation.init();
    initialized = true;
  } catch (error) {
    foundation.destroy();
    throw error;
  }
});

onBeforeUnmount(() => {
  if (initialized || listenerTarget) foundation.destroy();
  initialized = false;
  cache.clear();
});
</script>

<template>
  <div
    v-if="!hasCustomRender || hasCustomContent"
    v-bind="rootAttrs"
    :class="rootClasses"
    :style="rootStyle"
    @click="handleClick"
  >
    <slot v-if="hasCustomRender" />
    <template v-else>
      <span v-for="(key, index) in displayedKeys" :key="index">
        <span v-if="index > 0" class="semi-hotKeys-split">+</span>
        <span class="semi-hotKeys-content">{{ key }}</span>
      </span>
    </template>
  </div>
</template>
