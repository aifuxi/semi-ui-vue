<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { AIChatDialogue, type AIChatDialogueMessage } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
const labels = computed(() =>
  props.locale === 'zh-CN'
    ? {
        assistant: '助手',
        user: '用户',
        question: '请介绍 Semi',
        answer: 'Semi 是面向现代应用的设计系统。',
        detail: '支持主题、国际化与无障碍能力。',
        hint: '继续了解',
      }
    : {
        assistant: 'Assistant',
        user: 'User',
        question: 'Introduce Semi',
        answer: 'Semi is a design system for modern applications.',
        detail: 'It supports theming, i18n, and accessibility.',
        hint: 'Learn more',
      },
);
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': {
    code: 'zh-CN',
    AIChatDialogue: {
      delete: '删除',
      deleteConfirm: '确认要删除吗？',
      deleteContent: '删除后将无法恢复！',
      copySuccess: '复制成功',
      loading: '请稍候...',
      reasoning: { completed: '已思考完成', thinking: '正在思考中...' },
      annotationText: '篇资料',
    },
  },
  'en-US': {
    code: 'en-US',
    AIChatDialogue: {
      delete: 'Delete',
      deleteConfirm: 'Delete this message?',
      deleteContent: 'This cannot be undone.',
      copySuccess: 'Copied',
      loading: 'Loading...',
      reasoning: { completed: 'Reasoning completed', thinking: 'Thinking...' },
      annotationText: 'sources',
    },
  },
};
const chats = ref<AIChatDialogueMessage[]>([
  { id: 'assistant-1', role: 'assistant', content: labels.value.answer, status: 'completed' },
  { id: 'user-1', role: 'user', content: labels.value.question, status: 'completed' },
  { id: 'assistant-2', role: 'assistant', content: labels.value.detail, status: 'completed' },
]);
const dialogueRenderConfig = {
  renderDialogueContent: ({
    message,
    className,
  }: {
    message?: AIChatDialogueMessage;
    className?: string;
  }) => h('div', { class: className }, String(message?.content ?? '')),
};
</script>

<template>
  <ConfigProvider :direction="props.direction" :locale="localeMap[props.locale]">
    <div class="ai-chat-dialogue-scenario" data-testid="ai-chat-dialogue-vue">
      <AIChatDialogue
        v-model:chats="chats"
        :hints="[labels.hint]"
        :style="{
          height: '430px',
          width: '100%',
          border: '1px solid var(--semi-color-border)',
          borderRadius: '16px',
        }"
        :role-config="{
          assistant: { name: labels.assistant },
          user: { name: labels.user },
        }"
        :dialogue-render-config="dialogueRenderConfig"
      />
    </div>
  </ConfigProvider>
</template>
