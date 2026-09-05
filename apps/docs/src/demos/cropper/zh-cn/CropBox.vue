<script setup lang="ts">
import { useTemplateRef, shallowRef } from 'vue';
import { Cropper, type CropperMethods } from '@aifuxi/semi-ui-vue/cropper';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/cropper.css';
import '@aifuxi/semi-theme-default/button.css';
const cropper = useTemplateRef<CropperMethods>('cropper');
const cropperUrl = shallowRef('');
function crop() {
  cropperUrl.value = cropper.value!.getCropperCanvas().toDataURL();
}
</script>
<template>
  <div>
    <strong>showResizeBox = false，并修改边框颜色</strong
    ><Cropper
      ref="cropper"
      src="/demos/photo.svg"
      style="width: 550px; height: 300px; margin: 20px"
      :show-resize-box="false"
      :cropper-box-style="{ outlineColor: 'var(--semi-color-bg-0)' }"
    /><Button @click="crop">裁切</Button><br /><br /><img
      v-if="cropperUrl"
      :src="cropperUrl"
      style="height: 400px"
      alt="Cropped image"
    />
  </div>
</template>
