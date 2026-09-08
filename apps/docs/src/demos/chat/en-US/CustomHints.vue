<script setup lang="ts">
import { Chat } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { useMockChat } from './useMockChat';
import '@aifuxi/semi-theme-default/chat.css';
import { ref } from 'vue';
import { IconArrowRight } from '@aifuxi/semi-icons-vue';
const { chats, respond, roleConfig, uploadProps } = useMockChat(
  [
    {
      role: 'assistant',
      id: '1',
      createAt: 1715676751919,
      content:
        'Semi Design is a design system designed, developed, and maintained by the front-end team at Douyin and the MED product design team.',
    },
  ],
  'This is a mock reply message',
);
const hints = ref<string[]>([
  'Tell me more',
  'What are the components of Semi Design?',
  'What are the addresses of Semi Design’s official website and github warehouse?',
]);
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
      :hints="hints"
      @message-send="
        () => {
          respond();
          hints = [];
        }
      "
      @hint-click="hints = []"
      @clear="hints = []"
      ><template #hint="{ content, onHintClick }"
        ><button
          style="
            border: 1px solid var(--semi-color-border);
            padding: 10px;
            border-radius: 10px;
            color: var(--semi-color-text-1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
            background: transparent;
          "
          @click="onHintClick"
        >
          {{ content }}<IconArrowRight style="margin-left: 10px" /></button></template></Chat
  ></ConfigProvider>
</template>
