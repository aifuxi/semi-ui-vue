<script setup lang="ts">
import { IconChevronDown, IconChevronUp, IconStoryStroked } from '@aifuxi/semi-icons-vue';
import { ref, watch } from 'vue';

import { Collapsible } from '../collapsible';
import type { AIChatDialogueStepItem } from './types';

const props = defineProps<{ steps: AIChatDialogueStepItem[] }>();
const openIndexes = ref(new Set(props.steps.map((_, index) => index)));
watch(
  () => props.steps,
  (steps) => (openIndexes.value = new Set(steps.map((_, index) => index))),
);
function toggle(index: number): void {
  const next = new Set(openIndexes.value);
  if (next.has(index)) next.delete(index);
  else next.add(index);
  openIndexes.value = next;
}
function activate(event: KeyboardEvent, index: number): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggle(index);
  }
}
</script>

<template>
  <div class="semi-ai-chat-dialogue-step-wrapper">
    <template v-for="(item, index) in props.steps" :key="index">
      <div
        class="semi-ai-chat-dialogue-step"
        role="button"
        tabindex="0"
        @click="toggle(index)"
        @keydown="activate($event, index)"
      >
        <div class="semi-ai-chat-dialogue-step-prefix">
          <IconStoryStroked
            v-if="item.status === 'completed'"
            class="semi-ai-chat-dialogue-step-completed"
          />
          <span v-else class="semi-ai-chat-dialogue-content-loading">
            <span class="semi-ai-chat-dialogue-content-loading-item" />
            <span class="semi-ai-chat-dialogue-content-loading-item" />
            <span class="semi-ai-chat-dialogue-content-loading-item" />
          </span>
        </div>
        <div class="semi-ai-chat-dialogue-step-summary">{{ item.summary }}</div>
        <div v-if="item.actions?.length" class="semi-ai-chat-dialogue-step-suffix">
          <IconChevronUp v-if="openIndexes.has(index)" />
          <IconChevronDown v-else />
        </div>
      </div>
      <Collapsible :is-open="openIndexes.has(index)">
        <div class="semi-ai-chat-dialogue-step-panel">
          <div class="semi-ai-chat-dialogue-step-line" />
          <div class="semi-ai-chat-dialogue-step-action-wrapper">
            <div
              v-for="(action, actionIndex) in item.actions"
              :key="actionIndex"
              class="semi-ai-chat-dialogue-step-action"
            >
              <div class="semi-ai-chat-dialogue-step-action-summary">{{ action.summary }}</div>
              <div class="semi-ai-chat-dialogue-step-action-desc">{{ action.description }}</div>
            </div>
          </div>
        </div>
      </Collapsible>
    </template>
  </div>
</template>
