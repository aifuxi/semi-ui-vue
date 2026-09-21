<script setup lang="ts">
import { shallowRef } from 'vue';
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const message = shallowRef('');
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :crop="{ aspectRatio: 1, shape: 'rect' }"
    :crop-modal-props="{
      width: 800,
      style: { height: '600px' },
      bodyStyle: { height: '500px', backgroundColor: '#f5f5f5' },
    }"
    @success="message = '上传成功'"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>自定义裁切弹窗</Button
    ></Upload
  >
  <p role="status">{{ message }}</p>
</template>
