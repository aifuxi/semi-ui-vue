<script setup lang="ts">
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { shallowRef } from 'vue';
const container = shallowRef<HTMLElement | null>(null);
function getPopupContainer() {
  return container.value!;
}
</script>
<template>
  <div ref="container" style="position: relative; min-height: 72px; overflow: hidden">
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
  </div>
</template>
