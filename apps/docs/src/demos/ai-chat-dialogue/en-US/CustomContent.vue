<script setup lang="ts">
import { ref } from 'vue';
import { AIChatDialogue, type Message } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/ai-chat-dialogue.css';
const roleConfig = {
  user: { name: 'User', avatar: '/demos/one.svg' },
  assistant: { name: 'Assistant', avatar: '/demos/two.svg' },
  system: { name: 'System', avatar: '/demos/two.svg' },
};
import { h } from 'vue';
import ReasoningContent from './ReasoningContent.vue';
const initialMessages = [
  {
    id: '1',
    role: 'user',
    content: 'Hello',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Hello! How can I help you today?',
    status: 'completed',
  },
  {
    id: '3',
    role: 'user',
    content: [
      {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: 'Help me generate a similar image',
          },
          {
            type: 'input_image',
            image_url: '/demos/photo.svg',
            file_id: 'demo-file-id',
          },
          {
            type: 'input_image',
            image_url: '/demos/photo.svg',
            file_id: 'demo-file-id',
          },
        ],
      },
    ],
  },
  {
    id: '4',
    role: 'assistant',
    content: [
      {
        type: 'reasoning',
        summary: [
          {
            type: 'summary_text',
            text: '\nThe user asked me to generate a similar image. I need to analyze the image first, then generate a similar one...',
          },
        ],
        annotations: [
          {
            title: 'semi.design',
            url: 'https://semi.design/',
            detail: 'semi design page',
            logo: '/demos/two.svg',
          },
          {
            title: 'semi.design',
            url: 'https://semi.design/',
            detail: 'semi design page',
            logo: '/demos/two.svg',
          },
        ],
        status: 'completed',
      },
      {
        type: 'function_call',
        name: 'create_travel_guide',
        arguments: '{\n"city": "Beijing"\n}',
        status: 'completed',
      },
    ],
    status: 'completed',
  },
];
const chats = ref<Message[]>(initialMessages);
const lastEvent = ref('');
const userStyle = {
  backgroundColor: 'var(--semi-color-fill-1)',
  color: 'var(--semi-color-text-0)',
  borderRadius: '25px',
  padding: '6px 16px',
};
const assistantStyle = { color: 'var(--semi-color-text-0)', padding: '6px 16px' };
function text(item: unknown, message?: Message) {
  return h(
    'div',
    {
      class: message?.role === 'user' ? 'userTextStyle' : undefined,
      style: message?.role === 'user' ? userStyle : assistantStyle,
    },
    typeof item === 'string' ? item : String((item as { text?: string }).text ?? ''),
  );
}
const renderers = {
  function_call: {
    create_travel_guide: (item: unknown) => {
      const tool = item as { name: string; arguments: string };
      return h(
        'div',
        { style: userStyle },
        'Function Tool Call: ' + tool.name + ' ' + tool.arguments,
      );
    },
  },
  input_text: text,
  default: text,
  reasoning: (item: unknown) =>
    h(ReasoningContent, {
      item: item as { summary?: Array<{ text?: string; type?: string }> },
      onAnnotation: () => {
        lastEvent.value = 'Ready to open the sidebar!';
      },
    }),
};
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatDialogue
      v-model:chats="chats"
      :role-config="roleConfig"
      :render-dialogue-content-item="renderers"
    ></AIChatDialogue
    ><output>{{ lastEvent }}</output></ConfigProvider
  >
</template>
