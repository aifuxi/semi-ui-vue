<script setup lang="ts">
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconClose, IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation, documentFiles } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const files = documentFiles();
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    :default-file-list="files"
    style="margin-bottom: 20px"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>点击上传</Button
    ><template #fileListTitle="{ fileList, onClear, clearText }"
      ><div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
        <span style="color: var(--semi-color-primary)">📂 {{ fileList.length }} 个文件</span
        ><Button size="small" type="danger" @click="onClear"
          ><template #icon><IconClose /></template>{{ clearText }}</Button
        >
      </div></template
    ></Upload
  ><Upload action="/demonstration-only" :custom-request="simulateUpload" :default-file-list="files"
    ><Button theme="light"
      ><template #icon><IconUpload /></template>点击上传</Button
    ><template #fileListTitle="{ fileList, onClear }"
      ><div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
        <span
          >已选择
          <strong style="color: var(--semi-color-danger)">{{ fileList.length }}</strong>
          个文件</span
        ><button
          type="button"
          style="
            cursor: pointer;
            color: var(--semi-color-link);
            font-size: 12px;
            border: 0;
            background: transparent;
          "
          @click="onClear"
        >
          全部移除
        </button>
      </div></template
    ></Upload
  >
</template>
