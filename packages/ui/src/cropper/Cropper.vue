<script setup lang="ts">
import { cropperStrings } from '@workspace/foundation-integration';
import { computed, useAttrs, useTemplateRef, watchEffect, type CSSProperties } from 'vue';

import type { CropperEmits, CropperMethods, CropperProps } from './types';
import { useCropperFoundation } from './use-cropper-foundation';

defineOptions({ name: 'Cropper', inheritAttrs: false });
const props = withDefaults(defineProps<CropperProps>(), {
  defaultAspectRatio: 1,
  fill: 'rgba(0, 0, 0, 0)',
  maxZoom: 3,
  minZoom: 0.1,
  shape: 'rect',
  showResizeBox: true,
  zoomStep: 0.1,
});
const emit = defineEmits<CropperEmits>();
const attrs = useAttrs();
const containerRef = useTemplateRef<HTMLDivElement>('container');
const imageRef = useTemplateRef<HTMLImageElement>('image');
const { foundation, state } = useCropperFoundation(props, containerRef, imageRef, emit);

const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style'].includes(name))),
);
const imgX = computed(() => state.imgData.centerPoint.x - state.imgData.width / 2);
const imgY = computed(() => state.imgData.centerPoint.y - state.imgData.height / 2);
const cropperBoxX = computed(() => state.cropperBox.centerPoint.x - state.cropperBox.width / 2);
const cropperBoxY = computed(() => state.cropperBox.centerPoint.y - state.cropperBox.height / 2);
const cropperImgX = computed(() => imgX.value - cropperBoxX.value);
const cropperImgY = computed(() => imgY.value - cropperBoxY.value);
const imageStyle = computed<CSSProperties>(() => ({
  width: `${state.imgData.width}px`,
  height: `${state.imgData.height}px`,
  transformOrigin: 'center',
  transform: `translate(${imgX.value}px, ${imgY.value}px) rotate(${state.rotate}deg)`,
}));
const cropperImageStyle = computed<CSSProperties>(() => ({
  width: `${state.imgData.width}px`,
  height: `${state.imgData.height}px`,
  transformOrigin: 'center',
  transform: `translate(${cropperImgX.value}px, ${cropperImgY.value}px) rotate(${state.rotate}deg)`,
}));
const cropperBoxStyle = computed(() => [
  props.cropperBoxStyle,
  {
    width: `${state.cropperBox.width}px`,
    height: `${state.cropperBox.height}px`,
    transform: `translate(${cropperBoxX.value}px, ${cropperBoxY.value}px)`,
  },
]);
const corners = computed(() =>
  props.shape === 'round' ? cropperStrings.roundCorner : cropperStrings.corner,
);

watchEffect(() => {
  foundation.updatePreview({
    width: state.imgData.width,
    height: state.imgData.height,
    translateX: cropperImgX.value,
    translateY: cropperImgY.value,
    rotate: state.rotate,
  });
});

function getCropperCanvas(): HTMLCanvasElement {
  return foundation.getCropperCanvas();
}

defineExpose<CropperMethods>({ getCropperCanvas });
</script>

<template>
  <div
    v-bind="rootAttrs"
    ref="container"
    class="semi-cropper"
    :class="[attrs.class, props.class, props.className]"
    :style="[attrs.style, props.style]"
  >
    <div class="semi-cropper-img-wrapper">
      <img
        ref="image"
        class="semi-cropper-img"
        crossorigin="anonymous"
        :src="props.src"
        :style="imageStyle"
        @load="foundation.handleImageLoad"
      />
    </div>
    <div class="semi-cropper-mask" @mousedown="foundation.handleMaskMouseDown" />
    <div
      class="semi-cropper-box"
      :class="[
        props.cropperBoxCls ?? props.cropperBoxClassName,
        props.shape === 'round' ? 'semi-cropper-view-box-round' : undefined,
      ]"
      :style="cropperBoxStyle"
      @mousedown="foundation.handleCropperBoxMouseDown"
    >
      <div
        class="semi-cropper-view-box"
        :class="props.shape.includes('round') ? 'semi-cropper-view-box-round' : undefined"
      >
        <img
          class="semi-cropper-view-img"
          :src="props.src"
          :style="cropperImageStyle"
          @dragstart="foundation.viewIMGDragStart"
        />
      </div>
      <div
        v-for="corner in state.loaded && props.showResizeBox ? corners : []"
        :key="corner"
        class="semi-cropper-box-corner"
        :class="`semi-cropper-box-corner-${corner}`"
        :data-dir="corner"
        @mousedown="foundation.handleCornerMouseDown"
      />
    </div>
  </div>
</template>
