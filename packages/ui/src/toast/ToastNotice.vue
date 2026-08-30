<script setup lang="ts">
import { ToastFoundation, type ToastAdapter } from '@workspace/foundation-integration';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconClose,
  IconInfoCircle,
  IconTickCircle,
} from '@aifuxi/semi-icons-vue';
import {
  computed,
  inject,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useTemplateRef,
  watch,
  type Component,
} from 'vue';

import Button from '../button/Button.vue';
import { configContextKey, type ConfigDirection } from '../config-provider';

import ToastIconRenderer from './ToastIconRenderer';
import ToastNodeRenderer from './ToastNodeRenderer';
import type { ToastEntry, ToastId, ToastType } from './types';

defineOptions({ name: 'ToastNotice' });
const props = defineProps<{
  animationClass?: string | undefined;
  entry: ToastEntry;
  positionInList: { index: number; length: number };
  stack: boolean;
  stackExpanded: boolean;
}>();
const emit = defineEmits<{
  animationEnd: [id: ToastId];
  remove: [id: ToastId];
}>();

type ToastState = Record<string, never>;

const config = inject(configContextKey, undefined);
const toastElement = useTemplateRef<HTMLElement>('toast');
const state = shallowReactive<ToastState>({});
const cache = new Map<string, unknown>();
const adapter: ToastAdapter<ToastEntry, ToastState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => props.entry[key as keyof ToastEntry],
  getProps: () => props.entry,
  getState: (key) => state[key as keyof ToastState],
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
  notifyWrapperToRemove: (id) => emit('remove', id),
  notifyClose: () => props.entry.onClose?.(),
};
const foundation = markRaw(new ToastFoundation(adapter));

const defaultIconComponents: Partial<Record<ToastType, Component>> = {
  error: IconAlertCircle,
  info: IconInfoCircle,
  success: IconTickCircle,
  warning: IconAlertTriangle,
};
const direction = computed<ConfigDirection>(
  () => props.entry.direction ?? config?.value.direction ?? 'ltr',
);
const defaultIconComponent = computed(() => defaultIconComponents[props.entry.type]);
const usesCustomIcon = computed(() => props.entry.icon !== null && props.entry.icon !== undefined);
const noticeClasses = computed(() => [
  'semi-toast',
  `semi-toast-${props.entry.type}`,
  props.entry.theme === 'light' ? 'semi-toast-light' : undefined,
  direction.value === 'rtl' ? 'semi-toast-rtl' : undefined,
  props.entry.className,
  props.animationClass,
]);
const textStyle = computed(() => ({
  maxWidth:
    typeof props.entry.textMaxWidth === 'number'
      ? `${props.entry.textMaxWidth}px`
      : props.entry.textMaxWidth,
}));
const reservedIndex = computed(() => props.positionInList.length - props.positionInList.index - 1);
const noticeStyle = computed(() => [
  props.entry.style,
  { transform: `translate3d(0,0,${reservedIndex.value * -10}px)` },
]);
const stackWrapperStyle = computed(() => {
  if (!props.stackExpanded || !toastElement.value) return { height: 0 };
  return { height: getComputedStyle(toastElement.value).height };
});

function close(event: MouseEvent): void {
  foundation.close(event);
}

function handleAnimationEnd(event: AnimationEvent): void {
  if (event.target === event.currentTarget) emit('animationEnd', props.entry.id);
}

watch(
  () => props.entry.revision,
  (revision, previousRevision) => {
    if (revision !== previousRevision) foundation.restartCloseTimer();
  },
);
onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <div v-if="props.stack" class="semi-toast-zero-height-wrapper" :style="stackWrapperStyle">
    <div
      ref="toast"
      :aria-label="`${props.entry.type || 'default'} type`"
      :class="noticeClasses"
      :style="noticeStyle"
      role="alert"
      @animationend="handleAnimationEnd"
      @mouseenter="foundation.clearCloseTimer_()"
      @mouseleave="foundation.startCloseTimer_()"
    >
      <div class="semi-toast-content">
        <ToastIconRenderer v-if="usesCustomIcon" :content="props.entry.icon" />
        <component
          :is="defaultIconComponent"
          v-else-if="defaultIconComponent"
          :class="['semi-toast-icon', `semi-toast-icon-${props.entry.type}`]"
          size="large"
        />
        <span class="semi-toast-content-text" :style="textStyle" x-semi-prop="content">
          <ToastNodeRenderer :content="props.entry.content" />
        </span>
        <div v-if="props.entry.showClose" class="semi-toast-close-button">
          <Button aria-label="Close" size="small" theme="borderless" type="tertiary" @click="close">
            <template #icon><IconClose x-semi-prop="icon" /></template>
          </Button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    ref="toast"
    :aria-label="`${props.entry.type || 'default'} type`"
    :class="noticeClasses"
    :style="noticeStyle"
    role="alert"
    @animationend="handleAnimationEnd"
    @mouseenter="foundation.clearCloseTimer_()"
    @mouseleave="foundation.startCloseTimer_()"
  >
    <div class="semi-toast-content">
      <ToastIconRenderer v-if="usesCustomIcon" :content="props.entry.icon" />
      <component
        :is="defaultIconComponent"
        v-else-if="defaultIconComponent"
        :class="['semi-toast-icon', `semi-toast-icon-${props.entry.type}`]"
        size="large"
      />
      <span class="semi-toast-content-text" :style="textStyle" x-semi-prop="content">
        <ToastNodeRenderer :content="props.entry.content" />
      </span>
      <div v-if="props.entry.showClose" class="semi-toast-close-button">
        <Button aria-label="Close" size="small" theme="borderless" type="tertiary" @click="close">
          <template #icon><IconClose x-semi-prop="icon" /></template>
        </Button>
      </div>
    </div>
  </div>
</template>
