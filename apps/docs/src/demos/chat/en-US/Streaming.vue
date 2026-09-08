<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { Chat, type ChatMessage } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import en_US from '@aifuxi/semi-ui-vue/locale/source/en_US';
import type { UploadCustomRequestArgs } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/chat.css';
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
    content: '介绍一下 Semi design',
  },
  {
    role: 'assistant',
    id: '3',
    createAt: 1715676751919,
    content:
      "\nSemi Design is a design system designed, developed and maintained by Douyin's front-end team and MED product design team. As a comprehensive, easy-to-use, high-quality modern application UI solution, Semi Design is extracted from the complex scenarios of ByteDance's various business lines. It has currently supported nearly a thousand platform products and served more than 100,000 internal and external users.[[1]](https://semi.design/zh-CN/start/introduction)。\n\nSemi Design features include:\n\n1. Simple and modern design.\n2. Provide theme solutions, which can be customized in depth.\n3. Provide two sets of light and dark color modes, easy to switch.\n4. Internationalization, covering 20+ languages ​​such as Simplified/Traditional Chinese, English, Japanese, Korean, Portuguese, etc. The date and time component provides global time zone support, and all components can automatically adapt to the Arabic RTL layout.\n5. Use Foundation and Adapter cross-framework technical solutions to facilitate expansion.\n\n---\nLearn more:\n1. [Introduction - Semi Design](https://semi.design/zh-CN/start/introduction)\n2. [Getting Started - Semi Design](https://semi.design/zh-CN/start/getting-started)\n3. [The evolution of Semi D2C design draft to code - Zhihu](https://zhuanlan.zhihu.com/p/667189184)\n",
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
let interval: ReturnType<typeof setInterval> | undefined;
function stop() {
  clearInterval(interval);
  interval = undefined;
  chats.value = chats.value.map((message, index) =>
    index === chats.value.length - 1 ? { ...message, status: 'complete' } : message,
  );
}
onBeforeUnmount(() => clearInterval(interval));
function respond(content: string) {
  clearInterval(interval);
  const id = 'stream-' + sequence++;
  // Keep the mock response asynchronous and clean it up with this demo instance.
  later(() => {
    chats.value = [
      ...chats.value,
      { id, role: 'assistant', status: 'loading', createAt: Date.now() },
    ];
    interval = setInterval(() => {
      chats.value = chats.value.map((message) => {
        if (message.id !== id) return message;
        const text = typeof message.content === 'string' ? message.content : '';
        if (text.length > 200) {
          clearInterval(interval);
          interval = undefined;
          return { ...message, content: text + ' mock stream message', status: 'complete' };
        }
        return {
          ...message,
          content:
            message.status === 'loading'
              ? 'mock Response for ' + content + '\n'
              : text + ' mock stream message',
          status: 'incomplete',
        };
      });
    }, 400);
  });
}
</script>

<template>
  <ConfigProvider :locale="en_US">
    <Chat
      v-model:chats="chats"
      :role-config="roleConfig"
      :upload-props="uploadProps"
      :style="{
        border: '1px solid var(--semi-color-border)',
        borderRadius: '16px',
        height: '600px',
      }"
      show-stop-generate
      @stop-generator="stop"
      @message-send="respond"
    />
  </ConfigProvider>
</template>
