<script setup lang="ts">
import { h } from 'vue';
import { AIChatInputConfigure } from '@aifuxi/semi-ui-vue/ai-chat-input';
import {
  IconBookOpenStroked,
  IconFeishuLogo,
  IconGit,
  IconFigma,
  IconTemplateStroked,
  IconSearch,
} from '@aifuxi/semi-icons-vue';
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
    label: 'Lark Doc',
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
  { label: h(IconTemplateStroked), value: 'fast' },
  { label: h(IconSearch), value: 'think' },
];
</script>
<template>
  <AIChatInputConfigure.Select
    :option-list="modelOptions"
    field="model"
    init-value="GPT-4o"
  /><AIChatInputConfigure.Button field="onlineSearch"
    ><IconBookOpenStroked />Online search</AIChatInputConfigure.Button
  ><AIChatInputConfigure.Mcp :options="mcpOptions" /><AIChatInputConfigure.RadioButton
    :options="radioOptions"
    field="thinkType"
    init-value="think"
  />
</template>
