<script setup lang="ts">
import { Chat } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { useMockChat } from './useMockChat';
import '@aifuxi/semi-theme-default/chat.css';
const { chats, respond, roleConfig, uploadProps, regenerate } = useMockChat(
  [
    {
      role: 'system',
      id: '1',
      createAt: 1715676751919,
      content: "Hello, I'm your AI assistant.",
    },
    {
      role: 'user',
      id: '2',
      createAt: 1715676751919,
      content: 'Introduce semi design',
    },
    {
      role: 'assistant',
      id: '3',
      createAt: 1715676751919,
      content:
        'Semi Design is a design system designed, developed and maintained by the Douyin front-end team and MED product design team.',
    },
  ],
  'This is a mock response',
);
</script>
<template>
  <ConfigProvider :locale="locale"
    ><Chat
      v-model:chats="chats"
      :role-config="roleConfig"
      :upload-props="uploadProps"
      :style="{
        border: '1px solid var(--semi-color-border)',
        borderRadius: '16px',
        height: '550px',
      }"
      show-clear-context
      @message-send="respond"
      @message-reset="regenerate"
    ></Chat
  ></ConfigProvider>
</template>
