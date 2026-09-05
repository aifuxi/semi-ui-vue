<script setup lang="ts">
import { shallowRef } from 'vue';
import { Slider } from '@aifuxi/semi-ui-vue/slider';

const range = shallowRef<number[]>([20, 60]);
const marks = { 0: '0', 20: '20°C', 50: '50°C', 100: '100°C' };
import '@aifuxi/semi-theme-default/slider.css';
</script>

<template>
  <Slider v-model="range" range :step="10" :marks="marks" tooltip-on-mark />
</template>
