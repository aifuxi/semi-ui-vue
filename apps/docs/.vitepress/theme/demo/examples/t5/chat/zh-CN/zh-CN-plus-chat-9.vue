<script setup lang="ts">
import { Chat } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import { useMockChat } from './useMockChat';
import '@aifuxi/semi-theme-default/chat.css';
import SourceCard from './SourceCard.vue';
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import '@aifuxi/semi-theme-default/markdown-render.css';
const { chats, respond, roleConfig, uploadProps } = useMockChat(
  [
    {
      role: 'assistant',
      id: '3',
      createAt: 1715676751919,
      content:
        'Semi Design 是由抖音前端团队，MED 产品设计团队设计、开发并维护的设计系统。它作为全面、易用、优质的现代应用 UI 解决方案，从字节跳动各业务线的复杂场景提炼而来，支撑近千计平台产品，服务内外部 10 万+ 用户。',
      source: [
        {
          avatar: '/demos/two.svg',
          url: '/zh-CN/start/introduction',
          title: 'semi Design',
          subTitle: 'Semi design website',
          content: 'Semi Design 是由抖音前端团队，MED 产品设计团队设计、开发并维护的设计系统。',
        },
        {
          avatar: '/demos/two.svg',
          url: '/dsm/landing',
          subTitle: 'Semi DSM website',
          title: 'Semi 设计系统',
          content: '从 Semi Design，到 Any Design 快速定义你的设计系统，并应用在设计稿和代码中',
        },
        {
          avatar: '/demos/two.svg',
          url: '/code/zh-CN/start/introduction',
          subTitle: 'Semi D2C website',
          title: '设计稿转代码',
          content:
            'Semi 设计稿转代码（Semi Design to Code，或简称 Semi D2C），是由抖音前端 Semi Design 团队推出的全新的提效工具',
        },
      ],
    },
  ],
  'This is a mock response',
);
type Sources = Array<{ avatar: string; title: string; subTitle: string; content: string }>;
function sources(value: unknown): Sources {
  return Array.isArray(value) ? (value as Sources) : [];
}
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
        height: '500px',
      }"
      @message-send="respond"
      ><template #chat-box-content="{ message, className }"
        ><div :class="className">
          <SourceCard
            v-if="sources(message?.source).length"
            :source="sources(message?.source)"
          /><MarkdownRender
            :raw="String(message?.content ?? '')"
            format="md"
          /></div></template></Chat
  ></ConfigProvider>
</template>
