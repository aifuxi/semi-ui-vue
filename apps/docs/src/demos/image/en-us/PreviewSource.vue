<script setup lang="ts">
import { Image } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
</script>
<template>
  <Image
    :width="300"
    :height="200"
    src="/demos/photo.svg?preview=1"
    :preview="{ src: '/demos/photo.svg?full=1' }"
    alt="Sample image"
  />
</template>
