<script setup lang="ts">
import { h, ref } from 'vue';
import { IconCodeStroked } from '@aifuxi/semi-icons-vue';
import { Sidebar, type SidebarCodeItemProps } from '@aifuxi/semi-ui-vue/sidebar';
import '@aifuxi/semi-theme-default/sidebar.css';

const activeKey = ref('code');
const codes: SidebarCodeItemProps[] = [
  { key: 'main', name: 'main.ts', language: 'ts', content: 'const ready = true' },
];
</script>

<template>
  <Sidebar
    visible
    :motion="false"
    :resizable="false"
    title="Agent 工作区"
    :active-key="activeKey"
    :options="[{ key: 'code', icon: h(IconCodeStroked), name: '代码' }]"
    @active-option-change="(_, key) => (activeKey = key)"
  >
    <template #main-content>
      <Sidebar.CodeContent active-key="main" :codes="codes" />
    </template>
  </Sidebar>
</template>
