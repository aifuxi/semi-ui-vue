<script setup lang="ts">
import { IconAISearchLevel2, IconChevronDown, IconChevronUp } from '@aifuxi/semi-icons-vue';
import { computed, ref, watch } from 'vue';

import { Collapsible } from '../collapsible';
import { MarkdownRender } from '../markdown-render';
import type { AIChatDialogueReasoningProps } from './types';

const props = defineProps<AIChatDialogueReasoningProps>();
const isOpen = ref(props.status !== 'completed');
watch(
  () => props.status,
  (status, previous) => {
    if (previous !== status && status !== 'completed') isOpen.value = true;
  },
);
const raw = computed(() =>
  (props.summary?.length ? props.summary : (props.content ?? []))
    .map((item) => item.text ?? '')
    .join('\n'),
);
function toggle(): void {
  isOpen.value = !isOpen.value;
}
function activate(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggle();
  }
}
</script>

<template>
  <div
    role="button"
    tabindex="0"
    class="semi-ai-chat-dialogue-reasoning-wrapper"
    @click="toggle"
    @keydown="activate"
  >
    <div class="semi-ai-chat-dialogue-reasoning-header">
      <div class="semi-ai-chat-dialogue-reasoning-header-prefix"><IconAISearchLevel2 /></div>
      <div class="semi-ai-chat-dialogue-reasoning-header-title">
        {{
          props.status === 'completed'
            ? (props.completedText ?? '已思考完成')
            : (props.thinkingText ?? '正在思考中...')
        }}
      </div>
      <div class="semi-ai-chat-dialogue-reasoning-header-suffix">
        <IconChevronUp v-if="isOpen" />
        <IconChevronDown v-else />
      </div>
    </div>
    <Collapsible :is-open="isOpen">
      <div class="semi-ai-chat-dialogue-reasoning-content" @click.stop>
        <slot :raw="raw" :status="props.status">
          <MarkdownRender format="md" :raw="raw" v-bind="props.markdownRenderProps" />
        </slot>
      </div>
    </Collapsible>
  </div>
</template>
