<script setup lang="ts">
import type { VNodeChild } from 'vue';

import { Divider } from '../divider';
import ChatBox from './ChatBox.vue';
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
  chats: ChatMessage[];
  align: 'leftRight' | 'leftAlign';
  mode: ChatMode;
  roleConfig?: ChatRoleConfig | undefined;
  renderConfig?: ChatBoxRenderConfig | undefined;
  renderDivider?: ((message?: ChatMessage) => VNodeChild) | undefined;
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
</script>

<template>
  <template v-for="(message, index) in props.chats" :key="message.id ?? index">
    <ChatNodeRenderer
      v-if="message.role === 'divider' && props.renderDivider"
      :content="props.renderDivider(message)"
    />
    <Divider v-else-if="message.role === 'divider'" class="semi-chat-divider">
      {{ props.locale?.clearContext ?? 'Context cleared' }}
    </Divider>
    <ChatBox
      v-else
      :message="message"
      v-bind="index ? { previousMessage: props.chats[index - 1] } : {}"
      :last-chat="index === props.chats.length - 1"
      :align="props.align"
      :mode="props.mode"
      :role-config="props.roleConfig"
      :render-config="props.renderConfig"
      :custom-mark-down-components="props.customMarkDownComponents"
      :markdown-render-props="props.markdownRenderProps"
      :escape-html="props.escapeHtml"
      :locale="props.locale"
      @copy="emit('copy', $event)"
      @like="emit('like', $event)"
      @dislike="emit('dislike', $event)"
      @reset="emit('reset', $event)"
      @delete="emit('delete', $event)"
    />
  </template>
</template>
