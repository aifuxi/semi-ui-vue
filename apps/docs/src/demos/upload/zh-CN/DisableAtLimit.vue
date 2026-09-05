<script setup lang="ts">
import { shallowRef, computed } from 'vue';
import { Upload, type UploadFileItem } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const files = shallowRef<UploadFileItem[]>([]);
const disabled = computed(() => files.value.length === 2);
const message = shallowRef('');
</script>

<template>
  <Upload
    v-model="files"
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :limit="2"
    @exceed="message = '最多只允许上传2个文件'"
    ><Button theme="light" :disabled="disabled"
      ><template #icon><IconUpload /></template>点击上传（最多 2 项）</Button
    ></Upload
  >
  <p role="status">{{ message }}</p>
</template>
