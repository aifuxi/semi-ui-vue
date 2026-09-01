<script setup lang="ts">
import {
  ChatInputBoxFoundation,
  type ChatInputBoxAdapter,
} from '@workspace/foundation-integration';
import {
  h,
  markRaw,
  shallowReactive,
  shallowRef,
  type ComponentPublicInstance,
  type VNodeChild,
} from 'vue';

import type { UploadChangePayload, UploadFileItem } from '../upload';
import ChatInputBoxDefault from './ChatInputBoxDefault.vue';
import ChatNodeRenderer from './ChatNodeRenderer';
import type {
  ChatInputChangePayload,
  ChatLocale,
  ChatProps,
  ChatRenderInputAreaProps,
} from './types';

const props = defineProps<{
  chatProps: ChatProps;
  locale?: ChatLocale | undefined;
  disableSend?: boolean | undefined;
  clickUpload: boolean;
  pasteUpload: boolean;
  renderInputArea?: ((props: ChatRenderInputAreaProps) => VNodeChild) | undefined;
}>();
const emit = defineEmits<{
  send: [content: string, attachment: UploadFileItem[]];
  clear: [event?: Event];
  inputChange: [payload: ChatInputChangePayload];
}>();
interface InputState {
  content: string;
  attachment: UploadFileItem[];
}
interface RuntimeProps {
  canSend: boolean | undefined;
  disableSend: boolean | undefined;
  sendHotKey?: string;
  uploadProps: Record<string, unknown>;
  manualUpload(files: File[]): void;
  pasteUpload: boolean;
}
const state = shallowReactive<InputState>({ content: '', attachment: [] });
const cache = new Map<unknown, unknown>();
const defaultInstance = shallowRef<{ focus?: () => void; insert?: (files: File[]) => void }>();
const runtimeProps = (): RuntimeProps => ({
  canSend: props.chatProps.canSend,
  disableSend: props.disableSend,
  sendHotKey: props.chatProps.sendHotKey ?? 'enter',
  uploadProps: (props.chatProps.uploadProps ?? {}) as Record<string, unknown>,
  manualUpload: (files) => defaultInstance.value?.insert?.(files),
  pasteUpload: props.pasteUpload,
});
const adapter: ChatInputBoxAdapter<RuntimeProps, InputState> = {
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
  notifyInputChange: (payload) => emit('inputChange', payload as ChatInputChangePayload),
  setInputValue: (value) => {
    state.content = value;
  },
  setAttachment: (attachment) => {
    state.attachment = attachment as UploadFileItem[];
  },
  notifySend: (content, attachment) => emit('send', content, attachment as UploadFileItem[]),
};
const foundation = markRaw(new ChatInputBoxFoundation<RuntimeProps, InputState>(adapter));

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' && !event.isComposing) foundation.onEnterPress(event);
}
function handleUploadChange(payload: UploadChangePayload): void {
  foundation.onAttachmentAdd(payload);
}
function setDefaultInstance(instance: Element | ComponentPublicInstance | null): void {
  defaultInstance.value = (instance as typeof defaultInstance.value) ?? undefined;
}
function createDefaultNode(): VNodeChild {
  return h(ChatInputBoxDefault as never, {
    ref: setDefaultInstance,
    value: state.content,
    attachment: state.attachment,
    disabled: foundation.getDisableSend(),
    clickUpload: props.clickUpload,
    pasteUpload: props.pasteUpload,
    chatProps: props.chatProps,
    locale: props.locale,
    onInput: foundation.onInputAreaChange,
    onKeydown: handleKeydown,
    onPaste: foundation.onPaste,
    onUploadChange: handleUploadChange,
    onRemove: foundation.onAttachmentDelete,
    onSend: foundation.onSend,
    onClear: (event: Event) => emit('clear', event),
  });
}
function renderCustomInputArea(): VNodeChild {
  const defaultNode = createDefaultNode();
  const renderProps: ChatRenderInputAreaProps = {
    defaultNode,
    onSend: (content = '', attachment = []) => emit('send', content, attachment),
    onClear: (event) => emit('clear', event),
    detailProps: {
      inputNode: defaultNode,
      onClick: () => defaultInstance.value?.focus?.(),
    },
  };
  return props.renderInputArea?.(renderProps) ?? defaultNode;
}

defineExpose({ insert: (files: File[]) => defaultInstance.value?.insert?.(files) });
</script>

<template>
  <ChatInputBoxDefault
    v-if="!props.renderInputArea"
    :ref="setDefaultInstance"
    :value="state.content"
    :attachment="state.attachment"
    :disabled="foundation.getDisableSend()"
    :click-upload="props.clickUpload"
    :paste-upload="props.pasteUpload"
    :chat-props="props.chatProps"
    :locale="props.locale"
    @input="foundation.onInputAreaChange"
    @keydown="handleKeydown"
    @paste="foundation.onPaste"
    @upload-change="handleUploadChange"
    @remove="foundation.onAttachmentDelete"
    @send="foundation.onSend"
    @clear="emit('clear', $event)"
  />
  <ChatNodeRenderer v-else :content="renderCustomInputArea()" />
</template>
