<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/sidebar.css';
import { ref, shallowRef, h } from 'vue';
import { MCPConfigure, type SidebarMCPOption } from '@aifuxi/semi-ui-vue/sidebar';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { IconCodeStroked, IconFigma } from '@aifuxi/semi-icons-vue';
import McpCreate from './McpCreate.vue';
const visible = ref(true),
  dialog = ref(false),
  action = ref('');
let nextId = 1;
const options = shallowRef<SidebarMCPOption[]>(
  [
    {
      icon: null,
      value: 'Semi mcp',
      label: 'Semi',
      configure: true,
      desc: '支持 Semi 的文档、源码搜索，辅助开发',
    },
    {
      icon: null,
      value: 'figma',
      label: 'Figma',
      desc: 'Figma MCP Server 连接Figma与AI开发工具的功能。它通过标准化的模型上下文协MCP），将组件、变量等设计数据和上下文暴露给AI，从而实现从设计稿到代码的智能生成，显著提升开发效率。',
    },
  ].map((option, index) => ({ ...option, icon: h(index ? IconFigma : IconCodeStroked) })),
);
const customOptions = shallowRef<SidebarMCPOption[]>([]);
function status(next: SidebarMCPOption[], custom: boolean) {
  if (custom) customOptions.value = next;
  else options.value = next;
}
function create(values: { name: string; src: string; desc: string }) {
  customOptions.value = [
    ...customOptions.value,
    { label: values.name, icon: values.src, value: 'mcp-' + nextId++, desc: values.desc },
  ];
  dialog.value = false;
}
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div
      style="
        display: flex;
        height: 500px;
        border: 1px solid var(--semi-color-border);
        border-radius: 8px;
        overflow: hidden;
        box-sizing: border-box;
      "
    >
      <div style="flex: 1; padding: 20px">
        <Button @click="visible = !visible">{{ visible ? '关闭' : '开始' }} MCP 配置</Button
        ><output>{{ action }}</output>
      </div>
      <MCPConfigure
        style="width: 500px"
        :resizable="false"
        :visible="visible"
        :options="options"
        :custom-options="customOptions"
        @cancel="visible = false"
        @status-change="status"
        @add-click="dialog = true"
        @configure-click="(_event, option) => (action = 'configure: ' + option.label)"
        @edit-click="(_event, option) => (action = 'edit: ' + option.label)"
      /><McpCreate :visible="dialog" @cancel="dialog = false" @create="create" /></div
  ></ConfigProvider>
</template>
