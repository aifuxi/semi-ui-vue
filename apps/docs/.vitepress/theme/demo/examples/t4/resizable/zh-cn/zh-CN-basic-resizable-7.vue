<script setup lang="ts">
import { Resizable } from '@aifuxi/semi-ui-vue/resizable';
import '@aifuxi/semi-theme-default/resizable.css';
</script>
<template>
  <div :style="{ width: '500px', height: '60%' }">
    <Resizable
      :style="{ backgroundColor: 'rgba(var(--semi-grey-1), 1)', marginBottom: '10px' }"
      :default-size="{
        width: 400,
        height: 300,
      }"
      lock-aspect-ratio
    >
      <div :style="{ marginLeft: '20%' }">lock</div>
    </Resizable>
    <Resizable
      :style="{ backgroundColor: 'rgba(var(--semi-grey-1), 1)' }"
      :default-size="{
        width: 200,
        height: (200 * 9) / 16,
      }"
      :lock-aspect-ratio="16 / 9"
    >
      <div :style="{ marginLeft: '20%' }">16 / 9</div>
    </Resizable>
  </div>
</template>
