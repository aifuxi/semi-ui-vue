<script setup lang="ts">
import { shallowRef } from 'vue';
import { Upload, type UploadFileItem } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation, imageFiles } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const files = shallowRef<UploadFileItem[]>(imageFiles(2));
files.value[1] = { ...files.value[1]!, status: 'uploading', percent: 50 };
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :file-list="files"
    :show-retry="false"
    @change="files = [...$event.fileList]"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>Click to upload</Button
    ></Upload
  >
</template>
