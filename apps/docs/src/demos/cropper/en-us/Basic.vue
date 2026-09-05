<script setup lang="ts">
import { useTemplateRef, shallowRef } from 'vue';
import { Cropper, type CropperMethods } from '@aifuxi/semi-ui-vue/cropper';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/cropper.css';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/radio.css';
const cropper = useTemplateRef<CropperMethods>('cropper');
const cropperUrl = shallowRef('');
function crop() {
  cropperUrl.value = cropper.value!.getCropperCanvas().toDataURL();
}
const shape = shallowRef<'rect' | 'round' | 'roundRect'>('rect');
</script>
<template>
  <div>
    <RadioGroup v-model="shape"
      ><Radio value="rect">rect</Radio><Radio value="round">round</Radio
      ><Radio value="roundRect">roundRect</Radio></RadioGroup
    ><Cropper
      ref="cropper"
      src="/demos/photo.svg"
      style="width: 550px; height: 300px; margin: 20px"
      :shape="shape"
    /><Button @click="crop">Get Cropped Image</Button><br /><br /><img
      v-if="cropperUrl"
      :src="cropperUrl"
      style="height: 400px"
      alt="Cropped image"
    />
  </div>
</template>
