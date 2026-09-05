<script setup lang="ts">
import { useTemplateRef, shallowRef } from 'vue';
import { Cropper, type CropperMethods } from '@aifuxi/semi-ui-vue/cropper';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/cropper.css';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/slider.css';
const cropper = useTemplateRef<CropperMethods>('cropper');
const cropperUrl = shallowRef('');
function crop() {
  cropperUrl.value = cropper.value!.getCropperCanvas().toDataURL();
}
const rotate = shallowRef(0);
const zoom = shallowRef(1);
const previewContainer = useTemplateRef<HTMLElement>('previewContainer');
const preview = () => previewContainer.value!;
</script>
<template>
  <div>
    <Cropper
      ref="cropper"
      v-model:zoom="zoom"
      src="/demos/photo.svg"
      style="width: 550px; height: 300px; margin: 20px"
      :rotate="rotate"
      :preview="preview"
    />
    <div
      style="
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
      "
    >
      <span>旋转</span
      ><Slider v-model="rotate" style="width: 500px" :step="1" :min="-360" :max="360" />
    </div>
    <div
      style="
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
      "
    >
      <span>缩放</span
      ><Slider v-model="zoom" style="width: 500px" :step="0.1" :min="0.1" :max="3" />
    </div>
    <br />
    <div style="display: flex">
      <div style="width: 50%; flex-grow: 1">
        <strong>实时预览</strong>
        <div ref="previewContainer" style="height: 300px; margin-top: 8px" />
      </div>
      <div style="width: 50%; flex-grow: 1; padding-left: 10px">
        <Button @click="crop">裁切</Button><br /><br /><img
          v-if="cropperUrl"
          :src="cropperUrl"
          style="width: 90%"
          alt="Cropped image"
        />
      </div>
    </div>
  </div>
</template>
