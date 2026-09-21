<script setup lang="ts">
import { Image } from '@aifuxi/semi-ui-vue/image';
import IconUploadError from '@aifuxi/semi-icons-vue/icons/IconUploadError';
import '@aifuxi/semi-theme-default/image.css';
</script>
<template>
  <div style="display: flex; flex-direction: column">
    <span>加载失败默认样式</span
    ><Image :width="200" :height="200" src="data:image/png;base64,broken" /><br /><span
      >自定义加载失败占位图</span
    ><Image :width="200" :height="200" src="data:image/png;base64,broken"
      ><template #fallback><IconUploadError style="font-size: 50px" /></template
    ></Image>
  </div>
</template>
