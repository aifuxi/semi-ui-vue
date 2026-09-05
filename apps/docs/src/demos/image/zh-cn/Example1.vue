<script setup lang="ts">
import { Image, ImagePreview } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
</script>

<template>
  <ImagePreview :lazy-load="false">
    <Image src="/demos/one.svg" :width="160" :height="100" :preview="{ previewTitle: '第一张' }" />
    <Image src="/demos/two.svg" :width="160" :height="100" :preview="{ previewTitle: '第二张' }" />
  </ImagePreview>
</template>
