<script setup lang="ts">
import {
  hsvaToHslaString,
  hsvaToRgbaString,
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
const emit = defineEmits<{ change: [alpha: number] }>();
const root = useTemplateRef<HTMLDivElement>('root');
const state = reactive({
  handlePosition: (props.hsva.a * props.width - props.handleSize / 2) as number | null,
  isHandleGrabbing: false,
});
const background = computed(
  () =>
    `linear-gradient(90deg, ${hsvaToHslaString({ ...props.hsva, a: 0 })}, ${hsvaToHslaString({ ...props.hsva, a: 1 })})`,
);

function setPosition(event: MouseEvent): void {
  const rect = root.value?.getBoundingClientRect();
  if (!rect) return;
  const mousePosition = event.clientX - rect.x;
  emit('change', Number(Math.min(Math.max(mousePosition / props.width, 0), 1).toFixed(2)));
  state.handlePosition =
    mousePosition < 0 || mousePosition > props.width ? null : mousePosition - props.handleSize / 2;
}
function handleMouseDown(event: MouseEvent): void {
  setPosition(event);
  state.isHandleGrabbing = true;
  window.addEventListener('mousemove', setPosition);
  window.addEventListener('mouseup', handleMouseUp);
}
function handleMouseUp(): void {
  state.isHandleGrabbing = false;
  window.removeEventListener('mousemove', setPosition);
  window.removeEventListener('mouseup', handleMouseUp);
}

watch(
  () => [props.hsva.a, props.width, props.handleSize],
  () => (state.handlePosition = props.hsva.a * props.width - props.handleSize / 2),
);
onBeforeUnmount(handleMouseUp);
</script>

<template>
  <div
    ref="root"
    aria-label="Alpha"
    :aria-valuetext="`${roundColorPickerValue(props.hsva.a * 100)}%`"
    class="semi-colorPicker-alphaSlider alphaSliderWrapper"
    :style="{ width: `${props.width}px`, height: `${props.height}px` }"
    @mousedown="handleMouseDown"
  >
    <div class="semi-colorPicker-alphaSliderInner" :style="{ background }">
      <div
        class="semi-colorPicker-alphaHandle"
        :style="{
          width: `${props.handleSize}px`,
          height: `${props.handleSize}px`,
          left: state.handlePosition === null ? undefined : `${state.handlePosition}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: hsvaToRgbaString(props.hsva),
        }"
      />
    </div>
  </div>
</template>
