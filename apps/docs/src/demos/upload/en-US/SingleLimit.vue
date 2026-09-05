<script setup lang="ts">
import { shallowRef } from 'vue';
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const count = shallowRef(0);
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :limit="1"
    @change="count = $event.fileList.length"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>Upload (1 file maximum)</Button
    ></Upload
  >
  <p role="status">Selected: {{ count }}</p>
</template>
