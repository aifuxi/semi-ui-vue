<script setup lang="ts">
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/json-viewer.css';
const data =
  '{\n    "name": "Semi",\n    "version": "0.0.0",\n    "description": "Semi Design is a design system that defines a set of mid_back design and front_end basic components."\n}';
</script>
<template>
  <ConfigProvider :locale="locale">
    <div style="margin-bottom: 16px">
      <JsonViewer :height="120" :width="700" :value="data" :options="{ autoWrap: true }" />
    </div>
  </ConfigProvider>
</template>
