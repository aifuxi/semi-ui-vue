<script setup lang="ts">
import { Upload, type UploadPromptPosition } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const positions: UploadPromptPosition[] = ['right', 'left', 'bottom'];
</script>

<template>
  <template v-for="(position, index) in positions" :key="position"
    ><div v-if="index" style="margin: 12px 0; border-bottom: 1px solid var(--semi-color-border)" />
    <Upload
      action="/demonstration-only"
      :custom-request="simulateUpload"
      :prompt-position="position"
      ><Button theme="light"
        ><template #icon><IconUpload /></template>点击上传</Button
      ><template #prompt
        ><div
          :style="{
            display: 'flex',
            alignItems: 'center',
            color: 'grey',
            height: '32px',
            marginRight: position === 'left' ? '10px' : undefined,
            marginLeft: position === 'right' ? '10px' : undefined,
          }"
        >
          请上传认证材料
        </div></template
      ></Upload
    ></template
  >
</template>
