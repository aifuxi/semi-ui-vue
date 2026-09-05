<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { Carousel, type CarouselMethods } from '@aifuxi/semi-ui-vue/carousel';

const activeIndex = shallowRef(0);
const carousel = useTemplateRef<CarouselMethods>('carousel');
import '@aifuxi/semi-theme-default/carousel.css';
</script>

<template>
  <Carousel
    ref="carousel"
    :active-index="activeIndex"
    :auto-play="false"
    @change="activeIndex = $event"
  >
    <div>First</div>
    <div>Second</div>
  </Carousel>
  <button @click="carousel?.prev()">Previous</button>
  <button @click="carousel?.next()">Next</button>
</template>
