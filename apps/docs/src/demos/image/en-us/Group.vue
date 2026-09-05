<script setup lang="ts">
import { Image, ImagePreview } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
const srcList = ['/demos/photo.svg', '/demos/one.svg', '/demos/two.svg', '/demos/poster.svg'];
</script>
<template>
  <ImagePreview
    ><Image
      v-for="(src, index) in srcList"
      :key="index"
      :src="src"
      :width="200"
      :alt="`Sample image ${index + 1}`"
      style="margin-right: 5px"
  /></ImagePreview>
</template>
