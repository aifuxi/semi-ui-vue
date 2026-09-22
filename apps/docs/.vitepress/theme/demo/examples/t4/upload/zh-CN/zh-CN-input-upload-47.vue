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
    :crop="{ aspectRatio: 1, shape: 'rect' }"
    draggable
    @success="message = '上传成功'"
    @drop="(_, files) => (message = files.map((file) => file.name).join(', '))"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>拖拽上传并裁切</Button
    ></Upload
  >
  <p role="status">{{ message }}</p>
</template>
