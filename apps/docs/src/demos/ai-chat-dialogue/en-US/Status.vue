<script setup lang="ts">
import { ref } from 'vue';
import { AIChatDialogue, type Message } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/ai-chat-dialogue.css';
const roleConfig = {
  user: { name: 'User', avatar: '/demos/one.svg' },
  assistant: { name: 'Assistant', avatar: '/demos/two.svg' },
  system: { name: 'System', avatar: '/demos/two.svg' },
};

const initialMessages = [
  {
    role: 'assistant',
    id: '1',
    createAt: 1715676751919,
    content: 'Success',
  },
  {
    id: 'loading',
    role: 'assistant',
    status: 'in_progress',
  },
  {
    role: 'assistant',
    id: 'error',
    content: 'Error',
    status: 'failed',
  },
];
const chats = ref<Message[]>(initialMessages);
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatDialogue v-model:chats="chats" :role-config="roleConfig"></AIChatDialogue
  ></ConfigProvider>
</template>
