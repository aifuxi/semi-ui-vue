<script setup lang="ts">
import { shallowRef } from 'vue';
import { JsonViewer } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/json-viewer.css';

const value = shallowRef(`{
  "name": "Semi UI Vue",
  "reference": "v2.102.0",
  "ready": true,
  "pilots": ["Button", "Select", "Modal", "Table", "Icon", "JsonViewer"]
}`);
</script>

<template>
  <JsonViewer
    v-model:value="value"
    width="100%"
    :height="300"
    :options="{ autoWrap: true, formatOptions: { tabSize: 2, insertSpaces: true } }"
  />
</template>
