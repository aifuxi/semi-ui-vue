<script setup lang="ts">
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { IconBolt } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    draggable
    accept="application/pdf,.jpeg"
    drag-main-text="Click to upload or drag files here"
    drag-sub-text="JPEG and PDF only"
    style="margin-top: 10px"
    ><template #dragIcon><IconBolt /></template
  ></Upload>
</template>
