<script setup lang="ts">
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';
</script>

<template>
  <div>
    <Slider :tip-formatter="(v) => `${v}%`" :get-aria-value-text="(v) => `${v}%`"></Slider>
    <br />
    <br />
    <Slider :tip-formatter="null"></Slider>
  </div>
</template>
