<script setup lang="ts">
import { Upload, type UploadFileItem } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { IconEyeOpened, IconPlus } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation, imageFiles } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const files = imageFiles();
function preview(file: UploadFileItem) {
  if (file.url) window.open(file.url, 'imagePreview', 'width=300,height=300');
}
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    list-type="picture"
    show-pic-info
    accept="image/*"
    multiple
    :default-file-list="files"
    @preview-click="preview"
    ><IconPlus size="extra-large" /><template #picPreviewIcon
      ><IconEyeOpened style="color: var(--semi-color-white); font-size: 24px" /></template
  ></Upload>
</template>
