<script setup lang="ts">
import { Chat } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import { useMockChat } from './useMockChat';
import '@aifuxi/semi-theme-default/chat.css';
import CustomActions from './CustomActions.vue';
const { chats, respond, roleConfig, uploadProps } = useMockChat(
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
      content: '介绍一下 semi design',
    },
    {
      role: 'assistant',
      id: '3',
      createAt: 1715676751919,
      content: 'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统',
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
      ><template #chat-box-action="detail"><CustomActions v-bind="detail" /></template></Chat
  ></ConfigProvider>
</template>
