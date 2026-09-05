<script setup lang="ts">
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation, imageFiles } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const files = imageFiles(2);
files[1] = { ...files[1]!, status: 'validateFail' };
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    disabled
    :default-file-list="files"
    ><Button theme="light" disabled
      ><template #icon><IconUpload /></template>Click to upload</Button
    ></Upload
  >
</template>
