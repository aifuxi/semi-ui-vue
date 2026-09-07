<script setup lang="ts">
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/json-viewer.css';
import { useTemplateRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const viewer = useTemplateRef('viewer');
const data = '{\n  "name": "Semi",\n  "version": "0.0.0"\n}';
function format() {
  viewer.value?.format();
}
</script>
<template>
  <ConfigProvider :locale="locale">
    <div>
      <Button @click="format">Format</Button>
      <div style="margin: 16px 0">
        <JsonViewer
          ref="viewer"
          :height="100"
          :width="700"
          :value="data"
          :options="{ formatOptions: { tabSize: 4, insertSpaces: true, eol: '\n' } }"
        />
      </div>
    </div>
  </ConfigProvider>
</template>
