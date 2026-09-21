<script setup lang="ts">
import { Image } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
</script>
<template>
  <Image
    :width="300"
    :height="200"
    src="/demos/image-abstract-small.svg"
    :preview="{ src: '/demos/image-abstract-big.svg' }"
  />
</template>
