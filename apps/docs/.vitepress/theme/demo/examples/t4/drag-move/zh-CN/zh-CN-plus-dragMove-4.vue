<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { DragMove } from '@aifuxi/semi-ui-vue/drag-move';
import '@aifuxi/semi-theme-default/drag-move.css';
import { IconTransparentStroked } from '@aifuxi/semi-icons-vue';
const container = useTemplateRef<HTMLElement>('container');
const handler = useTemplateRef<HTMLElement>('handler');
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
    <DragMove :constrainer="() => container" :handler="() => handler">
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
          top: 50px;
          left: 50px;
        "
      >
        <div ref="handler" style="width: fit-content; height: fit-content">
          <IconTransparentStroked size="large" />
        </div>
      </div>
    </DragMove>
  </div>
</template>
