<script setup lang="ts">
import { shallowRef } from 'vue';
import { ResizeGroup, ResizeItem, ResizeHandler } from '@aifuxi/semi-ui-vue/resizable';
import '@aifuxi/semi-theme-default/resizable.css';
const text = shallowRef('Drag to resize');
</script>
<template>
  <div :style="{ width: '1000px', height: '100px' }">
    <ResizeGroup direction="horizontal">
      <ResizeItem
        :style="{
          backgroundColor: 'rgba(var(--semi-grey-1), 1)',
          border: 'var(--semi-color-border) 1px solid',
        }"
        :default-size="'400px'"
        :min="'10%'"
        @change="text = 'resizing'"
        @resize-end="text = 'Drag to resize'"
      >
        <div :style="{ marginLeft: '20%' }">{{ text + ' min:10%' }}</div>
      </ResizeItem>
      <ResizeHandler></ResizeHandler>
      <ResizeItem
        :style="{
          backgroundColor: 'rgba(var(--semi-grey-1), 1)',
          border: 'var(--semi-color-border) 1px solid',
        }"
        :default-size="'20%'"
        :min="'10%'"
        :max="'30%'"
        @change="text = 'resizing'"
      >
        <div :style="{ marginLeft: '20%' }">{{ text + ' min:10% max:30%' }}</div>
      </ResizeItem>
      <ResizeHandler></ResizeHandler>
      <ResizeItem
        :style="{
          backgroundColor: 'rgba(var(--semi-grey-1), 1)',
          border: 'var(--semi-color-border) 1px solid',
        }"
        :default-size="'0.5'"
        @change="text = 'resizing'"
      >
        <div :style="{ marginLeft: '20%' }">{{ text }}</div>
      </ResizeItem>
      <ResizeHandler></ResizeHandler>
      <ResizeItem
        :style="{
          backgroundColor: 'rgba(var(--semi-grey-1), 1)',
          border: 'var(--semi-color-border) 1px solid',
        }"
        :default-size="1"
        @change="text = 'resizing'"
      >
        <div :style="{ marginLeft: '20%' }">{{ text }}</div>
      </ResizeItem>
    </ResizeGroup>
  </div>
</template>
