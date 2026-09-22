<script setup lang="ts">
import { DragMove } from '@aifuxi/semi-ui-vue/drag-move';
import '@aifuxi/semi-theme-default/drag-move.css';
</script>
<template>
  <div style="position: relative; height: 140px">
    <DragMove>
      <div
        style="
          background-color: var(--semi-color-primary);
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-weight: 500;
          position: absolute;
          color: rgba(var(--semi-white), 1);
        "
      >
        Drag me
      </div>
    </DragMove>
  </div>
</template>
