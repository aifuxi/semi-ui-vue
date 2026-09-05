<script setup lang="ts">
import { shallowRef } from 'vue';
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import { IconCamera } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const url = shallowRef('/demos/one.svg');
const message = shallowRef('');
function success() {
  url.value = '/demos/two.svg';
  message.value = 'Avatar updated';
}
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    class="avatar-upload"
    accept="image/*"
    :show-upload-list="false"
    @success="success"
    @error="message = 'Upload failed'"
    ><Avatar :src="url" style="margin: 4px"
      ><template #hoverMask
        ><div
          style="
            background-color: var(--semi-color-overlay-bg);
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--semi-color-white);
          "
        >
          <IconCamera /></div></template></Avatar
  ></Upload>
  <p role="status">{{ message }}</p>
</template>

<style scoped>
.avatar-upload :deep(.semi-upload-add) {
  border-radius: 50%;
}
</style>
