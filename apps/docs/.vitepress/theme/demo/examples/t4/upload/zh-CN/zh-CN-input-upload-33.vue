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
    drag-main-text="点击上传文件或拖拽文件到这里"
    drag-sub-text="仅支持jpeg、pdf"
    style="margin-top: 10px"
    ><template #dragIcon><IconBolt /></template
  ></Upload>
</template>
