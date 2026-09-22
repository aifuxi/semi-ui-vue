<script setup lang="ts">
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { IconPlus } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation, imageFiles } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const files = imageFiles();
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    list-type="picture"
    accept="image/*"
    multiple
    :default-file-list="files"
    ><IconPlus size="extra-large"
  /></Upload>
</template>
