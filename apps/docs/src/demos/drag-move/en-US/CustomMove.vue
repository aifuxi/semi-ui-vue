<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { DragMove } from '@aifuxi/semi-ui-vue/drag-move';
import '@aifuxi/semi-theme-default/drag-move.css';
const container = useTemplateRef<HTMLElement>('container');
const element = useTemplateRef<HTMLElement>('element');
let startPoint: { x: number; y: number } | null = null;
function customMove(node: HTMLElement, top: number, left: number) {
  if (!container.value) return;
  if (left + 100 > container.value.offsetWidth) {
    node.style.right = `${container.value.offsetWidth - left - node.offsetWidth}px`;
    node.style.left = 'auto';
  } else {
    node.style.left = `${left}px`;
  }
  node.style.top = `${top}px`;
}
function onMouseDown(event: MouseEvent) {
  startPoint = { x: event.clientX, y: event.clientY };
}
function onMouseUp(event: MouseEvent) {
  if (
    startPoint &&
    element.value &&
    Math.abs(event.clientX - startPoint.x) < 5 &&
    Math.abs(event.clientY - startPoint.y) < 5
  ) {
    element.value.style.width = element.value.style.width === '50px' ? '100px' : '50px';
  }
  startPoint = null;
}
</script>
<template>
  <span
    >Click on the blue color block to change the width. The blue color block will not exceed the
    range limit before and after the change.</span
  ><br /><br />
  <div
    ref="container"
    style="
      background-color: rgba(var(--semi-grey-2), 1);
      width: 300px;
      height: 300px;
      position: relative;
      padding: 10px;
      color: rgba(var(--semi-white), 1);
      font-weight: 500;
    "
  >
    <span>Constrainer</span>
    <DragMove :constrainer="() => container" :custom-move="customMove">
      <div
        ref="element"
        style="
          background-color: var(--semi-color-primary);
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 50px;
          left: 50px;
          border-radius: 10px;
          padding: 5px;
        "
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
      >
        Drag me
      </div>
    </DragMove>
  </div>
</template>
