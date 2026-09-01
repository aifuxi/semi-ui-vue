<script setup lang="ts">
import {
  ChatBoxActionFoundation,
  type ChatBoxActionAdapter,
} from '@workspace/foundation-integration';
import { computed, h, markRaw, onBeforeUnmount, shallowReactive, type VNodeChild } from 'vue';

import ChatBoxActionDefault from './ChatBoxActionDefault.vue';
import ChatNodeRenderer from './ChatNodeRenderer';
import type { ChatLocale, ChatMessage, ChatRenderActionProps } from './types';

const props = defineProps<{
  message: ChatMessage;
  lastChat: boolean;
  locale?: ChatLocale | undefined;
  renderAction?: ((props: ChatRenderActionProps) => VNodeChild) | undefined;
}>();
const emit = defineEmits<{
  copy: [message: ChatMessage];
  like: [message: ChatMessage];
  dislike: [message: ChatMessage];
  reset: [message: ChatMessage];
  delete: [message: ChatMessage];
}>();
interface ActionState {
  visible: boolean;
  showAction: boolean;
}
const state = shallowReactive<ActionState>({ visible: false, showAction: false });
const cache = new Map<unknown, unknown>();
let outsideHandler: ((event: MouseEvent) => void) | undefined;
const runtimeProps = () => ({ message: props.message });
const adapter: ChatBoxActionAdapter<ReturnType<typeof runtimeProps>, ActionState> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => runtimeProps()[key],
  getProps: runtimeProps,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (next, callback) => {
    Object.assign(state, next);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  notifyDeleteMessage: () => emit('delete', props.message),
  notifyMessageCopy: () => emit('copy', props.message),
  copyToClipboardAndToast: () => undefined,
  notifyLikeMessage: () => emit('like', props.message),
  notifyDislikeMessage: () => emit('dislike', props.message),
  notifyResetMessage: () => emit('reset', props.message),
  setVisible: (visible) => {
    state.visible = visible;
  },
  setShowAction: (showAction) => {
    state.showAction = showAction;
  },
  registerClickOutsideHandler: (callback) => {
    if (typeof window === 'undefined') return;
    outsideHandler = () => callback();
  },
  unregisterClickOutsideHandler: () => {
    if (typeof window !== 'undefined' && outsideHandler)
      window.removeEventListener('mousedown', outsideHandler);
    outsideHandler = undefined;
  },
};
const foundation = markRaw(new ChatBoxActionFoundation(adapter));
const finished = computed(
  () => !['loading', 'incomplete'].includes(props.message.status ?? 'complete'),
);
const showReset = computed(() => props.lastChat && props.message.role === 'assistant');
const className = computed(() =>
  [
    'semi-chat-chatBox-action',
    state.showAction || (showReset.value && finished.value)
      ? 'semi-chat-chatBox-action-show'
      : undefined,
    !finished.value ? 'semi-chat-chatBox-action-hidden' : undefined,
  ]
    .filter(Boolean)
    .join(' '),
);
const defaultNode = computed(() =>
  h(ChatBoxActionDefault as never, {
    message: props.message,
    lastChat: props.lastChat,
    visible: state.visible,
    className: className.value,
    locale: props.locale,
    onCopy: foundation.copyMessage,
    onLike: foundation.likeMessage,
    onDislike: foundation.dislikeMessage,
    onReset: foundation.resetMessage,
    onShowDelete: foundation.showDeletePopup,
    onHideDelete: foundation.hideDeletePopup,
    onDelete: foundation.deleteMessage,
  }),
);
const output = computed(
  () =>
    props.renderAction?.({
      message: props.message,
      defaultActions: defaultNode.value,
      className: className.value,
      defaultActionsObj: {},
    }) ?? defaultNode.value,
);

onBeforeUnmount(() => foundation.destroy());
</script>

<template><ChatNodeRenderer :content="output" /></template>
