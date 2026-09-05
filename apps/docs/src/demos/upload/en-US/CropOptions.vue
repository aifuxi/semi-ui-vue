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
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :crop-modal-props="{ bodyStyle: { height: '400px' } }"
    :crop="{
      aspectRatio: 16 / 9,
      shape: 'rect',
      quality: 0.8,
      modalTitle: 'Crop image',
      modalOkText: 'Confirm crop',
      modalCancelText: 'Cancel',
    }"
    @success="message = 'Upload succeeded'"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>16:9 crop</Button
    ></Upload
  >
  <p role="status">{{ message }}</p>
</template>
