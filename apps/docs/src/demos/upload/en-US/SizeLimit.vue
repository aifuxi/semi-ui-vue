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
    :max-size="1024"
    :min-size="200"
    @size-error="message = $event.name + ' size invalid'"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>Upload (200KB–1MB)</Button
    ></Upload
  >
  <p role="status">{{ message }}</p>
</template>
