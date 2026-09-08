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
import { responseToMessage } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { RESPONSE_DATA } from './adapterData';
const chats = ref<Message[]>([responseToMessage(RESPONSE_DATA)]);
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatDialogue v-model:chats="chats" :role-config="roleConfig"></AIChatDialogue
  ></ConfigProvider>
</template>
