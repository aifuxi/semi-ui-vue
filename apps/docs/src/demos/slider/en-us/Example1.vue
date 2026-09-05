<script setup lang="ts">
import { shallowRef } from 'vue';
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';

const value = shallowRef(30);
</script>

<template>
  <Slider v-model="value" aria-label="Volume" />
</template>
