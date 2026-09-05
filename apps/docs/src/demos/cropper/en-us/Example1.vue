<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { Cropper, type CropperMethods } from '@aifuxi/semi-ui-vue/cropper';
import '@aifuxi/semi-theme-default/cropper.css';

const zoom = shallowRef(1);
const cropper = useTemplateRef<CropperMethods>('cropper');

function exportImage() {
  console.log(cropper.value?.getCropperCanvas().toDataURL('image/png'));
}
</script>

<template>
  <Cropper
    ref="cropper"
    v-model:zoom="zoom"
    src="/demos/photo.svg"
    :rotate="0"
    :aspect-ratio="4 / 3"
    style="width: 550px; height: 300px"
  />
  <button type="button" @click="exportImage">Crop</button>
</template>
