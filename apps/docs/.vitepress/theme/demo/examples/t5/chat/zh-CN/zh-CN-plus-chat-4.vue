<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { Chat, type ChatMessage } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import zh_CN from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
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
      '\nSemi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户[[1]](https://semi.design/zh-CN/start/introduction)。\n\nSemi Design的特点包括：\n\n1. 设计简洁、现代化。\n2. 提供主题方案，可深度样式定制。\n3. 提供明暗色两套模式，切换方便。\n4. 国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。\n5. 采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。\n\n---\nLearn more:\n1. [Introduction 介绍 - Semi Design](https://semi.design/zh-CN/start/introduction)\n2. [Getting Started 快速开始 - Semi Design](https://semi.design/zh-CN/start/getting-started)\n3. [Semi D2C 设计稿转代码的演进之路 - 知乎](https://zhuanlan.zhihu.com/p/667189184)\n',
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
  <ConfigProvider :locale="zh_CN">
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
