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
    content:
      'Semi Design is a design system designed, developed, and maintained by the TikTok front-end team and the MED product design team. You can ask me any questions about Semi.',
  },
];
const chats = ref<Message[]>(initialMessages);
const hints = ref([
  'What are the commonly used components in the Semi component library?',
  'Can you show an example of a page built using the Semi component library?',
  'Is there any official documentation for the Semi component library?',
]);
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatDialogue
      v-model:chats="chats"
      :role-config="roleConfig"
      :hints="hints"
      @hint-click="hints = []"
    ></AIChatDialogue
  ></ConfigProvider>
</template>
