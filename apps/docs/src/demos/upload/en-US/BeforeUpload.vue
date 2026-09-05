<script setup lang="ts">
import {
  Upload,
  type UploadBeforeProps,
  type UploadBeforeResult,
} from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
let count = 0;
function transformFile(file: File) {
  return count === 0 ? new File([file], 'newFileName', { type: 'image/png' }) : file;
}
function beforeUpload({ file }: UploadBeforeProps): UploadBeforeResult {
  const shouldUpload = count++ > 0;
  return {
    autoRemove: false,
    ...(file.fileInstance ? { fileInstance: file.fileInstance } : {}),
    shouldUpload,
    ...(shouldUpload ? {} : { status: 'validateFail' }),
  };
}
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :transform-file="transformFile"
    :before-upload="beforeUpload"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>Synchronous validation</Button
    ></Upload
  >
</template>
