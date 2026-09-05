<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { Upload, type UploadExposed } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconPlus, IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const uploadRef = useTemplateRef<UploadExposed>('upload');
const message = shallowRef('');
</script>

<template>
  <Upload
    ref="upload"
    action="/demonstration-only"
    :custom-request="simulateUpload"
    accept="image/gif,image/png,image/jpeg,image/bmp,image/webp"
    upload-trigger="custom"
    @success="message = '上传成功'"
    @error="message = '上传失败'"
    ><Button theme="light"
      ><template #icon><IconPlus /></template>选择文件</Button
    ></Upload
  ><Button theme="light" @click="uploadRef?.upload()"
    ><template #icon><IconUpload /></template>开始上传</Button
  >
  <p role="status">{{ message }}</p>
</template>
