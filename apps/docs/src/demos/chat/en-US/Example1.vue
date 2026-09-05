<script setup lang="ts">
import { ref } from 'vue';
import { Chat, type ChatMessage } from '@aifuxi/semi-ui-vue/chat';
import '@aifuxi/semi-theme-default/chat.css';

const chats = ref<ChatMessage[]>([
  { id: 'welcome', role: 'assistant', content: 'Hello, how can I help?' },
]);
</script>

<template>
  <Chat
    v-model:chats="chats"
    :hints="['Introduce Semi']"
    :role-config="{ assistant: { name: 'Assistant' }, user: { name: 'User' } }"
    @message-send="(content: unknown, attachment: unknown) => console.log(content, attachment)"
  />
</template>
