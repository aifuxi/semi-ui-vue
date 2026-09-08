<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/sidebar.css';
import { ref } from 'vue';
import { Sidebar, type SidebarActiveKey } from '@aifuxi/semi-ui-vue/sidebar';
import { files } from './listData';
const activeKey = ref<SidebarActiveKey>('file1'),
  expanded = ref('');
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div class="semi-sidebar-main">
      <Sidebar.FileContent
        style="width: 600px; max-width: 100%"
        :active-key="activeKey"
        :files="files"
        @change="activeKey = $event"
        @expand="(_event, file) => (expanded = file.name ?? '')"
      /><output>{{ expanded }}</output>
    </div></ConfigProvider
  >
</template>
