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
    :crop-modal-props="{ bodyStyle: { height: '400px' } }"
    :crop="{
      aspectRatio: 16 / 9,
      shape: 'rect',
      quality: 0.8,
      modalTitle: '裁切图片',
      modalOkText: '确认裁切',
      modalCancelText: '取消',
    }"
    @success="message = '上传成功'"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>16:9 裁切</Button
    ></Upload
  >
  <p role="status">{{ message }}</p>
</template>
