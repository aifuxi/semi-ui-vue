<script setup lang="ts">
import { Image, ImagePreview } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
const srcList = [
  '/demos/image-abstract.svg',
  '/demos/image-sky.svg',
  '/demos/image-greenleaf.svg',
  '/demos/image-colorful.svg',
];
</script>
<template>
  <ImagePreview
    ><Image
      v-for="(src, index) in srcList"
      :key="index"
      :src="src"
      :width="200"
      :alt="`lamp${index + 1}`"
      style="margin-right: 5px"
  /></ImagePreview>
</template>
