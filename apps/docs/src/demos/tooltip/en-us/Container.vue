<script setup lang="ts">
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { shallowRef } from 'vue';
const container = shallowRef<HTMLElement | null>(null);
function getPopupContainer() {
  return container.value!;
}
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><div ref="container" style="position: relative">
      <Tooltip
        position="right"
        content="Popup will be rendered in the current example container"
        trigger="click"
        :get-popup-container="getPopupContainer"
        ><Tag>Click here</Tag></Tooltip
      >
    </div></ConfigProvider
  >
</template>
