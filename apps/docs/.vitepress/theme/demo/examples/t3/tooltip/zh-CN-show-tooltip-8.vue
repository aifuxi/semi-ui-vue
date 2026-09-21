<script setup lang="ts">
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { shallowRef } from 'vue';
const container = shallowRef<HTMLElement | null>(null);
function getPopupContainer() {
  return container.value!;
}
</script>
<template>
  <div ref="container" style="position: relative">
    <Tooltip
      position="right"
      content="浮层被渲染至当前示例容器中"
      trigger="click"
      :get-popup-container="getPopupContainer"
      ><Tag>点击此处</Tag></Tooltip
    >
  </div>
</template>
