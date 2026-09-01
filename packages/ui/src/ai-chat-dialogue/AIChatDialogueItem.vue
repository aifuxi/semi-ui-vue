<script setup lang="ts">
import { computed, h, type VNodeChild } from 'vue';

import { Avatar } from '../avatar';
import { Checkbox, type CheckboxChangeEvent } from '../checkbox';
import AIChatDialogueAction from './AIChatDialogueAction.vue';
import AIChatDialogueContent from './AIChatDialogueContent.vue';
import AIChatDialogueNodeRenderer from './AIChatDialogueNodeRenderer';
import type {
  Annotation,
  DialogueContentItemRendererMap,
  DialogueRenderConfig,
  InputFile,
  InputImage,
  MarkdownRenderProps,
  Message,
  Metadata,
  Reference,
} from './types';

const props = defineProps<{
  message: Message;
  roleInfo?: Metadata | undefined;
  isLastChat: boolean;
  isSelected: boolean;
  selecting: boolean;
  align: 'leftRight' | 'leftAlign';
  mode: 'bubble' | 'noBubble' | 'userBubble';
  escapeHtml: boolean;
  disabledFileItemClick: boolean;
  showReset: boolean;
  showReference: boolean;
  markdownRenderProps?: MarkdownRenderProps | undefined;
  messageEditRender?: ((properties: unknown) => VNodeChild) | undefined;
  renderDialogueContentItem?: DialogueContentItemRendererMap | undefined;
  dialogueRenderConfig?: DialogueRenderConfig | undefined;
  locale?:
    | {
        delete?: string;
        deleteConfirm?: string;
        deleteContent?: string;
        copySuccess?: string;
        loading?: string;
        annotationText?: string;
        reasoning?: { completed?: string; thinking?: string };
      }
    | undefined;
}>();
const emit = defineEmits<{
  select: [checked: boolean, id: string];
  fileClick: [file: InputFile];
  imageClick: [image: InputImage];
  annotationClick: [annotation: Annotation[]];
  referenceClick: [reference: Reference];
  copy: [message: Message];
  reset: [message: Message];
  share: [message: Message];
  edit: [message: Message];
  like: [message: Message];
  dislike: [message: Message];
  delete: [message: Message];
}>();

const containerClass = computed(() => [
  'semi-ai-chat-dialogue-container',
  props.message.role === 'user' && props.align === 'leftRight'
    ? 'semi-ai-chat-dialogue-container-right'
    : undefined,
]);
const avatarDefault = computed<VNodeChild>(() =>
  h(
    Avatar as never,
    {
      class: 'semi-ai-chat-dialogue-avatar',
      size: 'extra-small',
      src: typeof props.roleInfo?.avatar === 'string' ? props.roleInfo.avatar : undefined,
      color: (props.roleInfo?.color ?? 'grey') as never,
    },
    () => (typeof props.roleInfo?.avatar === 'string' ? undefined : props.roleInfo?.avatar),
  ),
);
const avatarNode = computed(
  () =>
    props.dialogueRenderConfig?.renderDialogueAvatar?.({
      role: props.roleInfo,
      message: props.message,
      defaultAvatar: avatarDefault.value,
    }) ?? avatarDefault.value,
);
const titleDefault = computed(() =>
  h('span', { class: 'semi-ai-chat-dialogue-title' }, props.roleInfo?.name),
);
const titleNode = computed(
  () =>
    props.dialogueRenderConfig?.renderDialogueTitle?.({
      role: props.roleInfo,
      message: props.message,
      defaultTitle: titleDefault.value,
    }) ?? titleDefault.value,
);
const contentNode = computed(() =>
  h(AIChatDialogueContent as never, {
    key: String(props.message.editing),
    message: props.message,
    roleInfo: props.roleInfo,
    mode: props.mode,
    escapeHtml: props.escapeHtml,
    editing: props.message.editing && props.message.role === 'user',
    disabledFileItemClick: props.disabledFileItemClick,
    showReference: props.showReference,
    markdownRenderProps: props.markdownRenderProps,
    messageEditRender: props.messageEditRender,
    renderDialogueContentItem: props.renderDialogueContentItem,
    customRenderFunc: props.dialogueRenderConfig?.renderDialogueContent,
    locale: props.locale,
    onFileClick: (file: InputFile) => emit('fileClick', file),
    onImageClick: (image: InputImage) => emit('imageClick', image),
    onAnnotationClick: (annotation: Annotation[]) => emit('annotationClick', annotation),
    onReferenceClick: (reference: Reference) => emit('referenceClick', reference),
  }),
);
const actionNode = computed(() =>
  h(AIChatDialogueAction as never, {
    message: props.message,
    isLastChat: props.isLastChat,
    showReset: props.showReset,
    locale: props.locale,
    customRenderFunc: props.dialogueRenderConfig?.renderDialogueAction,
    onCopy: (message: Message) => emit('copy', message),
    onReset: (message: Message) => emit('reset', message),
    onShare: (message: Message) => emit('share', message),
    onEdit: (message: Message) => emit('edit', message),
    onLike: (message: Message) => emit('like', message),
    onDislike: (message: Message) => emit('dislike', message),
    onDelete: (message: Message) => emit('delete', message),
  }),
);
const defaultContainer = computed(() =>
  h('div', { class: containerClass.value }, [
    avatarNode.value,
    h('div', { class: 'semi-ai-chat-dialogue-inner' }, [
      titleNode.value,
      contentNode.value,
      actionNode.value,
    ]),
  ]),
);
const output = computed(
  () =>
    props.dialogueRenderConfig?.renderFullDialogue?.({
      message: props.message,
      role: props.roleInfo,
      className: containerClass.value.filter(Boolean).join(' '),
      defaultNodes: {
        avatar: avatarNode.value,
        title: titleNode.value,
        content: contentNode.value,
        action: actionNode.value,
      },
    }) ?? defaultContainer.value,
);
function select(event: CheckboxChangeEvent): void {
  emit('select', event.target.checked, props.message.id);
}
</script>

<template>
  <div
    :class="[
      'semi-ai-chat-dialogue-wrapper',
      { 'semi-ai-chat-dialogue-wrapper-selected': props.selecting && props.isSelected },
    ]"
  >
    <div v-if="props.selecting" class="semi-ai-chat-dialogue-checkbox">
      <Checkbox :checked="props.isSelected" @change="select" />
    </div>
    <AIChatDialogueNodeRenderer :content="output" />
  </div>
</template>
