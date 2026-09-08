<script setup lang="ts">
import { Chat } from '@aifuxi/semi-ui-vue/chat';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { useMockChat } from './useMockChat';
import '@aifuxi/semi-theme-default/chat.css';
import SourceCard from './SourceCard.vue';
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import '@aifuxi/semi-theme-default/markdown-render.css';
const { chats, respond, roleConfig, uploadProps } = useMockChat(
  [
    {
      role: 'assistant',
      id: '1',
      createAt: 1715676751919,
      content:
        "Semi Design is a design system designed, developed and maintained by Douyin's front-end team and MED product design team. As a comprehensive, easy-to-use, high-quality modern application UI solution, it is extracted from the complex scenarios of ByteDance's various business lines, supports nearly a thousand platform products, and serves 100,000+ internal and external users.",
      source: [
        {
          avatar: '/demos/two.svg',
          url: '/en-US/start/introduction',
          title: 'semi Design',
          subTitle: 'Semi design website',
          content:
            "Semi Design is a design system designed, developed and maintained by Douyin's front-end team and MED product design team.",
        },
        {
          avatar: '/demos/two.svg',
          url: '/dsm/landing',
          subTitle: 'Semi DSM website',
          title: 'Semi Design System',
          content:
            'From Semi Design to Any Design, quickly define your design system and apply it in design drafts and code',
        },
        {
          avatar: '/demos/two.svg',
          url: '/code/en-US/start/introduction',
          subTitle: 'Semi D2C website',
          title: 'Design to Code',
          content:
            'Semi Design to Code, or Semi D2C for short, is a new performance improvement tool launched by the Douyin front-end Semi Design team.',
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
