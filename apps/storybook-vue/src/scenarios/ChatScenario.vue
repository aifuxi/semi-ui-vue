<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { Chat, type ChatMessage } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
// 与 React 基线同源查询，状态矩阵使用默认内容渲染，避免覆盖 loading/error 样式。
const query = new URLSearchParams(window.location.search);
const requestedMode = query.get('chatMode');
const reviewMode =
  requestedMode === 'noBubble' || requestedMode === 'userBubble' ? requestedMode : 'bubble';
const reviewAlign = query.get('chatAlign') === 'leftAlign' ? 'leftAlign' : 'leftRight';
// 仅状态矩阵显式禁用发送；普通场景保留 canSend 缺省的空输入判定。
const reviewStates = query.get('chatState') === 'matrix';
const reviewDefaultRender = reviewStates || query.get('reviewDefaultRender') === 'true';
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': {
    code: 'zh-CN',
    Typography: { copy: '复制', copied: '复制成功', expand: '展开', collapse: '收起' },
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
    Typography: { copy: 'Copy', copied: 'Copied', expand: 'Expand', collapse: 'Collapse' },
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
  ...(reviewStates
    ? (['loading', 'incomplete', 'error'] as const).map((status) => ({
        id: `state-${status}`,
        role: 'assistant',
        content: status === 'loading' ? '' : `回答状态：${status}`,
        status,
      }))
    : []),
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
        :mode="reviewMode"
        :align="reviewAlign"
        :show-stop-generate="reviewStates"
        :hints="[labels.hint]"
        :enable-upload="false"
        :style="{
          height: reviewStates ? '850px' : '430px',
          width: '100%',
          border: '1px solid var(--semi-color-border)',
          borderRadius: '16px',
        }"
        :role-config="{ assistant: { name: labels.assistant }, user: { name: labels.user } }"
        v-bind="{
          ...(reviewStates ? { canSend: false } : {}),
          ...(reviewDefaultRender ? {} : { chatBoxRenderConfig }),
        }"
        :render-hint-box="renderHintBox"
      />
    </div>
  </ConfigProvider>
</template>
