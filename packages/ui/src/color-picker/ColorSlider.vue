<script setup lang="ts">
import { hsvaToHslString } from '@workspace/foundation-integration';
import { computed, onBeforeUnmount, reactive, useTemplateRef, watch } from 'vue';

interface Props {
  handleSize: number;
  height: number;
  hue: number;
  width: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{ change: [hue: number] }>();
const root = useTemplateRef<HTMLDivElement>('root');
const state = reactive({
  handlePosition: ((props.hue / 360) * props.width - props.handleSize / 2) as number | null,
  isHandleGrabbing: false,
});
const handleColor = computed(() => hsvaToHslString({ h: props.hue, s: 100, v: 100, a: 1 }));

function setPosition(event: MouseEvent): void {
  const rect = root.value?.getBoundingClientRect();
  if (!rect) return;
  const mousePosition = event.clientX - rect.x;
  emit('change', Math.round(Math.min(Math.max(mousePosition / props.width, 0), 1) * 360));
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
  () => [props.hue, props.width, props.handleSize],
  () => (state.handlePosition = (props.hue / 360) * props.width - props.handleSize / 2),
);
onBeforeUnmount(handleMouseUp);
</script>

<template>
  <div
    ref="root"
    class="semi-colorPicker-colorSlider colorSliderWrapper"
    :style="{ width: `${props.width}px`, height: `${props.height}px` }"
    @mousedown="handleMouseDown"
  >
    <div
      class="semi-colorPicker-handle"
      :style="{
        width: `${props.handleSize}px`,
        height: `${props.handleSize}px`,
        left: state.handlePosition === null ? undefined : `${state.handlePosition}px`,
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: handleColor,
      }"
    />
  </div>
</template>
