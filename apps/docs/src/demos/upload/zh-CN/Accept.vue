<script setup lang="ts">
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    accept="image/*"
    style="margin-bottom: 12px"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>上传图片</Button
    ></Upload
  ><Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    accept="video/*"
    style="margin-bottom: 12px"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>上传视频</Button
    ></Upload
  ><Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    accept=".pdf,.png,.jpeg"
    style="margin-bottom: 12px"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>PDF, PNG, JPEG</Button
    ></Upload
  >
</template>
