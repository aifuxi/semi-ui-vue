<script setup lang="ts">
import { Chat } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
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
        'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统，你可以向我提问任何关于 Semi 的问题。',
    },
  ],
  '这是一条 mock 回复信息',
);
const hints = ref<string[]>([
  '告诉我更多',
  'Semi Design 的组件有哪些？',
  '我能够通过 DSM 定制自己的主题吗？',
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
