<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { AIChatDialogue, type AIChatDialogueMessage } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Input } from '@aifuxi/semi-ui-vue/input';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
// 与 React 查询一致，默认 renderer 才能展示完整消息状态和选择态。
const query = new URLSearchParams(window.location.search);
const requestedMode = query.get('dialogueMode');
const reviewMode =
  requestedMode === 'noBubble' || requestedMode === 'userBubble' ? requestedMode : 'bubble';
const reviewAlign = query.get('dialogueAlign') === 'leftAlign' ? 'leftAlign' : 'leftRight';
const reviewStates = query.get('dialogueState') === 'matrix';
const reviewSelecting = query.get('dialogueSelecting') === 'true';
const reviewEditor = query.get('dialogueEditor') === 'true';
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
    Typography: { copy: '复制', copied: '复制成功', expand: '展开', collapse: '收起' },
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
    Typography: { copy: 'Copy', copied: 'Copied', expand: 'Expand', collapse: 'Collapse' },
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
  ...(reviewStates
    ? ['queued', 'in_progress', 'incomplete', 'failed', 'cancelled'].map((status) => ({
        id: `state-${status}`,
        role: 'assistant',
        content: status === 'queued' ? '' : `回答状态：${status}`,
        status,
      }))
    : []),
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
const editValue = ref(labels.value.question);
function finishEditing(save: boolean): void {
  chats.value = chats.value.map((message) =>
    message.editing
      ? { ...message, editing: false, ...(save ? { content: editValue.value } : {}) }
      : message,
  );
}
// 固定基线编辑态由公开 renderer 提供，使用同源 Input 与按钮复核内容容器。
const messageEditRender = () =>
  h('div', { style: { width: '100%', marginTop: '5px' } }, [
    h(Input, { value: editValue.value, onChange: (value: string) => (editValue.value = value) }),
    h('div', { style: { marginTop: '10px', display: 'flex', gap: '10px' } }, [
      h(Button, { onClick: () => finishEditing(true) }, () => '保存'),
      h(Button, { onClick: () => finishEditing(false) }, () => '取消'),
    ]),
  ]);
</script>

<template>
  <ConfigProvider :direction="props.direction" :locale="localeMap[props.locale]">
    <div class="ai-chat-dialogue-scenario" data-testid="ai-chat-dialogue-vue">
      <AIChatDialogue
        v-model:chats="chats"
        :mode="reviewMode"
        :align="reviewAlign"
        :selecting="reviewSelecting"
        :hints="[labels.hint]"
        :style="{
          height: reviewStates ? '1000px' : '430px',
          width: '100%',
          border: '1px solid var(--semi-color-border)',
          borderRadius: '16px',
        }"
        :role-config="{
          assistant: { name: labels.assistant },
          user: { name: labels.user },
        }"
        v-bind="{
          ...(reviewStates || reviewEditor ? {} : { dialogueRenderConfig }),
          ...(reviewEditor ? { messageEditRender } : {}),
        }"
      />
    </div>
  </ConfigProvider>
</template>
