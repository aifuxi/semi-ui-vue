<script setup lang="ts">
import { Carousel } from '@aifuxi/semi-ui-vue/carousel';
import '@aifuxi/semi-theme-default/carousel.css';
</script>

<template>
  <Carousel :auto-play="false" theme="dark" :style="{ width: '600px', height: '240px' }">
    <div class="slide">Design</div>
    <div class="slide">Build</div>
    <div class="slide">Ship</div>
  </Carousel>
</template>
