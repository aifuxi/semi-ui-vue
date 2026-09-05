<script setup lang="ts">
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';
import { shallowRef, computed } from 'vue';
import type { SliderValue } from '@aifuxi/semi-ui-vue/slider';
const value = shallowRef([20, 60]);
function changeValue(next: SliderValue) {
  if (Array.isArray(next)) value.value = next;
}
const railStyle = computed(() => {
  const positions = value.value.map((v) => Number(((v - 10) / 90).toFixed(2)) * 100);
  return {
    background: `linear-gradient(to right, var(--semi-color-danger) ${positions[0]}%, transparent ${positions[0]}%, transparent ${positions[1]}%, var(--semi-color-success) ${positions[1]}%)`,
  };
});
</script>

<template>
  <Slider range :min="10" :max="100" :value="value" :rail-style="railStyle" @change="changeValue" />
</template>
