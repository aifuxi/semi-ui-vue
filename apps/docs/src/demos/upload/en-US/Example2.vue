<script setup lang="ts">
import type { UploadCustomRequestArgs } from '@aifuxi/semi-ui-vue/upload';
// Local simulation: selected files never leave this browser.
function simulateUpload({ onProgress, onSuccess }: UploadCustomRequestArgs) {
  onProgress({ total: 100, loaded: 100 });
  onSuccess({ success: true, demonstration: true });
}

import { shallowRef, useTemplateRef } from 'vue';
import { Upload, type UploadExposed, type UploadFileItem } from '@aifuxi/semi-ui-vue/upload';

const files = shallowRef<UploadFileItem[]>([]);
const upload = useTemplateRef<UploadExposed>('upload');
import '@aifuxi/semi-theme-default/upload.css';
</script>

<template>
  <Upload
    ref="upload"
    v-model="files"
    action="/demonstration-only"
    :custom-request="simulateUpload"
    upload-trigger="custom"
  >
    Select files
  </Upload>
  <button @click="upload?.upload()">Start upload</button>
</template>
