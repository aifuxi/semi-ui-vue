<script setup lang="ts">
import { Chat } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { useMockChat } from './useMockChat';
import '@aifuxi/semi-theme-default/chat.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import NodeContent from './NodeContent';
import '@aifuxi/semi-theme-default/avatar.css';
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
      content: 'Introduce Semi',
    },
    {
      role: 'assistant',
      id: '3',
      createAt: 1715676751919,
      content:
        'Semi Design is a design system designed, developed, and maintained by the front-end team at Douyin and the MED product design team.',
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
      ><template #chat-box="{ message, role, defaultNodes, className }"
        ><div :class="className">
          <div
            style="display: flex; flex-direction: column; gap: 4px"
            :style="{ alignItems: message?.role === 'user' ? 'end' : undefined }"
          >
            <span
              v-if="message?.role !== 'user'"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                padding: 5px 0;
                width: fit-content;
              "
              ><Avatar
                size="extra-small"
                shape="square"
                :src="typeof role?.avatar === 'string' ? role.avatar : undefined" /><NodeContent
                :content="defaultNodes?.title"
            /></span>
            <div style="width: fit-content"><NodeContent :content="defaultNodes?.content" /></div>
            <NodeContent :content="defaultNodes?.action" />
          </div></div></template></Chat
  ></ConfigProvider>
</template>
