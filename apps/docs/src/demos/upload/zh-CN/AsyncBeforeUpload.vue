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
function beforeUpload({ file }: UploadBeforeProps): Promise<UploadBeforeResult> {
  const index = ++count;
  if (index > 2) return Promise.resolve({ autoRemove: false, shouldUpload: true });
  return Promise.reject({
    autoRemove: false,
    fileInstance: file.fileInstance,
    status: 'validateFail',
    shouldUpload: false,
    validateMessage: `第 ${index} 个注定失败`,
  });
}
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :before-upload="beforeUpload"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>上传前异步校验</Button
    ></Upload
  >
</template>
