<script setup lang="ts">
import { shallowRef } from 'vue';
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const message = shallowRef('');
function beforeCrop() {
  return window.confirm('Crop this image?');
}
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :crop-modal-props="{ bodyStyle: { height: '400px' } }"
    :crop="{ aspectRatio: 1, shape: 'round' }"
    :before-crop="beforeCrop"
    @success="message = 'Upload succeeded'"
    @crop-error="message = $event.message"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>Confirm before cropping</Button
    ></Upload
  >
  <p role="status">{{ message }}</p>
</template>
