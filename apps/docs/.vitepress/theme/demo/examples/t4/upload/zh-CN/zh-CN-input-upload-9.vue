<script setup lang="ts">
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const data = { role: 'ies', time: 1725494400000 };
const headers = { 'x-tt-semi': 'semi-upload' };
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :data="data"
    :headers="headers"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>点击上传</Button
    ></Upload
  >
</template>
