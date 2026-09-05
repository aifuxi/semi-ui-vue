<script setup lang="ts">
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const showTooltip = { opts: { position: 'bottom' as const } };
</script>

<template>
  <Upload action="/demonstration-only" :custom-request="simulateUpload" :show-tooltip="showTooltip"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>Click to upload</Button
    ></Upload
  >
</template>
