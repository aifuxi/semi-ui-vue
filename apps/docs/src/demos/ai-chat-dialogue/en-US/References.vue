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
    id: '1',
    role: 'user',
    content: 'This message is an example for the References demo',
    references: [
      {
        id: '1',
        type: 'text',
        content:
          'Sample text. This is a long paragraph of text repeated for demonstration purposes to show truncation and layout behavior in the reference area.',
      },
      {
        id: '2',
        name: 'Feishu Doc.docx',
      },
      {
        id: '3',
        name: 'Music.mp4',
      },
      {
        id: '4',
        name: 'Image.jpeg',
        url: '/demos/photo.svg',
      },
      {
        id: '5',
        name: 'code.json',
      },
    ],
  },
];
const chats = ref<Message[]>(initialMessages);
const lastEvent = ref('');
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatDialogue
      v-model:chats="chats"
      :role-config="roleConfig"
      show-reference
      @reference-click="lastEvent = 'reference'"
    ></AIChatDialogue
    ><output>{{ lastEvent }}</output></ConfigProvider
  >
</template>
