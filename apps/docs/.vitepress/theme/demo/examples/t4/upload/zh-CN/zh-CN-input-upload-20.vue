<script setup lang="ts">
import { h } from 'vue';
import { Upload, type UploadRenderFileItemProps } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Image } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
import { IconFile, IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation, imageFiles } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const files = imageFiles(2);
const previewFile = (file: UploadRenderFileItemProps) =>
  file.uid === '1' ? h(IconFile, { size: 'large' }) : h(Image, { src: file.url! });
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :default-file-list="files"
    :preview-file="previewFile"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>点击上传</Button
    ></Upload
  >
</template>
