<script setup lang="ts">
import { h } from 'vue';
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation, documentFiles } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const files = documentFiles();
const styledTitle = h(
  'span',
  { style: { color: 'var(--semi-color-primary)', fontWeight: 600 } },
  '📁 Important files',
);
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :default-file-list="files"
    file-list-title="Uploaded files"
    style="margin-bottom: 20px"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>Click to upload</Button
    ></Upload
  ><Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :default-file-list="files"
    :file-list-title="styledTitle"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>Click to upload</Button
    ></Upload
  >
</template>
