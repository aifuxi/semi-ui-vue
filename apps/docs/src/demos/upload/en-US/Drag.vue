<script setup lang="ts">
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    draggable
    drag-main-text="Click to upload or drag files here"
    drag-sub-text="Any file type"
  ></Upload>
</template>
