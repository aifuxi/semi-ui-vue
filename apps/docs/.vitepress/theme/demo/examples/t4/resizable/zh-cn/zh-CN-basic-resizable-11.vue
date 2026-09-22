<script setup lang="ts">
import { Resizable } from '@aifuxi/semi-ui-vue/resizable';
import '@aifuxi/semi-theme-default/resizable.css';
</script>
<template>
  <div :style="{ width: '300px', height: '300px', border: 'var(--semi-color-border) 1px solid' }">
    <Resizable
      :style="{ marginLeft: '20%', backgroundColor: 'rgba(var(--semi-grey-1), 1)' }"
      :default-size="{
        width: '60%',
        height: 200,
      }"
      :bound-element="'parent'"
    >
      <div :style="{ marginLeft: '20%' }">bound：parent</div>
    </Resizable>
  </div>
</template>
