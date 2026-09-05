<script setup lang="ts">
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Image } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
import { IconPlus } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation, imageFiles } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const files = imageFiles();
files[0] = { ...files[0]!, url: '/demos/photo.svg' };
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    list-type="picture"
    accept="image/*"
    multiple
    :default-file-list="files"
    :pic-height="110"
    :pic-width="200"
    ><IconPlus size="extra-large" />点击添加图片<template #thumbnail="file"
      ><Image :src="file.url!" :width="200" :height="110" /></template
  ></Upload>
</template>
