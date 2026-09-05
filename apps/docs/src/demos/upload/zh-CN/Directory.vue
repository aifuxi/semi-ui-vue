<script setup lang="ts">
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
</script>

<template>
  <Upload action="/demonstration-only" :custom-request="simulateUpload" directory
    ><Button theme="light"
      ><template #icon><IconUpload /></template>上传文件夹</Button
    ></Upload
  >
</template>
