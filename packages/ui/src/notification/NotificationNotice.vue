<script setup lang="ts">
import {
  NotificationFoundation,
  type NotificationAdapter,
} from '@workspace/foundation-integration';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconClose,
  IconInfoCircle,
  IconTickCircle,
} from '@workspace/icons';
import {
  Comment,
  Text,
  computed,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  watch,
  type Component,
  type VNode,
  type VNodeChild,
} from 'vue';

import Button from '../button/Button.vue';
import type { ConfigDirection } from '../config-provider';

import NotificationNodeRenderer from './NotificationNodeRenderer';
import type { NotificationEntry, NotificationId, NotificationType } from './types';

defineOptions({ name: 'NotificationNotice' });
const props = defineProps<{
  animationClass?: string | undefined;
  direction: ConfigDirection;
  entry: NotificationEntry;
}>();
const emit = defineEmits<{
  animationEnd: [id: NotificationId];
  remove: [id: NotificationId];
}>();

interface NoticeState {
  visible: boolean;
}

const state = shallowReactive<NoticeState>({ visible: true });
const cache = new Map<string, unknown>();
const adapter: NotificationAdapter<NotificationEntry, NoticeState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => props.entry[key as keyof NotificationEntry],
  getProps: () => props.entry,
  getState: (key) => state[key as keyof NoticeState],
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
const foundation = markRaw(new NotificationFoundation(adapter));

const defaultIconComponents: Partial<Record<NotificationType, Component>> = {
  error: IconAlertCircle,
  info: IconInfoCircle,
  success: IconTickCircle,
  warning: IconAlertTriangle,
};
const defaultIconComponent = computed(() => defaultIconComponents[props.entry.type]);
const usesCustomIcon = computed(() => Boolean(props.entry.icon));
const hasIcon = computed(() => usesCustomIcon.value || Boolean(defaultIconComponent.value));
const titleId = computed(
  () => `semi-notification-title-${props.entry.id.replace(/[^a-zA-Z0-9_-]/g, '-')}`,
);

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

const hasTitle = computed(() => hasReactTruthyContent(props.entry.title));
const hasContent = computed(() => hasReactTruthyContent(props.entry.content));
const noticeClasses = computed(() => [
  'semi-notification-notice',
  hasIcon.value ? 'semi-notification-notice-icon-show' : undefined,
  `semi-notification-notice-${props.entry.type}`,
  props.entry.theme === 'light' ? 'semi-notification-notice-light' : undefined,
  props.direction === 'rtl' ? 'semi-notification-notice-rtl' : undefined,
  props.entry.className,
  props.animationClass,
]);

function close(event: MouseEvent): void {
  props.entry.onCloseClick?.(props.entry.id);
  foundation.close(event);
}

function handleAnimationEnd(): void {
  emit('animationEnd', props.entry.id);
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
  <div
    :class="noticeClasses"
    :style="props.entry.style"
    :aria-labelledby="titleId"
    role="alert"
    @animationend="handleAnimationEnd"
    @click="props.entry.onClick?.($event)"
    @mouseenter="foundation._clearCloseTimer()"
    @mouseleave="foundation._startCloseTimer()"
  >
    <div>
      <div
        v-if="hasIcon"
        :class="['semi-notification-notice-icon', `semi-notification-notice-${props.entry.type}`]"
        x-semi-prop="icon"
      >
        <NotificationNodeRenderer v-if="usesCustomIcon" :content="props.entry.icon" />
        <component :is="defaultIconComponent" v-else size="large" />
      </div>
    </div>
    <div class="semi-notification-notice-inner">
      <div class="semi-notification-notice-content-wrapper">
        <div
          v-if="hasTitle"
          :id="titleId"
          class="semi-notification-notice-title"
          x-semi-prop="title"
        >
          <NotificationNodeRenderer :content="props.entry.title" />
        </div>
        <div v-if="hasContent" class="semi-notification-notice-content" x-semi-prop="content">
          <NotificationNodeRenderer :content="props.entry.content" />
        </div>
      </div>
      <Button
        v-if="props.entry.showClose !== false"
        class="semi-notification-notice-icon-close"
        size="small"
        theme="borderless"
        type="tertiary"
        @click="close"
      >
        <template #icon><IconClose /></template>
      </Button>
    </div>
  </div>
</template>
