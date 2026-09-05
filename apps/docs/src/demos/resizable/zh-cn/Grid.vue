<script setup lang="ts">
import { Resizable } from '@aifuxi/semi-ui-vue/resizable';
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
      :grid="100"
      :snap-gap="20"
    >
      <div :style="{ marginLeft: '20%' }">snap</div>
    </Resizable>
  </div>
</template>
