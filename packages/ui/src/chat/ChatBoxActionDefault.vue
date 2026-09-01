<script setup lang="ts">
import {
  IconCopyStroked,
  IconDeleteStroked,
  IconLikeThumb,
  IconRedoStroked,
  IconThumbUpStroked,
} from '@aifuxi/semi-icons-vue';

import { Button } from '../button';
import { Popconfirm } from '../popconfirm';
import type { ChatLocale, ChatMessage } from './types';

const props = defineProps<{
  message: ChatMessage;
  lastChat: boolean;
  visible: boolean;
  className: string;
  locale?: ChatLocale;
}>();
const emit = defineEmits<{
  copy: [];
  like: [];
  dislike: [];
  reset: [];
  showDelete: [];
  hideDelete: [];
  delete: [];
}>();
const complete = () => (props.message.status ?? 'complete') === 'complete';
const showFeedback = () => props.message.role !== 'user' && complete();
const showReset = () => props.lastChat && props.message.role === 'assistant';
</script>

<template>
  <div :class="props.className">
    <Button
      v-if="complete()"
      class="semi-chat-chatBox-action-btn"
      theme="borderless"
      type="tertiary"
      :aria-label="props.locale?.copy ?? 'Copy'"
      @click="emit('copy')"
      ><template #icon><IconCopyStroked /></template
    ></Button>
    <Button
      v-if="showFeedback()"
      class="semi-chat-chatBox-action-btn"
      theme="borderless"
      type="tertiary"
      aria-label="like"
      @click="emit('like')"
      ><template #icon
        ><IconLikeThumb v-if="props.message.like" /><IconThumbUpStroked v-else /></template
    ></Button>
    <Button
      v-if="showFeedback()"
      class="semi-chat-chatBox-action-btn"
      theme="borderless"
      type="tertiary"
      aria-label="dislike"
      @click="emit('dislike')"
    >
      <template #icon>
        <IconLikeThumb v-if="props.message.dislike" class="semi-chat-chatBox-action-icon-flip" />
        <IconThumbUpStroked v-else class="semi-chat-chatBox-action-icon-flip" />
      </template>
    </Button>
    <Button
      v-if="showReset()"
      class="semi-chat-chatBox-action-btn"
      theme="borderless"
      type="tertiary"
      aria-label="reset"
      @click="emit('reset')"
      ><template #icon><IconRedoStroked class="semi-chat-chatBox-action-icon-redo" /></template
    ></Button>
    <Popconfirm
      trigger="custom"
      position="top"
      :visible="props.visible"
      :title="props.locale?.deleteConfirm ?? 'Delete this message?'"
      @confirm="emit('delete')"
      @cancel="emit('hideDelete')"
      @click-outside="emit('hideDelete')"
      @esc-keydown="emit('hideDelete')"
    >
      <span class="semi-chat-chatBox-action-delete-wrap">
        <Button
          class="semi-chat-chatBox-action-btn"
          theme="borderless"
          type="tertiary"
          aria-label="delete"
          @click="emit('showDelete')"
          ><template #icon><IconDeleteStroked /></template
        ></Button>
      </span>
    </Popconfirm>
  </div>
</template>
