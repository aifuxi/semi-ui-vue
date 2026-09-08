<script setup lang="ts">
import { ref, h } from 'vue';
import PlanContent from './PlanContent.vue';
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
const initialMessages = [
  {
    role: 'assistant',
    id: '1',
    createAt: 1715676751919,
    content: 'Plain text',
  },
  {
    id: '2',
    role: 'user',
    content: [
      {
        type: 'message',
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
            type: 'input_text',
            text: 'Files preview below',
          },
          {
            type: 'input_file',
            file_url: 'https://www.semi.pdf',
            filename: 'semi.pdf',
            size: '100KB',
          },
          {
            type: 'input_file',
            file_url: 'https://www.semi.json',
            filename: 'semi.json',
            size: '100KB',
          },
          {
            type: 'input_file',
            file_url: 'https://www.semi.docx',
            filename: 'semi.docx',
            size: '100KB',
          },
        ],
      },
    ],
    status: 'completed',
  },
  {
    id: '3',
    role: 'assistant',
    content: [
      {
        type: 'reasoning',
        status: 'completed',
        summary: [
          {
            type: 'summary_text',
            text: '\nI need to reason and answer the user about what the Semi component library is...',
          },
        ],
      },
      {
        type: 'message',
        content: [
          {
            type: 'output_text',
            text: 'Semi Design is a design system built and maintained by ByteDance Frontend Team and the MED Product Design Team.',
          },
        ],
        status: 'completed',
      },
      {
        id: 'fc_12345xyz',
        call_id: 'call_12345xyz',
        type: 'function_call',
        name: 'get_weather',
        status: 'completed',
        arguments: "{'location':'Paris, France'}",
      },
      {
        type: 'message',
        content: [
          {
            type: 'output_text',
            text: 'Congrats! You now know everything about Semi Design!',
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
          },
        ],
      },
      {
        type: 'plan',
        content: [
          {
            summary:
              'Create a comprehensive Beijing travel guide covering attractions, lodging, transport, food, and tips',
            steps: [
              {
                summary: 'Search introductions and ticket info for Beijing attractions',
                description: 'Searching: Beijing attraction introductions and ticket info',
                type: 'search',
              },
              {
                summary: 'Read specific lines of a given file',
                description: 'Creating document: Beijing Travel Guide',
                type: 'docs',
              },
              {
                summary: 'Create a file containing the Beijing travel guide',
                description: 'Creating code file: beijing_travel_guide.html',
                type: 'code',
              },
            ],
            statues: 'completed',
          },
          {
            summary: 'Summarize the created Beijing travel guide and present to the user',
            steps: [],
          },
        ],
      },
    ],
    status: 'completed',
  },
];
const chats = ref<Message[]>(initialMessages);
const lastEvent = ref('');
const renderers = { plan: (item: unknown) => h(PlanContent, { item: item as PlanItem }) };
interface PlanItem {
  content: Array<{
    summary: string;
    steps: Array<{ summary: string; description: string; type: string }>;
  }>;
}
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatDialogue
      v-model:chats="chats"
      :role-config="roleConfig"
      :render-dialogue-content-item="renderers"
      disabled-file-item-click
      @file-click="lastEvent = $event?.filename ?? ''"
      @image-click="lastEvent = 'image'"
      @annotation-click="lastEvent = 'annotation'"
    /><output>{{ lastEvent }}</output></ConfigProvider
  >
</template>
