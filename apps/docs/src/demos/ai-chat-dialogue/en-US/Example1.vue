<script setup lang="ts">
import { ref } from 'vue';
import { AIChatDialogue, type AIChatDialogueMessage } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import '@aifuxi/semi-theme-default/ai-chat-dialogue.css';

const chats = ref<AIChatDialogueMessage[]>([
  { id: '1', role: 'user', content: 'What is Semi?', status: 'completed' },
  { id: '2', role: 'assistant', content: 'Semi is a design system.', status: 'completed' },
]);
</script>

<template>
  <AIChatDialogue
    v-model:chats="chats"
    :role-config="{ user: { name: 'User' }, assistant: { name: 'Assistant' } }"
    :hints="['Learn more']"
  />
</template>
