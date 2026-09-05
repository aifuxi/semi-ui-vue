<script setup lang="ts">
import { Upload, type UploadPromptPosition } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { IconPlus } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation, imageFiles } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const positions: UploadPromptPosition[] = ['right', 'bottom'];
const files = imageFiles(2);
files[1] = { ...files[1]!, status: 'uploading', percent: 50 };
</script>

<template>
  <template v-for="(position, index) in positions" :key="position"
    ><div v-if="index" style="margin: 12px 0; border-bottom: 1px solid var(--semi-color-border)" />
    <Upload
      action="/demonstration-only"
      :custom-request="simulateUpload"
      :prompt-position="position"
      list-type="picture"
      :default-file-list="files"
      ><IconPlus size="extra-large" /><template #prompt
        ><div
          :style="{
            display: 'flex',
            alignItems: 'center',
            color: 'grey',
            height: '100%',
            marginRight: position === 'left' ? '10px' : undefined,
            marginLeft: position === 'right' ? '10px' : undefined,
          }"
        >
          Please upload certification materials
        </div></template
      ></Upload
    ></template
  >
</template>
