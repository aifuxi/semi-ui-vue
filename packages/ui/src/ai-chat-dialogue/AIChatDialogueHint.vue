<script setup lang="ts">
import type { CSSProperties, VNodeChild } from 'vue';

import AIChatDialogueNodeRenderer from './AIChatDialogueNodeRenderer';

const props = defineProps<{
  hints: string[];
  className?: string | undefined;
  style?: CSSProperties | undefined;
  selecting?: boolean | undefined;
  renderHintBox?:
    | ((properties: { content: string; index: number; onHintClick: () => void }) => VNodeChild)
    | undefined;
}>();
const emit = defineEmits<{ select: [hint: string] }>();
function activate(event: KeyboardEvent, hint: string): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    emit('select', hint);
  }
}
</script>

<template>
  <section
    :class="[
      'semi-ai-chat-dialogue-hints',
      props.className,
      { 'semi-ai-chat-dialogue-hints-selecting': props.selecting },
    ]"
    :style="props.style"
  >
    <template v-for="(hint, index) in props.hints" :key="index">
      <AIChatDialogueNodeRenderer
        v-if="props.renderHintBox"
        :content="
          props.renderHintBox({ content: hint, index, onHintClick: () => emit('select', hint) })
        "
      />
      <div
        v-else
        class="semi-ai-chat-dialogue-hint-item"
        role="button"
        tabindex="0"
        @click="emit('select', hint)"
        @keydown="activate($event, hint)"
      >
        <span class="semi-ai-chat-dialogue-hint-content">{{ hint }}</span>
      </div>
    </template>
  </section>
</template>
