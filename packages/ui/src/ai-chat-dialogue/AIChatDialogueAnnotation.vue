<script setup lang="ts">
import { IconChevronRight } from '@aifuxi/semi-icons-vue';
import { computed } from 'vue';

import { Avatar } from '../avatar';
import type { AIChatDialogueAnnotationEmits, AIChatDialogueAnnotationProps } from './types';

const props = withDefaults(defineProps<AIChatDialogueAnnotationProps>(), {
  maxCount: 15,
  annotationText: '篇资料',
});
const emit = defineEmits<AIChatDialogueAnnotationEmits>();
const visible = computed(() => props.annotation.slice(0, props.maxCount));
const rest = computed(() => Math.max(0, props.annotation.length - visible.value.length));

function activate(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    emit('click', props.annotation);
  }
}
</script>

<template>
  <div
    role="button"
    tabindex="0"
    class="semi-ai-chat-dialogue-annotation-wrapper"
    @click="emit('click', props.annotation)"
    @keydown="activate"
  >
    <div class="semi-ai-chat-dialogue-annotation-content">
      <span class="semi-avatar-group">
        <Avatar
          v-for="(item, index) in visible"
          :key="index"
          class="semi-ai-chat-dialogue-annotation-content-logo"
          size="extra-extra-small"
          v-bind="typeof item.logo === 'string' ? { src: item.logo } : {}"
          :alt="typeof item.title === 'string' ? item.title : ''"
        />
        <Avatar
          v-if="rest"
          class="semi-ai-chat-dialogue-annotation-content-logo-renderMore"
          size="extra-extra-small"
          alt="more"
          >+{{ rest }}</Avatar
        >
      </span>
      <div class="semi-ai-chat-dialogue-annotation-content-description">
        {{ props.description ?? `${props.annotation.length} ${props.annotationText}` }}
      </div>
      <div class="semi-ai-chat-dialogue-annotation-content-icon"><IconChevronRight /></div>
    </div>
  </div>
</template>
