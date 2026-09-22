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
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import NodeContent from './NodeContent';
const initialMessages = [
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
    content: '给一个 Semi Design 的 Button 组件的使用示例',
  },
  {
    role: 'assistant',
    id: '3',
    createAt: 1715676751919,
    content:
      '以下是 Vue Button 示例：\n```vue\n<script setup>\nimport { Button } from "@aifuxi/semi-ui-vue/button";\n\u003c/script>\n<template><Button>Click me</Button></template>\n```',
  },
];
const chats = ref<Message[]>(initialMessages);
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatDialogue v-model:chats="chats" :role-config="roleConfig"
      ><template #dialogue-title="{ role }"
        ><div class="semi-ai-chat-dialogue-title">My-{{ role?.name }}</div></template
      ><template #dialogue-avatar="{ role }"
        ><Avatar
          :src="typeof role?.avatar === 'string' ? role.avatar : undefined"
          size="extra-small"
          shape="square" /></template
      ><template #dialogue-action="{ className, defaultActionsObj }"
        ><div :class="className">
          <NodeContent :content="defaultActionsObj?.copyNode" /></div></template></AIChatDialogue
  ></ConfigProvider>
</template>
