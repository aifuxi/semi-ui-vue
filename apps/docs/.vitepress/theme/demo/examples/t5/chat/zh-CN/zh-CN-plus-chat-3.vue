<script setup lang="ts">
import { Chat } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import { useMockChat } from './useMockChat';
import '@aifuxi/semi-theme-default/chat.css';
const { chats, respond, roleConfig, uploadProps } = useMockChat(
  [
    {
      role: 'assistant',
      id: '1',
      createAt: 1715676751919,
      content: '请求成功',
    },
    {
      id: 'loading',
      role: 'assistant',
      status: 'loading',
    },
    {
      role: 'assistant',
      id: 'error',
      content: '请求错误',
      status: 'error',
    },
  ],
  '这是一条 mock 回复信息',
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
