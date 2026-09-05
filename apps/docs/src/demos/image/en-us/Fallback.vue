<script setup lang="ts">
import { Image } from '@aifuxi/semi-ui-vue/image';
import IconUploadError from '@aifuxi/semi-icons-vue/icons/IconUploadError';
import '@aifuxi/semi-theme-default/image.css';
</script>
<template>
  <div style="display: flex; align-items: center; flex-direction: column">
    <span>Failed to load default style</span
    ><Image
      :width="200"
      :height="200"
      src="data:image/png;base64,broken"
      alt="Sample image"
    /><br /><span>Custom loading failed placeholder map</span
    ><Image :width="200" :height="200" src="data:image/png;base64,broken" alt="Sample image"
      ><template #fallback><IconUploadError style="font-size: 50px" /></template
    ></Image>
  </div>
</template>
