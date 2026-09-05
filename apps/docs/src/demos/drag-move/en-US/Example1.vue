<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { DragMove } from '@aifuxi/semi-ui-vue/drag-move';
import '@aifuxi/semi-theme-default/drag-move.css';

const container = useTemplateRef<HTMLElement>('container');
</script>

<template>
  <div ref="container" style="position: relative; width: 300px; height: 240px">
    <DragMove :constrainer="() => container">
      <div style="top: 40px; left: 40px; width: 80px; height: 80px">Drag me</div>
    </DragMove>
  </div>
</template>
