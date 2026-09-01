<script setup lang="ts">
import { computed, h, type VNodeChild } from 'vue';

import { Avatar } from '../avatar';
import ChatAttachment from './ChatAttachment.vue';
import ChatBoxAction from './ChatBoxAction.vue';
import ChatMarkdownContent from './ChatMarkdownContent';
import ChatNodeRenderer from './ChatNodeRenderer';
import type {
  ChatBoxRenderConfig,
  ChatLocale,
  ChatMarkdownRenderProps,
  ChatMessage,
  ChatMode,
  ChatRoleConfig,
} from './types';

const props = defineProps<{
  message: ChatMessage;
  previousMessage?: ChatMessage | undefined;
  lastChat: boolean;
  align: 'leftRight' | 'leftAlign';
  mode: ChatMode;
  roleConfig?: ChatRoleConfig | undefined;
  renderConfig?: ChatBoxRenderConfig | undefined;
  customMarkDownComponents?: Record<string, unknown> | undefined;
  markdownRenderProps?: ChatMarkdownRenderProps | undefined;
  escapeHtml: boolean;
  locale?: ChatLocale | undefined;
}>();
const emit = defineEmits<{
  copy: [message: ChatMessage];
  like: [message: ChatMessage];
  dislike: [message: ChatMessage];
  reset: [message: ChatMessage];
  delete: [message: ChatMessage];
}>();
const role = computed(() => props.roleConfig?.[props.message.role ?? ''] ?? {});
const continueSend = computed(() => props.message.role === props.previousMessage?.role);
const className = computed(() =>
  [
    'semi-chat-chatBox',
    props.message.role === 'user' && props.align === 'leftRight'
      ? 'semi-chat-chatBox-right'
      : undefined,
  ]
    .filter(Boolean)
    .join(' '),
);

const avatarDefault = computed<VNodeChild>(() =>
  h(
    Avatar as never,
    {
      class: [
        'semi-chat-chatBox-avatar',
        continueSend.value ? 'semi-chat-chatBox-avatar-hidden' : undefined,
      ],
      src: typeof role.value.avatar === 'string' ? role.value.avatar : undefined,
      color: (role.value.color ?? 'grey') as never,
      size: 'extra-small',
    },
    () => (typeof role.value.avatar === 'string' ? undefined : role.value.avatar),
  ),
);
const avatarNode = computed(
  () =>
    props.renderConfig?.renderChatBoxAvatar?.({
      message: props.message,
      role: role.value,
      defaultAvatar: avatarDefault.value,
    }) ?? avatarDefault.value,
);
const titleDefault = computed(() =>
  h('span', { class: 'semi-chat-chatBox-title' }, role.value.name),
);
const titleNode = computed(
  () =>
    props.renderConfig?.renderChatBoxTitle?.({
      message: props.message,
      role: role.value,
      defaultTitle: titleDefault.value,
    }) ?? titleDefault.value,
);
const contentClass = computed(() => {
  const bubble =
    props.mode === 'bubble' || (props.mode === 'userBubble' && props.message.role === 'user');
  return [
    'semi-chat-chatBox-content',
    bubble ? `semi-chat-chatBox-content-${props.mode}` : undefined,
    bubble && props.message.role === 'user' ? 'semi-chat-chatBox-content-user' : undefined,
    bubble && props.message.status === 'error' ? 'semi-chat-chatBox-content-error' : undefined,
  ]
    .filter(Boolean)
    .join(' ');
});
const defaultContent = computed<VNodeChild>(() => {
  if (props.message.status === 'loading') {
    return h('span', { class: 'semi-chat-chatBox-content-loading' }, [
      h('span', { class: 'semi-chat-chatBox-content-loading-item' }),
    ]);
  }
  const content = props.message.content;
  if (typeof content === 'string') {
    return h(ChatMarkdownContent, {
      raw: content,
      components: props.customMarkDownComponents ?? {},
      options: props.markdownRenderProps ?? {},
    });
  }
  if (Array.isArray(content)) {
    return content.map((item, index) => {
      if (item.type === 'text')
        return h(ChatMarkdownContent, {
          key: index,
          raw: item.text ?? '',
          components: props.customMarkDownComponents ?? {},
          options: props.markdownRenderProps ?? {},
        });
      if (item.type === 'image_url')
        return h('img', {
          key: index,
          class: 'semi-chat-attachment-img',
          src: item.image_url.url,
          alt: '',
          width: 50,
          height: 50,
        });
      return h(ChatAttachment, {
        key: index,
        file: { ...item.file_url, uid: `${props.message.id}-${index}`, status: 'success' },
      });
    });
  }
  return undefined;
});
const contentWrapper = computed(() =>
  h('div', { class: contentClass.value }, [defaultContent.value]),
);
const contentNode = computed(
  () =>
    props.renderConfig?.renderChatBoxContent?.({
      message: props.message,
      role: role.value,
      defaultContent: defaultContent.value,
      className: contentClass.value,
    }) ?? contentWrapper.value,
);
const defaultBox = computed(() =>
  h('div', { class: className.value }, [
    avatarNode.value,
    h('div', { class: 'semi-chat-chatBox-wrap' }, [
      continueSend.value ? undefined : titleNode.value,
      contentNode.value,
      h(ChatBoxAction as never, {
        message: props.message,
        lastChat: props.lastChat,
        locale: props.locale,
        renderAction: props.renderConfig?.renderChatBoxAction,
        onCopy: (message: ChatMessage) => emit('copy', message),
        onLike: (message: ChatMessage) => emit('like', message),
        onDislike: (message: ChatMessage) => emit('dislike', message),
        onReset: (message: ChatMessage) => emit('reset', message),
        onDelete: (message: ChatMessage) => emit('delete', message),
      }),
    ]),
  ]),
);
const output = computed(
  () =>
    props.renderConfig?.renderFullChatBox?.({
      message: props.message,
      role: role.value,
      className: className.value,
      defaultNodes: {
        avatar: avatarNode.value,
        title: titleNode.value,
        content: contentNode.value,
      },
    }) ?? defaultBox.value,
);
</script>

<template><ChatNodeRenderer :content="output" /></template>
