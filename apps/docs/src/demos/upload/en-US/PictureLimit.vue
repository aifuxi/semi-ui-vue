<script setup lang="ts">
import { shallowRef } from 'vue';
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { IconPlus } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation, imageFiles } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const files = imageFiles(2);
const message = shallowRef('');
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :limit="2"
    list-type="picture"
    accept="image/*"
    :default-file-list="files"
    @exceed="message = 'At most 2 files'"
    ><IconPlus size="extra-large"
  /></Upload>
  <p role="status">{{ message }}</p>
</template>
