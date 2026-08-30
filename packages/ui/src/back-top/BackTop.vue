<script setup lang="ts">
import { BackTopFoundation, type BackTopAdapter } from '@workspace/foundation-integration';
import { IconChevronUp } from '@aifuxi/semi-icons-vue';
import throttle from 'lodash/throttle.js';
import {
  computed,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useAttrs,
} from 'vue';

import Button from '../button/Button.vue';
import type { BackTopEmits, BackTopProps, BackTopSlots, BackTopTarget } from './types';

defineOptions({ name: 'BackTop', inheritAttrs: false });

const props = withDefaults(defineProps<BackTopProps>(), {
  duration: 450,
  target: () => (typeof window === 'undefined' ? null : window),
  visibilityHeight: 400,
});
const emit = defineEmits<BackTopEmits>();
defineSlots<BackTopSlots>();

interface BackTopState {
  visible: boolean;
}

interface FoundationBackTopProps {
  duration: number;
  target: () => BackTopTarget | null | undefined;
  visibilityHeight: number;
}

const prefixCls = 'semi-backtop';
const attrs = useAttrs();
const state = shallowReactive<BackTopState>({ visible: false });
const cache = new Map<string, unknown>();
const clickHandler = shallowRef<ReturnType<typeof throttle> | null>(null);

function getFoundationProps(): FoundationBackTopProps {
  return {
    duration: props.duration,
    target: props.target,
    visibilityHeight: props.visibilityHeight,
  };
}

const adapter: BackTopAdapter<FoundationBackTopProps, BackTopState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key as keyof FoundationBackTopProps],
  getProps: getFoundationProps,
  getState: (key) => state[key as keyof BackTopState],
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
  updateVisible: (visible) => {
    state.visible = visible;
  },
  notifyClick: (event) => emit('click', event),
  targetIsWindow: (target) => typeof window !== 'undefined' && target === window,
  isWindowUndefined: () => typeof window === 'undefined',
  targetScrollToTop: (target, scrollTop) => {
    if (typeof window !== 'undefined' && target === window) {
      document.body.scrollTop = scrollTop;
      document.documentElement.scrollTop = scrollTop;
      return;
    }
    if (target instanceof HTMLElement) target.scrollTop = scrollTop;
  },
};
const foundation = markRaw(new BackTopFoundation<FoundationBackTopProps, BackTopState>(adapter));

const rootClasses = computed(() => [prefixCls, props.className, attrs.class]);
const rootStyle = computed(() => [props.style, attrs.style]);
const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style'].includes(name))),
);

function handleClick(event: MouseEvent): void {
  clickHandler.value?.(event);
}

onMounted(() => {
  foundation.init();
  clickHandler.value = throttle((event: MouseEvent) => foundation.onClick(event), props.duration);
});

onBeforeUnmount(() => {
  foundation.destroy();
  clickHandler.value?.cancel();
  clickHandler.value = null;
});
</script>

<template>
  <div
    v-if="state.visible"
    v-bind="rootAttrs"
    :class="rootClasses"
    :style="rootStyle"
    :duration="props.duration"
    x-semi-prop="children"
    @click="handleClick"
  >
    <slot>
      <Button theme="light">
        <template #icon><IconChevronUp /></template>
      </Button>
    </slot>
  </div>
</template>
