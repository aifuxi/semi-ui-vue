<script setup lang="ts">
import { Upload, type UploadAfterProps, type UploadAfterResult } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
function afterUpload({ response }: UploadAfterProps): UploadAfterResult {
  if (
    typeof response === 'object' &&
    response !== null &&
    'status_code' in response &&
    response.status_code === 200
  ) {
    return {
      autoRemove: false,
      status: 'uploadFail',
      validateMessage: 'Invalid content',
      name: 'RenameByServer.jpg',
      url: '/demos/photo.svg',
    };
  }
  return {};
}
</script>

<template>
  <Upload action="/demonstration-only" :custom-request="simulateUpload" :after-upload="afterUpload"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>Click to upload</Button
    ></Upload
  >
</template>
