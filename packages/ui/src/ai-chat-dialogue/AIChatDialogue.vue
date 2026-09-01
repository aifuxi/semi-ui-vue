<script setup lang="ts">
import { IconChevronDown } from '@aifuxi/semi-icons-vue';
import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type PropType,
  type VNodeChild,
} from 'vue';

import { Button } from '../button';
import { semiGlobal } from '../config-provider';
import { LocaleConsumer } from '../locale';
import AIChatDialogueHint from './AIChatDialogueHint.vue';
import AIChatDialogueItem from './AIChatDialogueItem.vue';
import { AI_CHAT_DIALOGUE_SCROLL_DURATION, AI_CHAT_DIALOGUE_SCROLL_GAP } from './constants';
import type {
  AIChatDialogueLocale,
  AIChatDialogueProps,
  Annotation,
  DialogueRenderConfig,
  InputFile,
  InputImage,
  Message,
  Metadata,
  Reference,
} from './types';

defineOptions({ name: 'AIChatDialogue', inheritAttrs: false });
const props = defineProps({
  align: { type: String as PropType<AIChatDialogueProps['align']>, default: undefined },
  chats: { type: Array as PropType<Message[]>, default: () => [] },
  class: { type: null as unknown as PropType<AIChatDialogueProps['class']>, default: undefined },
  className: { type: String, default: undefined },
  disabledFileItemClick: { type: Boolean, default: undefined },
  escapeHtml: { type: Boolean, default: undefined },
  hintCls: { type: String, default: undefined },
  hints: { type: Array as PropType<string[]>, default: () => [] },
  hintStyle: { type: Object as PropType<AIChatDialogueProps['hintStyle']>, default: undefined },
  selecting: { type: Boolean, default: undefined },
  markdownRenderProps: {
    type: Object as PropType<AIChatDialogueProps['markdownRenderProps']>,
    default: undefined,
  },
  messageEditRender: {
    type: Function as PropType<AIChatDialogueProps['messageEditRender']>,
    default: undefined,
  },
  mode: { type: String as PropType<AIChatDialogueProps['mode']>, default: undefined },
  roleConfig: { type: Object as PropType<AIChatDialogueProps['roleConfig']>, required: true },
  style: { type: null as unknown as PropType<AIChatDialogueProps['style']>, default: undefined },
  showReset: { type: Boolean, default: undefined },
  showReference: { type: Boolean, default: undefined },
  dialogueRenderConfig: {
    type: Object as PropType<AIChatDialogueProps['dialogueRenderConfig']>,
    default: undefined,
  },
  renderDialogueContentItem: {
    type: Object as PropType<AIChatDialogueProps['renderDialogueContentItem']>,
    default: undefined,
  },
  renderHintBox: {
    type: Function as PropType<AIChatDialogueProps['renderHintBox']>,
    default: undefined,
  },
});
const emit = defineEmits<{
  'update:chats': [chats: Message[]];
  'chats-change': [chats: Message[]];
  select: [selectedIds: string[]];
  'annotation-click': [annotation: Annotation[]];
  'file-click': [file: InputFile];
  'image-click': [image: InputImage];
  'hint-click': [hint: string];
  'reference-click': [reference: Reference];
  'message-bad-feedback': [message: Message];
  'message-copy': [message: Message];
  'message-delete': [message: Message];
  'message-edit': [message: Message];
  'message-good-feedback': [message: Message];
  'message-reset': [message: Message];
  'message-share': [message: Message];
}>();

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const list = useTemplateRef<HTMLDivElement>('list');
const selectedIds = shallowRef(new Set<string>());
const backBottomVisible = shallowRef(false);
const wheelScroll = shallowRef(false);
let scrollFrame = 0;
let scrollTimer: ReturnType<typeof setTimeout> | undefined;
let animationFrame = 0;

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebab = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}
function booleanProp(
  name: 'disabledFileItemClick' | 'escapeHtml' | 'selecting' | 'showReset' | 'showReference',
  fallback: boolean,
): boolean {
  if (hasRawProp(name) && props[name] !== undefined) return props[name];
  const globalValue = semiGlobal.config.overrideDefaultProps?.AIChatDialogue?.[name];
  return typeof globalValue === 'boolean' ? globalValue : fallback;
}
const align = computed(() => props.align ?? 'leftRight');
const mode = computed(() => props.mode ?? 'bubble');
const effectiveDisabledFileItemClick = computed(() => booleanProp('disabledFileItemClick', false));
const effectiveEscapeHtml = computed(() => booleanProp('escapeHtml', true));
const effectiveSelecting = computed(() => booleanProp('selecting', false));
const effectiveShowReset = computed(() => booleanProp('showReset', true));
const effectiveShowReference = computed(() => booleanProp('showReference', false));
const rootClasses = computed(() => [
  'semi-ai-chat-dialogue',
  props.class,
  props.className,
  attrs.class,
]);
const rootStyle = computed(() => [props.style, attrs.style]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);

const renderConfig = computed<DialogueRenderConfig | undefined>(() => {
  const configured = props.dialogueRenderConfig ?? {};
  const mapped: DialogueRenderConfig = {
    ...configured,
    ...(slots['dialogue-avatar']
      ? { renderDialogueAvatar: (payload) => slots['dialogue-avatar']?.(payload) }
      : {}),
    ...(slots['dialogue-title']
      ? { renderDialogueTitle: (payload) => slots['dialogue-title']?.(payload) }
      : {}),
    ...(slots['dialogue-content']
      ? { renderDialogueContent: (payload) => slots['dialogue-content']?.(payload) }
      : {}),
    ...(slots['dialogue-action']
      ? { renderDialogueAction: (payload) => slots['dialogue-action']?.(payload) }
      : {}),
    ...(slots['full-dialogue']
      ? { renderFullDialogue: (payload) => slots['full-dialogue']?.(payload) }
      : {}),
  };
  return Object.keys(mapped).length ? mapped : undefined;
});
const editRenderer = computed(
  () =>
    (slots['message-edit']
      ? (payload: unknown) => slots['message-edit']?.({ value: payload })
      : props.messageEditRender) as ((properties: unknown) => VNodeChild) | undefined,
);
const hintRenderer = computed(() =>
  slots.hint
    ? (payload: { content: string; index: number; onHintClick: () => void }) =>
        slots.hint?.(payload)
    : props.renderHintBox,
);

function roleFor(message: Message): Metadata | undefined {
  const role = props.roleConfig[message.role];
  return role instanceof Map ? role.get(message.name ?? '') : role;
}
function notifyChats(next: Message[]): void {
  emit('update:chats', next);
  emit('chats-change', next);
}
function setSelected(checked: boolean, id: string): void {
  const next = new Set(selectedIds.value);
  if (checked) next.add(id);
  else next.delete(id);
  selectedIds.value = next;
  emit('select', [...next]);
}
function selectAll(): void {
  selectedIds.value = new Set(props.chats.map((message) => message.id));
  emit('select', [...selectedIds.value]);
}
function deselectAll(): void {
  selectedIds.value = new Set();
  emit('select', []);
}
function updateMessage(message: Message, update: Partial<Message>): Message[] {
  return props.chats.map((item) => (item.id === message.id ? { ...item, ...update } : item));
}
function like(message: Message): void {
  emit('message-good-feedback', message);
  notifyChats(updateMessage(message, { like: !message.like, dislike: false }));
}
function dislike(message: Message): void {
  emit('message-bad-feedback', message);
  notifyChats(updateMessage(message, { like: false, dislike: !message.dislike }));
}
function reset(message: Message): void {
  const last = props.chats.at(-1);
  if (!last) return;
  const next = props.chats.slice(0, -1).concat({
    ...last,
    id: globalThis.crypto?.randomUUID?.() ?? `message-${Date.now()}`,
    status: 'in_progress',
    content: '',
    createdAt: Date.now(),
  });
  notifyChats(next);
  emit('message-reset', message);
}
function edit(message: Message): void {
  emit('message-edit', message);
  notifyChats(
    props.chats.map((item) => ({
      ...item,
      editing: item.id === message.id ? !message.editing : false,
    })),
  );
}
function remove(message: Message): void {
  emit('message-delete', message);
  notifyChats(props.chats.filter((item) => item.id !== message.id));
}
function hintClick(hint: string): void {
  notifyChats(
    props.chats.concat({
      id: globalThis.crypto?.randomUUID?.() ?? `message-${Date.now()}`,
      role: 'user',
      content: hint,
      createdAt: Date.now(),
    }),
  );
  emit('hint-click', hint);
}

function scrollTo(position: number, animation: boolean): void {
  const element = list.value;
  if (!element) return;
  cancelAnimationFrame(animationFrame);
  if (!animation) {
    element.scrollTop = position;
    return;
  }
  const from = element.scrollTop;
  const startedAt = performance.now();
  const frame = (time: number): void => {
    const progress = Math.min(1, (time - startedAt) / AI_CHAT_DIALOGUE_SCROLL_DURATION);
    const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
    element.scrollTop = from + (position - from) * eased;
    if (progress < 1) animationFrame = requestAnimationFrame(frame);
  };
  animationFrame = requestAnimationFrame(frame);
}
function scrollToBottom(animation = false): void {
  scrollTo(list.value?.scrollHeight ?? 0, animation);
}
function scrollToTop(animation = false): void {
  scrollTo(0, animation);
}
function onWheel(event: WheelEvent): void {
  if (event.currentTarget === list.value) wheelScroll.value = true;
}
function onScroll(): void {
  cancelAnimationFrame(scrollFrame);
  scrollFrame = requestAnimationFrame(() => {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const element = list.value;
      if (!element) return;
      backBottomVisible.value =
        element.scrollHeight - element.scrollTop - element.clientHeight >
        AI_CHAT_DIALOGUE_SCROLL_GAP;
    }, 100);
  });
}

watch(
  () => props.chats,
  async (current, previous) => {
    const old = previous ?? [];
    const currentLast = current.at(-1);
    const previousLast = old.at(-1);
    const shouldFollow =
      current.length > old.length ||
      (current.length === old.length &&
        current.length > 0 &&
        (currentLast?.status !== 'completed' || currentLast?.status !== previousLast?.status));
    if (current.length > old.length) wheelScroll.value = false;
    if (!wheelScroll.value && shouldFollow) {
      await nextTick();
      scrollToBottom(false);
    }
  },
);
watch(
  () => props.hints.length,
  async (length, previous = 0) => {
    if (!wheelScroll.value && length > previous) {
      await nextTick();
      scrollToBottom(false);
    }
  },
);
onMounted(async () => {
  await nextTick();
  scrollToBottom(false);
});
onBeforeUnmount(() => {
  cancelAnimationFrame(scrollFrame);
  cancelAnimationFrame(animationFrame);
  if (scrollTimer) clearTimeout(scrollTimer);
});

defineExpose({
  selectAll,
  deselectAll,
  scrollToBottom,
  scrollToTop,
  getContainerElement: () => list.value,
});
</script>

<template>
  <LocaleConsumer v-slot="{ localeData }" component-name="AIChatDialogue">
    <div v-bind="dataAttrs" :class="rootClasses" :style="rootStyle">
      <div
        ref="list"
        :class="[
          'semi-ai-chat-dialogue-list',
          { 'semi-ai-chat-dialogue-list-scroll-hidden': !wheelScroll },
        ]"
        @scroll="onScroll"
        @wheel="onWheel"
      >
        <AIChatDialogueItem
          v-for="(message, index) in props.chats"
          :key="message.id"
          :message="message"
          :role-info="roleFor(message)"
          :is-last-chat="index === props.chats.length - 1"
          :is-selected="selectedIds.has(message.id)"
          :selecting="effectiveSelecting"
          :align="align"
          :mode="mode"
          :escape-html="effectiveEscapeHtml"
          :disabled-file-item-click="effectiveDisabledFileItemClick"
          :show-reset="effectiveShowReset"
          :show-reference="effectiveShowReference"
          :markdown-render-props="props.markdownRenderProps"
          :message-edit-render="editRenderer"
          :render-dialogue-content-item="props.renderDialogueContentItem"
          :dialogue-render-config="renderConfig"
          :locale="localeData as AIChatDialogueLocale"
          @select="setSelected"
          @file-click="emit('file-click', $event)"
          @image-click="emit('image-click', $event)"
          @annotation-click="emit('annotation-click', $event)"
          @reference-click="emit('reference-click', $event)"
          @copy="emit('message-copy', $event)"
          @reset="reset"
          @share="emit('message-share', $event)"
          @edit="edit"
          @like="like"
          @dislike="dislike"
          @delete="remove"
        />
        <AIChatDialogueHint
          v-if="props.hints.length"
          :hints="props.hints"
          :class-name="props.hintCls"
          :style="props.hintStyle"
          :selecting="effectiveSelecting"
          :render-hint-box="hintRenderer"
          @select="hintClick"
        />
      </div>
      <span v-if="backBottomVisible" class="semi-ai-chat-dialogue-backBottom">
        <Button
          class="semi-ai-chat-dialogue-backBottom-button"
          type="tertiary"
          aria-label="scroll to bottom"
          @click="scrollToBottom(true)"
          ><template #icon><IconChevronDown size="extra-large" /></template
        ></Button>
      </span>
    </div>
  </LocaleConsumer>
</template>
