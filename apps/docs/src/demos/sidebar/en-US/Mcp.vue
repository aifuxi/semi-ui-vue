<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
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
      desc: 'Support searching Semi docs and source code to assist development',
    },
    {
      icon: null,
      value: 'figma',
      label: 'Figma',
      desc: 'Figma MCP Server connects Figma with AI development tools. Through Model Context Protocol (MCP), it exposes design data such as components and variables to AI, enabling intelligent generation from design to code and significantly improving development efficiency.',
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
        <Button @click="visible = !visible"
          >{{ visible ? 'Close' : 'Open' }} MCP configuration</Button
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
