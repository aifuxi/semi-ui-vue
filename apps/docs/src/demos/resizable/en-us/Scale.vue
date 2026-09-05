<script setup lang="ts">
import { Resizable } from '@aifuxi/semi-ui-vue/resizable';
import '@aifuxi/semi-theme-default/resizable.css';
</script>
<template>
  <div :style="{ width: '500px', height: '60%', transform: 'scale(0.5)', transformOrigin: '0 0' }">
    <Resizable
      :style="{ backgroundColor: 'rgba(var(--semi-grey-1), 1)' }"
      :default-size="{
        width: '60%',
        height: '60%',
      }"
      :scale="0.5"
    >
      <div :style="{ marginLeft: '20%' }">scale 0.5</div>
    </Resizable>
  </div>
</template>
