<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount } from 'vue';
import { Chat, type ChatMessage, type ChatAlign, type ChatMode } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import en_US from '@aifuxi/semi-ui-vue/locale/source/en_US';
import type { UploadCustomRequestArgs } from '@aifuxi/semi-ui-vue/upload';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import '@aifuxi/semi-theme-default/chat.css';
import '@aifuxi/semi-theme-default/markdown-render.css';
const chats = ref<ChatMessage[]>([
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
    content: 'Give an example of using Semi Design’s Button component',
  },
  {
    role: 'assistant',
    id: '3',
    createAt: 1715676751919,
    content:
      "The following is a Vue example:\n```vue\n<script setup>\nimport { Button } from '@aifuxi/semi-ui-vue/button';\n\u003c/script>\n<template><Button>Click me</Button></template>\n```\n",
  },
]);
const roleConfig = {
  user: { name: 'User', avatar: '/demos/one.svg' },
  assistant: { name: 'Assistant', avatar: '/demos/two.svg' },
  system: { name: 'System', avatar: '/demos/two.svg' },
};
let sequence = 0;
const timers = new Set<ReturnType<typeof setTimeout>>();
function later(action: () => void) {
  const timer = setTimeout(() => {
    timers.delete(timer);
    action();
  }, 200);
  timers.add(timer);
}
onBeforeUnmount(() => {
  for (const timer of timers) clearTimeout(timer);
});
const uploadProps = {
  customRequest: ({ onSuccess }: UploadCustomRequestArgs) => onSuccess({ url: '/demos/photo.svg' }),
  afterUpload: () => ({ url: '/demos/photo.svg' }),
};
const mode = shallowRef<ChatMode>('bubble');
const align = shallowRef<ChatAlign>('leftRight');
function respond() {
  later(() => {
    chats.value = [
      ...chats.value,
      {
        id: 'reply-' + sequence++,
        role: 'assistant',
        createAt: Date.now(),
        content: 'This is a mock response',
      },
    ];
  });
}
function regenerate() {
  later(() => {
    chats.value = chats.value.map((message, index) =>
      index === chats.value.length - 1
        ? { ...message, status: 'complete', content: 'This is a mock reset message.' }
        : message,
    );
  });
}
</script>

<template>
  <ConfigProvider :locale="en_US">
    <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px">
      <span
        >Mode
        <RadioGroup v-model="mode" type="button"
          ><Radio value="bubble">bubble</Radio><Radio value="noBubble">noBubble</Radio
          ><Radio value="userBubble">userBubble</Radio></RadioGroup
        ></span
      >
      <span
        >Chat layout
        <RadioGroup v-model="align" type="button"
          ><Radio value="leftRight">leftRight</Radio
          ><Radio value="leftAlign">leftAlign</Radio></RadioGroup
        ></span
      >
    </div>
    <Chat
      v-model:chats="chats"
      :role-config="roleConfig"
      :upload-props="uploadProps"
      :style="{
        border: '1px solid var(--semi-color-border)',
        borderRadius: '16px',
        height: '550px',
      }"
      :mode="mode"
      :align="align"
      :upload-tip-props="{ content: 'Customize upload button prompt information' }"
      @message-reset="regenerate"
      @message-send="respond"
    />
  </ConfigProvider>
</template>
