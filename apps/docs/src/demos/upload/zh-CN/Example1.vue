<script setup lang="ts">
import type { UploadCustomRequestArgs } from '@aifuxi/semi-ui-vue/upload';
// Local simulation: selected files never leave this browser.
function simulateUpload({ onProgress, onSuccess }: UploadCustomRequestArgs) {
  onProgress({ total: 100, loaded: 100 });
  onSuccess({ success: true, demonstration: true });
}

import { Button } from '@aifuxi/semi-ui-vue/button';
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    accept=".png,.pdf"
    :limit="3"
    @change="console.log"
  >
    <Button>选择文件</Button>
  </Upload>
</template>
