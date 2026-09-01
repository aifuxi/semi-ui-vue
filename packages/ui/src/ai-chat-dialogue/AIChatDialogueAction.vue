<script setup lang="ts">
import {
  IconCopyStroked,
  IconDeleteStroked,
  IconEditStroked,
  IconLikeThumb,
  IconMoreStroked,
  IconRedoStroked,
  IconShareStroked,
  IconThumbUpStroked,
} from '@aifuxi/semi-icons-vue';
import { computed, h, type Component, type VNodeChild } from 'vue';

import { Button } from '../button';
import { Dropdown, DropdownItem, DropdownMenu } from '../dropdown';
import { Modal } from '../modal';
import { Toast } from '../toast';
import AIChatDialogueNodeRenderer from './AIChatDialogueNodeRenderer';
import type { DefaultActionNodeObj, Message, RenderActionProps } from './types';

const props = defineProps<{
  message: Message;
  isLastChat?: boolean | undefined;
  showReset?: boolean | undefined;
  locale?:
    | {
        delete?: string;
        deleteConfirm?: string;
        deleteContent?: string;
        copySuccess?: string;
      }
    | undefined;
  customRenderFunc?: ((properties: RenderActionProps) => VNodeChild) | undefined;
}>();
const emit = defineEmits<{
  copy: [message: Message];
  reset: [message: Message];
  share: [message: Message];
  edit: [message: Message];
  like: [message: Message];
  dislike: [message: Message];
  delete: [message: Message];
}>();

function textContent(): string {
  if (typeof props.message.content === 'string') return props.message.content;
  if (!Array.isArray(props.message.content)) return props.message.output_text ?? '';
  return props.message.content
    .flatMap((item) => {
      const content = (item as { content?: unknown }).content;
      if (typeof content === 'string') return content;
      if (!Array.isArray(content)) return [];
      return (content as Array<{ text?: string; refusal?: string }>).map(
        (inner) => inner.text ?? inner.refusal ?? '',
      );
    })
    .join('');
}

async function copyMessage(): Promise<void> {
  emit('copy', props.message);
  if (typeof navigator !== 'undefined') await navigator.clipboard?.writeText(textContent());
  if (typeof document !== 'undefined')
    Toast.success({ content: props.locale?.copySuccess ?? '复制成功' });
}

function confirmDelete(): void {
  if (typeof document === 'undefined') return;
  Modal.warning({
    title: props.locale?.deleteConfirm ?? '确认要删除吗？',
    content: props.locale?.deleteContent ?? '删除后将无法恢复！',
    onOk: () => emit('delete', props.message),
  });
}

function iconButton(
  key: string,
  icon: Component,
  label: string,
  action: () => void,
  compact = false,
  extraClass?: string,
): VNodeChild {
  return h(
    Button,
    {
      key,
      theme: 'borderless',
      type: 'tertiary',
      class: [compact ? 'semi-ai-chat-dialogue-action-btn' : undefined, extraClass],
      'aria-label': label,
      onClick: action,
    },
    { icon: () => h(icon) },
  );
}

const completed = computed(() => (props.message.status ?? 'completed') === 'completed');
const finished = computed(
  () => props.message.status !== 'in_progress' && props.message.status !== 'incomplete',
);
const showFeedback = computed(() => props.message.role !== 'user' && completed.value);
const showResetAction = computed(
  () => props.showReset !== false && props.isLastChat && props.message.role === 'assistant',
);
const className = computed(() =>
  [
    'semi-ai-chat-dialogue-action',
    showResetAction.value ? 'semi-ai-chat-dialogue-action-show' : undefined,
    !finished.value ? 'semi-ai-chat-dialogue-action-hidden' : undefined,
  ]
    .filter(Boolean)
    .join(' '),
);

const actionNodes = computed(() => {
  const nodes: VNodeChild[] = [];
  const object: DefaultActionNodeObj = {};
  if (completed.value) {
    object.copyNode = iconButton(
      'copy',
      IconCopyStroked,
      'copy message',
      () => void copyMessage(),
      true,
    );
    nodes.push(object.copyNode);
  }
  if (showResetAction.value) {
    object.resetNode = iconButton(
      'reset',
      IconRedoStroked,
      'reset message',
      () => emit('reset', props.message),
      true,
    );
    nodes.push(object.resetNode);
  }
  if (!props.customRenderFunc && completed.value)
    nodes.push(
      iconButton('share', IconShareStroked, 'share message', () => emit('share', props.message)),
    );
  if (!props.customRenderFunc && props.message.role === 'user')
    nodes.push(
      iconButton('edit', IconEditStroked, 'edit message', () => emit('edit', props.message)),
    );
  if (showFeedback.value) {
    object.likeNode = iconButton(
      'like',
      props.message.like ? IconLikeThumb : IconThumbUpStroked,
      'good feedback',
      () => emit('like', props.message),
      true,
    );
    object.dislikeNode = iconButton(
      'dislike',
      props.message.dislike ? IconLikeThumb : IconThumbUpStroked,
      'bad feedback',
      () => emit('dislike', props.message),
      true,
      props.message.dislike
        ? 'semi-ai-chat-dialogue-action-icon-flip'
        : 'semi-chat-chatBox-action-icon-flip',
    );
    nodes.push(object.likeNode, object.dislikeNode);
  }
  object.moreNode = h(
    Dropdown,
    {
      trigger: 'click',
      position: 'bottomLeft',
      contentClassName: 'semi-ai-chat-dialogue-action-dropdown',
    },
    {
      default: () =>
        h('span', [iconButton('more', IconMoreStroked, 'more actions', () => undefined)]),
      content: () =>
        h(DropdownMenu, null, () =>
          h(DropdownItem, { type: 'danger', onClick: confirmDelete }, () => [
            h(IconDeleteStroked),
            ` ${props.locale?.delete ?? '删除'}`,
          ]),
        ),
    },
  );
  nodes.push(object.moreNode);
  return { nodes, object };
});

const output = computed<VNodeChild>(() =>
  props.customRenderFunc
    ? props.customRenderFunc({
        message: props.message,
        defaultActions: actionNodes.value.nodes,
        defaultActionsObj: actionNodes.value.object,
        className: className.value,
      })
    : h('div', { class: className.value }, actionNodes.value.nodes),
);
</script>

<template><AIChatDialogueNodeRenderer :content="output" /></template>
