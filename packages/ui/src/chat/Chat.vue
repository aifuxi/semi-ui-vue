<script setup lang="ts">
import { IconChevronDown, IconDisc } from '@aifuxi/semi-icons-vue';
import { ChatFoundation, type ChatFoundationAdapter } from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useSlots,
  useTemplateRef,
  watch,
  type VNodeChild,
} from 'vue';

import { Button } from '../button';
import { semiGlobal } from '../config-provider';
import { LocaleConsumer } from '../locale';
import { ToastFactory } from '../toast';
import type { UploadFileItem } from '../upload';
import ChatContent from './ChatContent.vue';
import ChatHint from './ChatHint.vue';
import ChatInputBox from './ChatInputBox.vue';
import ChatNodeRenderer from './ChatNodeRenderer';
import type {
  ChatBoxRenderConfig,
  ChatEmits,
  ChatExposed,
  ChatInputChangePayload,
  ChatLocale,
  ChatMessage,
  ChatProps,
  ChatSlots,
} from './types';

defineOptions({ name: 'Chat', inheritAttrs: false });
const props = defineProps<ChatProps>();
const emit = defineEmits<ChatEmits>();
defineSlots<ChatSlots>();
const slots = useSlots();
const instance = getCurrentInstance();
const container = useTemplateRef<HTMLDivElement>('container');
const dropArea = useTemplateRef<HTMLDivElement>('dropArea');
const inputBox = useTemplateRef<{ insert(files: File[]): void }>('inputBox');

interface ChatState {
  chats: ChatMessage[];
  cacheHints: string[];
  backBottomVisible: boolean;
  wheelScroll: boolean;
  uploadAreaVisible: boolean;
}
interface RuntimeProps {
  chats: ChatMessage[];
  onMessageDelete?: (message?: ChatMessage) => void;
  onChatsChange?: (chats: ChatMessage[]) => void;
  onMessageReset?: (message?: ChatMessage) => void;
}
const state = shallowReactive<ChatState>({
  chats: props.chats ?? [],
  cacheHints: props.hints ?? [],
  backBottomVisible: false,
  wheelScroll: false,
  uploadAreaVisible: false,
});
const cache = new Map<unknown, unknown>();
let wheelHandler: ((event: WheelEvent) => void) | undefined;
let resizeObserver: ResizeObserver | undefined;
let dragStatus = false;

function hasRawProp(key: keyof ChatProps): boolean {
  const raw = instance?.vnode.props;
  const kebab = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, key) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}
function resolved<Key extends keyof ChatProps>(
  key: Key,
  fallback: NonNullable<ChatProps[Key]>,
): NonNullable<ChatProps[Key]> {
  if (hasRawProp(key) && props[key] !== undefined) return props[key] as NonNullable<ChatProps[Key]>;
  const configured = semiGlobal.config.overrideDefaultProps?.Chat?.[key];
  return (configured === undefined ? fallback : configured) as NonNullable<ChatProps[Key]>;
}
const align = computed(() => resolved('align', 'leftRight'));
const mode = computed(() => resolved('mode', 'bubble'));
const sendHotKey = computed(() => resolved('sendHotKey', 'enter'));
const escapeHtml = computed(() => resolved('escapeHtml', true));
const showStopGenerate = computed(() => resolved('showStopGenerate', false));
const showClearContext = computed(() => resolved('showClearContext', false));
const enableUpload = computed(() => resolved('enableUpload', true));
const uploadModes = computed(() =>
  foundation.getUploadProps(enableUpload.value as boolean | Record<string, boolean>),
);
const lastMessageOngoing = computed(() => {
  const status = state.chats.at(-1)?.status;
  return status === 'loading' || status === 'incomplete';
});
const showStop = computed(() => showStopGenerate.value && lastMessageOngoing.value);

function notifyChats(chats: ChatMessage[]): void {
  emit('chats-change', chats);
  emit('update:chats', chats);
}
function runtimeProps(): RuntimeProps {
  return {
    chats: state.chats,
    onMessageDelete: (message) => emit('message-delete', message),
    onChatsChange: notifyChats,
    onMessageReset: (message) => emit('message-reset', message),
  };
}
const adapter: ChatFoundationAdapter<RuntimeProps, ChatState> = {
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
  getContainerRef: () => container.value,
  setWheelScroll: (flag) => {
    state.wheelScroll = flag;
  },
  notifyChatsChange: (chats) => notifyChats(chats as ChatMessage[]),
  notifyLikeMessage: (message) => emit('message-good-feedback', message as ChatMessage),
  notifyDislikeMessage: (message) => emit('message-bad-feedback', message as ChatMessage),
  notifyCopyMessage: (message) => emit('message-copy', message as ChatMessage),
  notifyClearContext: () => emit('clear'),
  notifyMessageSend: (content, attachment) =>
    emit('message-send', content, attachment as UploadFileItem[]),
  notifyInputChange: (payload) => emit('input-change', payload as ChatInputChangePayload),
  setBackBottomVisible: (visible) => {
    state.backBottomVisible = visible;
  },
  registerWheelEvent: () => {
    adapter.unRegisterWheelEvent();
    if (!container.value) return;
    wheelHandler = () => {
      state.wheelScroll = true;
      adapter.unRegisterWheelEvent();
    };
    container.value.addEventListener('wheel', wheelHandler, { passive: true });
  },
  unRegisterWheelEvent: () => {
    if (container.value && wheelHandler) container.value.removeEventListener('wheel', wheelHandler);
    wheelHandler = undefined;
  },
  notifyStopGenerate: (event) => emit('stop-generator', event),
  notifyHintClick: (hint) => emit('hint-click', hint),
  setUploadAreaVisible: (visible) => {
    state.uploadAreaVisible = visible;
  },
  manualUpload: (files) => inputBox.value?.insert(Array.from(files)),
  getDropAreaElement: () => dropArea.value,
  getDragStatus: () => dragStatus,
  setDragStatus: (status) => {
    dragStatus = status;
  },
};
const foundation = markRaw(new ChatFoundation<RuntimeProps, ChatState>(adapter));
const toast = ToastFactory.create();

watch(
  () => props.chats,
  (chats, previous) => {
    state.chats = chats ?? [];
    if (!state.wheelScroll && chats !== previous)
      void nextTick(() => foundation.scrollToBottomImmediately());
  },
);
watch(
  () => props.hints,
  (hints, previous) => {
    state.cacheHints = hints ?? [];
    if (!state.wheelScroll && (hints?.length ?? 0) > (previous?.length ?? 0))
      void nextTick(() => foundation.scrollToBottomImmediately());
  },
);

const renderConfig = computed<ChatBoxRenderConfig>(() => ({
  ...props.chatBoxRenderConfig,
  renderChatBoxTitle: slots['chat-box-title'] ?? props.chatBoxRenderConfig?.renderChatBoxTitle,
  renderChatBoxAvatar: slots['chat-box-avatar'] ?? props.chatBoxRenderConfig?.renderChatBoxAvatar,
  renderChatBoxContent:
    slots['chat-box-content'] ?? props.chatBoxRenderConfig?.renderChatBoxContent,
  renderChatBoxAction: slots['chat-box-action'] ?? props.chatBoxRenderConfig?.renderChatBoxAction,
  renderFullChatBox: slots['chat-box'] ?? props.chatBoxRenderConfig?.renderFullChatBox,
}));
const renderHint = computed(() => slots.hint ?? props.renderHintBox);
const renderDivider = computed(() =>
  slots.divider
    ? (message?: ChatMessage) => slots.divider?.({ message: message! })
    : props.renderDivider,
);
const renderInputArea = computed(() => slots['input-area'] ?? props.renderInputArea);
const topContent = computed<VNodeChild>(() => slots.top?.() ?? props.topSlot);
const bottomContent = computed<VNodeChild>(() => slots.bottom?.() ?? props.bottomSlot);
const inputChatProps = computed<ChatProps>(() => {
  const output = Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined),
  ) as ChatProps;
  if (!hasRawProp('canSend')) delete output.canSend;
  output.showClearContext = showClearContext.value;
  output.sendHotKey = sendHotKey.value;
  return output;
});

function handleScroll(event: Event): void {
  if (event.target === event.currentTarget) foundation.containerScroll(event);
}
function handleClear(event?: Event): void {
  if (state.chats.at(-1)?.role === 'divider') return;
  if (!state.chats.length) {
    notifyChats([{ role: 'divider', id: `chat-divider-${Date.now()}`, createAt: Date.now() }]);
    emit('clear');
    return;
  }
  foundation.clearContext(event ?? null);
}
function handleCopy(message: ChatMessage, locale?: ChatLocale): void {
  adapter.notifyCopyMessage(message);
  const value =
    typeof message.content === 'string'
      ? message.content
      : (message.content ?? [])
          .map((item) => (item.type === 'text' ? (item.text ?? '') : ''))
          .join('');
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText)
    void navigator.clipboard.writeText(value);
  toast.success({ content: locale?.copySuccess ?? 'Copied' });
}
function handleStop(event: MouseEvent): void {
  foundation.stopGenerate(event);
}
function resetMessage(): void {
  foundation.resetMessage(undefined);
}
function clearContext(): void {
  handleClear();
}
function scrollToBottom(animation = false): void {
  if (animation) foundation.scrollToBottomWithAnimation();
  else foundation.scrollToBottomImmediately();
}
function sendMessage(content: string, attachment: UploadFileItem[] = []): void {
  foundation.onMessageSend(content, attachment);
}

onMounted(() => {
  foundation.init();
  if (typeof ResizeObserver !== 'undefined' && container.value) {
    resizeObserver = new ResizeObserver(() => foundation.handleScrollContainerResize());
    resizeObserver.observe(container.value);
  }
});
onBeforeUnmount(() => {
  foundation.destroy();
  resizeObserver?.disconnect();
  toast.destroyAll();
});

defineExpose<ChatExposed>({
  resetMessage,
  clearContext,
  scrollToBottom,
  sendMessage,
  getContainerElement: () => container.value,
});
</script>

<template>
  <LocaleConsumer v-slot="{ localeData }" component-name="Chat">
    <div
      :class="['semi-chat', props.class, props.className]"
      :style="props.style"
      @dragover="uploadModes.dragUpload && foundation.handleDragOver($event)"
      @dragstart="uploadModes.dragUpload && foundation.handleDragStart($event)"
      @dragend="uploadModes.dragUpload && foundation.handleDragEnd($event)"
    >
      <div
        v-if="uploadModes.dragUpload && state.uploadAreaVisible"
        ref="dropArea"
        class="semi-chat-dropArea"
        @dragover="foundation.handleContainerDragOver"
        @drop="foundation.handleContainerDrop"
        @dragleave="foundation.handleContainerDragLeave"
      >
        <span class="semi-chat-dropArea-text">{{
          (localeData as ChatLocale)?.dropAreaText ?? 'Put the file here'
        }}</span>
      </div>
      <div class="semi-chat-inner">
        <ChatNodeRenderer :content="topContent" />
        <div class="semi-chat-content">
          <div
            ref="container"
            :class="[
              'semi-chat-container',
              !state.wheelScroll ? 'semi-chat-container-scroll-hidden' : undefined,
            ]"
            @scroll="handleScroll"
          >
            <ChatContent
              :chats="state.chats"
              :align="align"
              :mode="mode"
              :role-config="props.roleConfig"
              :render-config="renderConfig"
              :render-divider="renderDivider"
              :custom-mark-down-components="props.customMarkDownComponents"
              :markdown-render-props="props.markdownRenderProps"
              :escape-html="escapeHtml"
              :locale="localeData as ChatLocale"
              @copy="handleCopy($event, localeData as ChatLocale)"
              @like="foundation.likeMessage"
              @dislike="foundation.dislikeMessage"
              @reset="foundation.resetMessage"
              @delete="foundation.deleteMessage"
            />
            <ChatHint
              :hints="props.hints"
              :class-name="props.hintCls"
              :style="props.hintStyle"
              :render-hint="renderHint"
              @select="foundation.onHintClick"
            />
          </div>
        </div>
        <span v-if="state.backBottomVisible && !showStop" class="semi-chat-action">
          <Button
            class="semi-chat-action-content semi-chat-action-backBottom"
            type="tertiary"
            aria-label="scroll to bottom"
            @click="scrollToBottom(true)"
            ><template #icon><IconChevronDown size="extra-large" /></template
          ></Button>
        </span>
        <span v-if="showStop" class="semi-chat-action">
          <Button
            class="semi-chat-action-content semi-chat-action-stop"
            type="tertiary"
            @click="handleStop"
          >
            <template #icon><IconDisc size="extra-large" /></template>
            {{ (localeData as ChatLocale)?.stop ?? 'Stop' }}
          </Button>
        </span>
        <ChatInputBox
          ref="inputBox"
          :chat-props="inputChatProps"
          :locale="localeData as ChatLocale"
          :disable-send="showStop"
          :click-upload="uploadModes.clickUpload"
          :paste-upload="uploadModes.pasteUpload"
          :render-input-area="renderInputArea"
          @send="foundation.onMessageSend"
          @clear="handleClear"
          @input-change="foundation.onInputChange"
        />
        <ChatNodeRenderer :content="bottomContent" />
      </div>
    </div>
  </LocaleConsumer>
</template>
