<script setup lang="ts">
import { Button, Upload, type UploadFileItem } from '@workspace/ui';

const files: UploadFileItem[] = [
  { uid: 'guide', name: 'product-guide.pdf', size: '1.2MB', status: 'success' },
  { uid: 'cover', name: 'cover.png', size: '248.0KB', status: 'uploadFail' },
];

const pictureFiles: UploadFileItem[] = [
  {
    uid: 'preview',
    name: 'preview.svg',
    size: '1.0KB',
    status: 'success',
    preview: true,
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23608ff0"/%3E%3Cpath d="M18 68l18-20 13 13 12-16 18 23z" fill="white"/%3E%3C/svg%3E',
  },
];
</script>

<template>
  <div class="upload-scenario" data-testid="upload-vue">
    <Upload
      action="/upload"
      data-parity-target="upload-list-root"
      :default-file-list="files"
      prompt="PDF or PNG, up to 5 MB"
    >
      <Button>选择文件</Button>
    </Upload>
    <Upload
      action="/upload"
      data-parity-target="upload-picture-root"
      list-type="picture"
      :default-file-list="pictureFiles"
      :show-pic-info="true"
    >
      <span class="upload-scenario__plus">+</span>
    </Upload>
  </div>
</template>
