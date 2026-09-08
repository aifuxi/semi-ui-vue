<script setup lang="ts">
import { ref } from 'vue';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import { AIChatDialogue, type Message } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/ai-chat-dialogue.css';
const roleConfig = {
  user: {
    name: 'User',
    avatar: '/demos/one.svg',
  },
  assistant: {
    name: 'Assistant',
    avatar: '/demos/two.svg',
  },
  system: {
    name: 'System',
    avatar: '/demos/two.svg',
  },
};
const chats = ref<Message[]>([
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
    content: 'Give an example of using the Semi Design Button component',
  },
  {
    role: 'assistant',
    id: '3',
    createAt: 1715676751919,
    content:
      'Here is a Vue Button example:\n```vue\n<script setup>\nimport { Button } from "@aifuxi/semi-ui-vue/button";\n\u003c/script>\n<template><Button>Click me</Button></template>\n```',
  },
]);
const mode = ref<'bubble' | 'noBubble' | 'userBubble'>('bubble');
const align = ref<'leftRight' | 'leftAlign'>('leftRight');
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div style="display: flex; flex-direction: column; gap: 8px">
      <RadioGroup v-model="mode" type="button"
        ><Radio value="bubble">bubble</Radio><Radio value="noBubble">noBubble</Radio
        ><Radio value="userBubble">userBubble</Radio></RadioGroup
      ><RadioGroup v-model="align" type="button"
        ><Radio value="leftRight">leftRight</Radio
        ><Radio value="leftAlign">leftAlign</Radio></RadioGroup
      >
    </div>
    <div
      style="
        border: 1px solid var(--semi-color-border);
        border-radius: 12px;
        margin-top: 10px;
        padding: 20px;
      "
    >
      <AIChatDialogue
        :key="align + mode"
        v-model:chats="chats"
        :role-config="roleConfig"
        :mode="mode"
        :align="align"
      /></div
  ></ConfigProvider>
</template>
