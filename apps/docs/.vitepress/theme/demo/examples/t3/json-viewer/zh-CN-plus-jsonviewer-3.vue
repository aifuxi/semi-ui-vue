<script setup lang="ts">
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/json-viewer.css';
const data = '{\n    "name": "Semi",\n    "version": "0.0.0"\n}';
</script>
<template>
  <ConfigProvider :locale="locale">
    <div>
      <div
        v-for="[lineHeight, height] in [
          [20, 100],
          [24, 120],
          [26, 120],
        ]"
        :key="lineHeight"
        style="margin-bottom: 12px; overflow: hidden"
      >
        <JsonViewer :height="height" :width="700" :value="data" :options="{ lineHeight }" />
      </div>
    </div>
  </ConfigProvider>
</template>
