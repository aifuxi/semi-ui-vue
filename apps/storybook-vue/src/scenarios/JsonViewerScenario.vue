<script setup lang="ts">
import { h } from 'vue';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import { JsonViewer, type JsonViewerOptions } from '@aifuxi/semi-ui-vue/json-viewer';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
const value = `{
  "project": "Semi UI Vue",
  "version": "2.102.0",
  "ready": true,
  "tags": ["Vue", "Worker", "Parity"],
  "metrics": { "components": 78, "target": 85 }
}`;
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': {
    code: 'zh-CN',
    JsonViewer: { search: '查找', replace: '替换', replaceAll: '全部替换' },
  },
  'en-US': {
    code: 'en-US',
    JsonViewer: { search: 'Search', replace: 'Replace', replaceAll: 'Replace All' },
  },
};
const editableOptions: JsonViewerOptions = { readOnly: false, autoWrap: true };
const customOptions: JsonViewerOptions = {
  readOnly: true,
  autoWrap: true,
  customRenderRule: [
    {
      match: 'Semi UI Vue',
      render: (content) => h('strong', { class: 'json-viewer-scenario__custom-token' }, content),
    },
  ],
};
</script>

<template>
  <ConfigProvider :direction="props.direction" :locale="localeMap[props.locale]">
    <div class="json-viewer-scenario" data-testid="json-viewer-vue">
      <section class="json-viewer-scenario__card json-viewer-scenario__main">
        <h3>Editable / search</h3>
        <JsonViewer
          data-parity-target="json-viewer-main"
          :value="value"
          :width="640"
          :height="300"
          :options="editableOptions"
          :limit-search-button-bounds="true"
        />
      </section>
      <section class="json-viewer-scenario__card json-viewer-scenario__custom">
        <h3>Read only / custom token</h3>
        <JsonViewer
          data-parity-target="json-viewer-custom"
          :value="value"
          :width="420"
          :height="220"
          :show-search="false"
          :options="customOptions"
        />
      </section>
    </div>
  </ConfigProvider>
</template>
