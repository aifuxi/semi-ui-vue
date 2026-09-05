<script setup lang="ts">
import { ref } from 'vue';
import { Chat, type ChatMessage } from '@aifuxi/semi-ui-vue/chat';
import '@aifuxi/semi-theme-default/chat.css';

const chats = ref<ChatMessage[]>([
  { id: 'welcome', role: 'assistant', content: '你好，我能帮你做什么？' },
]);
</script>

<template>
  <Chat
    v-model:chats="chats"
    :hints="['介绍一下 Semi']"
    :role-config="{ assistant: { name: '助手' }, user: { name: '用户' } }"
    @message-send="(content: unknown, attachment: unknown) => console.log(content, attachment)"
  />
</template>
