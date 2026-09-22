<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { DragMove } from '@aifuxi/semi-ui-vue/drag-move';
import '@aifuxi/semi-theme-default/drag-move.css';

const container = useTemplateRef<HTMLElement>('container');
</script>
<template>
  <div
    ref="container"
    style="
      background-color: rgba(var(--semi-grey-2), 1);
      width: 300px;
      height: 300px;
      padding: 5px;
      position: relative;
      color: rgba(var(--semi-white), 1);
      font-weight: 500;
    "
  >
    <span>Constrainer</span>
    <DragMove :constrainer="() => container">
      <div
        style="
          background-color: var(--semi-color-primary);
          width: 80px;
          height: 80px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 80px;
          left: 80px;
        "
      >
        Drag me
      </div>
    </DragMove>
  </div>
</template>
