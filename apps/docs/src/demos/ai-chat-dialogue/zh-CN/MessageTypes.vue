<script setup lang="ts">
import { ref, h } from 'vue';
import PlanContent from './PlanContent.vue';
import { AIChatDialogue, type Message } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
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
    content: '普通文本',
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
            text: '帮我生成类似的图片',
          },
          {
            type: 'input_image',
            image_url: '/demos/photo.svg',
            file_id: 'demo-file-id',
          },
          {
            type: 'input_text',
            text: '以下是文件展示',
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
            text: '\n我需要思考并回答用户关于什么是 Semi 组件库的问题...',
          },
        ],
      },
      {
        type: 'message',
        content: [
          {
            type: 'output_text',
            text: 'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统。',
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
            text: '恭喜你，你已经掌握了 semi design 的所有知识！',
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
            summary: '创建一份全面的北京旅游攻略，包含景点、住宿、交通、美食和实用旅行建议',
            steps: [
              {
                summary: '搜索北京旅游景点介绍及门票信息',
                description: '正在搜索: 北京旅游景点介绍及门票信息',
                type: 'search',
              },
              {
                summary: '读取指定文件的指定行内容',
                description: '正在创建文档:  北京旅游攻略',
                type: 'docs',
              },
              {
                summary: '创建包含北京旅游攻略的文件',
                description: '正在创建代码文件: beijing_travel_guide.html',
                type: 'code',
              },
            ],
            statues: 'completed',
          },
          {
            summary: '总结北京旅游攻略的创建成果并呈现给用户',
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
