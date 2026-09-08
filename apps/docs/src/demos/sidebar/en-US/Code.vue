<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/sidebar.css';
import { ref } from 'vue';
import { Sidebar } from '@aifuxi/semi-ui-vue/sidebar';
import { RadioGroup, Radio } from '@aifuxi/semi-ui-vue/radio';
import { cssCode, jsonCode } from './listData';
import '@aifuxi/semi-theme-default/code-highlight.css';
import '@aifuxi/semi-theme-default/json-viewer.css';
const type = ref('json');
</script>
<template>
  <ConfigProvider :locale="locale"
    ><RadioGroup v-model="type" type="button" style="margin-bottom: 10px"
      ><Radio value="json">JSON</Radio><Radio value="css">CSS</Radio></RadioGroup
    >
    <div style="height: 200px; overflow: auto">
      <Sidebar.CodeItem
        :is-json="type === 'json'"
        :content="type === 'json' ? jsonCode : cssCode"
        language="css"
      /></div
  ></ConfigProvider>
</template>
