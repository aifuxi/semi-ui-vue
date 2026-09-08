<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/sidebar.css';
import { ref } from 'vue';
import { Sidebar, type SidebarActiveKey } from '@aifuxi/semi-ui-vue/sidebar';
import { codes } from './listData';
import '@aifuxi/semi-theme-default/code-highlight.css';
import '@aifuxi/semi-theme-default/json-viewer.css';
const activeKey = ref<SidebarActiveKey>('code1'),
  expanded = ref('');
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div class="semi-sidebar-main">
      <Sidebar.CodeContent
        style="width: 600px; max-width: 100%"
        :active-key="activeKey"
        :codes="codes"
        @change="activeKey = $event"
        @expand="(_event, code) => (expanded = code.name ?? '')"
      /><output>{{ expanded }}</output>
    </div></ConfigProvider
  >
</template>
