<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { Chat, ConfigProvider, type ChatMessage, type SemiLocale } from '@aifuxi/semi-ui-vue';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': {
    code: 'zh-CN',
    Chat: {
      deleteConfirm: '确认删除该会话吗？',
      clearContext: '上下文已清除',
      copySuccess: '复制成功',
      stop: '停止',
      copy: '复制',
      copied: '复制成功',
      dropAreaText: '将文件放到这里',
    },
  },
  'en-US': {
    code: 'en-US',
    Chat: {
      deleteConfirm: 'Delete this message?',
      clearContext: 'Context cleared',
      copySuccess: 'Copied',
      stop: 'Stop',
      copy: 'Copy',
      copied: 'Copied',
      dropAreaText: 'Put the file here',
    },
  },
};
const labels = computed(() =>
  props.locale === 'zh-CN'
    ? {
        assistant: '助手',
        user: '用户',
        question: '请介绍 Semi',
        answer: 'Semi 是面向现代应用的设计系统。',
        hint: '继续了解',
      }
    : {
        assistant: 'Assistant',
        user: 'User',
        question: 'Introduce Semi',
        answer: 'Semi is a design system for modern applications.',
        hint: 'Learn more',
      },
);
const chats = ref<ChatMessage[]>([
  { id: 'assistant-1', role: 'assistant', content: labels.value.answer, status: 'complete' },
  { id: 'user-1', role: 'user', content: labels.value.question, status: 'complete' },
  {
    id: 'assistant-2',
    role: 'assistant',
    content: '**Ready** for the next question.',
    status: 'complete',
  },
]);
const chatBoxRenderConfig = {
  renderChatBoxContent: ({ message, className }: { message?: ChatMessage; className?: string }) =>
    h('div', { class: className }, String(message?.content ?? '')),
};
const renderHintBox = ({ content, onHintClick }: { content: string; onHintClick: () => void }) =>
  h('div', { class: 'semi-chat-hint-item', onClick: onHintClick }, [
    h('span', { class: 'semi-chat-hint-content' }, content),
    h('span', { class: 'semi-chat-hint-icon' }, '→'),
  ]);
</script>

<template>
  <ConfigProvider :direction="props.direction" :locale="localeMap[props.locale]">
    <div class="chat-scenario" data-testid="chat-vue">
      <Chat
        v-model:chats="chats"
        :hints="[labels.hint]"
        :enable-upload="false"
        :style="{
          height: '430px',
          width: '100%',
          border: '1px solid var(--semi-color-border)',
          borderRadius: '16px',
        }"
        :role-config="{ assistant: { name: labels.assistant }, user: { name: labels.user } }"
        :chat-box-render-config="chatBoxRenderConfig"
        :render-hint-box="renderHintBox"
      />
    </div>
  </ConfigProvider>
</template>
