<script setup lang="ts">
import { shallowRef } from 'vue';
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { ImagePreview } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
import { IconDelete, IconDownload, IconEyeOpened, IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation, imageFiles } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const files = imageFiles();
const visible = shallowRef(false);
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :default-file-list="files"
    :item-style="{ width: '300px' }"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>点击上传</Button
    ><template #fileOperation="file"
      ><div style="display: flex; column-gap: 8px; padding: 0 8px">
        <Button
          type="tertiary"
          theme="borderless"
          size="small"
          aria-label="预览"
          @click="visible = true"
          ><template #icon><IconEyeOpened /></template></Button
        ><a :href="file.url" :download="file.name" aria-label="下载"><IconDownload /></a
        ><Button
          type="tertiary"
          theme="borderless"
          size="small"
          aria-label="删除"
          @click="file.onRemove"
          ><template #icon><IconDelete /></template
        ></Button></div></template></Upload
  ><ImagePreview v-model:visible="visible" :src="files[0]!.url!" />
</template>
