<script setup lang="ts">
import { Resizable } from '@aifuxi/semi-ui-vue/resizable';
import IconHandle from '@aifuxi/semi-icons-vue/icons/IconHandle';
import '@aifuxi/semi-theme-default/resizable.css';
</script>
<template>
  <div :style="{ width: '500px', height: '60%' }">
    <Resizable
      :style="{
        marginLeft: '20%',
        backgroundColor: 'rgba(var(--semi-grey-1), 1)',
        border: 'var(--semi-color-border) 1px solid',
      }"
      :default-size="{
        width: '60%',
        height: 300,
      }"
      ><template #handle-right
        ><div style="height: 100%; display: flex; align-items: center; width: fit-content">
          <IconHandle /></div
      ></template>
      <div :style="{ marginLeft: '20%' }">right</div>
    </Resizable>
  </div>
</template>
