<script setup lang="ts">
import { IconArrowRight } from '@aifuxi/semi-icons-vue';
import type { CSSProperties, VNodeChild } from 'vue';

import ChatNodeRenderer from './ChatNodeRenderer';

const props = defineProps<{
  hints?: string[] | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  renderHint?:
    | ((props: { content: string; index: number; onHintClick: () => void }) => VNodeChild)
    | undefined;
}>();
const emit = defineEmits<{ select: [hint: string] }>();
</script>

<template>
  <div
    v-if="props.hints?.length"
    :class="['semi-chat-hints', props.className]"
    :style="props.style"
  >
    <template v-for="(hint, index) in props.hints" :key="`${index}-${hint}`">
      <ChatNodeRenderer
        v-if="props.renderHint"
        :content="
          props.renderHint({ content: hint, index, onHintClick: () => emit('select', hint) })
        "
      />
      <button v-else type="button" class="semi-chat-hint-item" @click="emit('select', hint)">
        <span class="semi-chat-hint-content">{{ hint }}</span>
        <IconArrowRight class="semi-chat-hint-icon" />
      </button>
    </template>
  </div>
</template>
