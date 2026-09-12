<script setup lang="ts">
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
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
      <Popover
        v-if="container"
        :get-popup-container="getPopupContainer"
        trigger="custom"
        visible
        position="right"
        show-arrow
        :style="{
          backgroundColor: 'rgba(var(--semi-blue-4),1)',
          borderColor: 'rgba(var(--semi-blue-4),1)',
          color: 'var(--semi-color-white)',
          borderWidth: '1px',
          borderStyle: 'solid',
        }"
        ><template #content><article style="padding: 4px">Hi, Semi UI Popover.</article></template
        ><Tag style="background-color: rgba(var(--semi-blue-4), 1); color: var(--semi-color-white)"
          >Colorful Popover</Tag
        ></Popover
      >
    </div></ConfigProvider
  >
</template>
