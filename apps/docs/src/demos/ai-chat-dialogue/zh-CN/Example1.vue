<script setup lang="ts">
import { ref } from 'vue';
import { AIChatDialogue, type AIChatDialogueMessage } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import '@aifuxi/semi-theme-default/ai-chat-dialogue.css';

const chats = ref<AIChatDialogueMessage[]>([
  { id: '1', role: 'user', content: '什么是 Semi？', status: 'completed' },
  { id: '2', role: 'assistant', content: 'Semi 是现代应用设计系统。', status: 'completed' },
]);
</script>

<template>
  <AIChatDialogue
    v-model:chats="chats"
    :role-config="{ user: { name: '用户' }, assistant: { name: '助手' } }"
    :hints="['继续了解']"
    @hint-click="console.log"
  />
</template>
