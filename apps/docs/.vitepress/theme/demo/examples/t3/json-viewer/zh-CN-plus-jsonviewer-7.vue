<script setup lang="ts">
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/json-viewer.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { IconSearch } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/button.css';
const data = '{\n    "name": "Semi",\n    "version": "0.0.0"\n}';
</script>

<template>
  <ConfigProvider :locale="locale">
    <div style="margin-bottom: 16px">
      <JsonViewer :height="200" :width="700" :value="data">
        <template #searchButton="{ defaultSearchButton, controls }">
          <div style="position: absolute; top: 10px; right: 10px; z-index: 10">
            <Button v-if="!controls.showSearchBar" @click="controls.onToggleSearchBar">
              <template #icon><IconSearch /></template>搜索
            </Button>
            <component :is="() => defaultSearchButton" v-else />
          </div>
        </template>
      </JsonViewer>
    </div>
  </ConfigProvider>
</template>
