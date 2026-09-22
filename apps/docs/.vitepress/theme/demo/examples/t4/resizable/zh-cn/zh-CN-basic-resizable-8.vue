<script setup lang="ts">
import { Resizable } from '@aifuxi/semi-ui-vue/resizable';
import '@aifuxi/semi-theme-default/resizable.css';
</script>
<template>
  <div :style="{ width: '500px', height: '60%' }">
    <Resizable
      :style="{ backgroundColor: 'rgba(var(--semi-grey-1), 1)' }"
      :max-width="200"
      :max-height="300"
      :min-width="50"
      :min-height="50"
      :default-size="{
        width: 100,
        height: 100,
      }"
    >
      <div :style="{ marginLeft: '20%' }">width在50到200之间，height在50到300之间</div>
    </Resizable>
  </div>
</template>
