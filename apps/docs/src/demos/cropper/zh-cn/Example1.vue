<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { Cropper, type CropperMethods } from '@aifuxi/semi-ui-vue/cropper';
import '@aifuxi/semi-theme-default/cropper.css';

const zoom = shallowRef(1);
const rotate = shallowRef(0);
const cropper = useTemplateRef<CropperMethods>('cropper');

function exportImage() {
  const dataUrl = cropper.value?.getCropperCanvas().toDataURL('image/png');
  console.log(dataUrl);
}
</script>

<template>
  <Cropper
    ref="cropper"
    v-model:zoom="zoom"
    src="/demos/photo.svg"
    :rotate="rotate"
    :aspect-ratio="4 / 3"
    style="width: 550px; height: 300px"
  />
  <button type="button" @click="exportImage">裁切</button>
</template>
