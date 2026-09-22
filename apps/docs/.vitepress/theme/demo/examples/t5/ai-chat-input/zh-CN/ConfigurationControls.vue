<script setup lang="ts">
import { h } from 'vue';
import { AIChatInputConfigure } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { IconBookOpenStroked, IconFeishuLogo, IconGit, IconFigma } from '@aifuxi/semi-icons-vue';
const emit = defineEmits<{ configure: [] }>();
const modelOptions = [
  {
    value: 'GPT-5',
    label: 'GPT-5',
  },
  {
    value: 'GPT-4o',
    label: 'GPT-4o',
  },
  {
    value: 'Claude 3.5 Sonnet',
    label: 'Claude 3.5 Sonnet',
  },
];
const mcpOptions = [
  {
    icon: null,
    label: '飞书文档',
    value: 'feishu',
  },
  {
    icon: null,
    label: 'Github Mcp',
    value: 'github',
  },
  {
    icon: null,
    label: 'IconFigma Mcp',
    value: 'IconFigma',
  },
].map((item, index) => ({ ...item, icon: h([IconFeishuLogo, IconGit, IconFigma][index]!) }));
const radioOptions = [
  {
    label: '极速',
    value: 'fast',
  },
  {
    label: '思考',
    value: 'think',
  },
  {
    label: '超能',
    value: 'super',
  },
];
</script>
<template>
  <AIChatInputConfigure.Select
    :option-list="modelOptions"
    field="model"
    init-value="GPT-4o"
  /><AIChatInputConfigure.Button field="onlineSearch"
    ><IconBookOpenStroked />联网搜索</AIChatInputConfigure.Button
  ><AIChatInputConfigure.Mcp
    :options="mcpOptions"
    @configure-button-click="emit('configure')"
  /><AIChatInputConfigure.RadioButton :options="radioOptions" field="thinkType" init-value="fast" />
</template>
