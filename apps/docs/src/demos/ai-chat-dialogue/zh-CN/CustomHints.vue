<script setup lang="ts">
import { ref } from 'vue';
import { AIChatDialogue, type Message } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/ai-chat-dialogue.css';
const roleConfig = {
  user: { name: 'User', avatar: '/demos/one.svg' },
  assistant: { name: 'Assistant', avatar: '/demos/two.svg' },
  system: { name: 'System', avatar: '/demos/two.svg' },
};
import { IconArrowRight } from '@aifuxi/semi-icons-vue';
const initialMessages = [
  {
    role: 'assistant',
    id: '1',
    createAt: 1715676751919,
    content:
      'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统，你可以向我提问任何关于 Semi 的问题。',
  },
];
const chats = ref<Message[]>(initialMessages);
const hints = ref([
  'Semi 组件库有哪些常用组件？',
  '能否展示一个使用 Semi 组件库构建的页面示例？',
  'Semi 组件库有官方文档吗？',
]);
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatDialogue
      v-model:chats="chats"
      :role-config="roleConfig"
      :hints="hints"
      @hint-click="hints = []"
      ><template #hint="{ content, onHintClick }"
        ><button
          class="custom-hint"
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
          {{ content
          }}<IconArrowRight style="margin-left: 10px" /></button></template></AIChatDialogue
  ></ConfigProvider>
</template>
