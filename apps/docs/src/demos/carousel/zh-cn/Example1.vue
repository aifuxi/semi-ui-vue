<script setup lang="ts">
import { Carousel } from '@aifuxi/semi-ui-vue/carousel';
import '@aifuxi/semi-theme-default/carousel.css';
</script>

<template>
  <Carousel :auto-play="false" theme="dark" :style="{ width: '600px', height: '240px' }">
    <div class="slide">设计</div>
    <div class="slide">开发</div>
    <div class="slide">交付</div>
  </Carousel>
</template>
