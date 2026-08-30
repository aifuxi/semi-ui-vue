<script setup lang="ts">
import {
  hsvaToHslString,
  hsvaToRgba,
  roundColorPickerValue,
} from '@workspace/foundation-integration';
import { computed, onBeforeUnmount, reactive, useTemplateRef, watch } from 'vue';

import type { HsvaColor } from './types';

interface Props {
  handleSize: number;
  height: number;
  hsva: HsvaColor;
  width: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{ change: [value: { s: number; v: number }] }>();
const root = useTemplateRef<HTMLDivElement>('root');
const state = reactive({
  handlePosition: getHandlePosition(),
  isHandleGrabbing: false,
});

const areaBackground = computed(() => hsvaToHslString({ h: props.hsva.h, s: 100, v: 100, a: 1 }));
const currentColor = computed(() => hsvaToRgba(props.hsva));
const ariaValueText = computed(
  () =>
    `Saturation ${roundColorPickerValue(props.hsva.s)}%, Brightness ${roundColorPickerValue(props.hsva.v)}%`,
);

function getHandlePosition(): { x: number; y: number } {
  return {
    x: (props.hsva.s / 100) * props.width - props.handleSize / 2,
    y: (1 - props.hsva.v / 100) * props.height - props.handleSize / 2,
  };
}

function setPosition(event: MouseEvent): void {
  const rect = root.value?.getBoundingClientRect();
  if (!rect) return;
  const mousePosition = { x: event.clientX - rect.x, y: event.clientY - rect.y };
  if (
    mousePosition.x > props.width ||
    mousePosition.x < 0 ||
    mousePosition.y > props.height ||
    mousePosition.y < 0
  ) {
    return;
  }
  state.handlePosition = {
    x: mousePosition.x - props.handleSize / 2,
    y: mousePosition.y - props.handleSize / 2,
  };
  emit('change', {
    s: Math.round((mousePosition.x / props.width) * 100),
    v: Math.round(100 - Math.min(Math.max(mousePosition.y / props.height, 0), 1) * 100),
  });
}

function handleMouseDown(event: MouseEvent): void {
  setPosition(event);
  state.isHandleGrabbing = true;
  root.value?.addEventListener('mousemove', setPosition);
  window.addEventListener('mouseup', handleMouseUp);
}

function handleMouseUp(): void {
  state.isHandleGrabbing = false;
  root.value?.removeEventListener('mousemove', setPosition);
  window.removeEventListener('mouseup', handleMouseUp);
}

watch(
  () => props.hsva,
  () => (state.handlePosition = getHandlePosition()),
  { deep: true },
);
onBeforeUnmount(handleMouseUp);
</script>

<template>
  <div
    ref="root"
    aria-label="Color"
    :aria-valuetext="ariaValueText"
    class="semi-colorPicker-colorChooseArea"
    :style="{
      backgroundColor: areaBackground,
      width: `${props.width}px`,
      height: `${props.height}px`,
      cursor: state.isHandleGrabbing ? 'grabbing' : 'pointer',
    }"
    @mousedown="handleMouseDown"
  >
    <div
      class="semi-colorPicker-handle"
      :style="{
        width: `${props.handleSize}px`,
        height: `${props.handleSize}px`,
        left: `${state.handlePosition.x}px`,
        top: `${state.handlePosition.y}px`,
        backgroundColor: `rgba(${currentColor.r},${currentColor.g},${currentColor.b},${currentColor.a})`,
      }"
    />
  </div>
</template>
