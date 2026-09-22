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
    drag-main-text="点击上传文件或拖拽文件到这里"
    drag-sub-text="支持任意类型文件"
  ></Upload>
</template>
