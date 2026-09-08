<script setup lang="ts">
import { Chat } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { useMockChat } from './useMockChat';
import '@aifuxi/semi-theme-default/chat.css';
const { chats, respond, roleConfig, uploadProps } = useMockChat(
  [
    {
      role: 'assistant',
      id: '1',
      createAt: 1715676751919,
      content: 'Success response',
    },
    {
      id: 'loading',
      role: 'assistant',
      status: 'loading',
    },
    {
      role: 'assistant',
      id: 'error',
      content: 'Error response',
      status: 'error',
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
        height: '400px',
      }"
      @message-send="respond"
    ></Chat
  ></ConfigProvider>
</template>
