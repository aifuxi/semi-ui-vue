<script setup lang="ts">
import { Resizable } from '@aifuxi/semi-ui-vue/resizable';
import '@aifuxi/semi-theme-default/resizable.css';
</script>
<template>
  <div :style="{ width: '500px', height: '60%' }">
    <Resizable
      :style="{ backgroundColor: 'rgba(var(--semi-grey-1), 1)' }"
      :ratio="2"
      :default-size="{
        width: 200,
        height: 200,
      }"
    >
      <div :style="{ marginLeft: '20%' }">ratio=2</div>
    </Resizable>
  </div>
</template>
