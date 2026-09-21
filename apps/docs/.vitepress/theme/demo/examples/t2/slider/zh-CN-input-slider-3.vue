<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';
import { shallowRef } from 'vue';
const value = shallowRef(10);
function getSliderValue(nextValue: unknown) {
  const next = Number(nextValue);
  if (!Number.isNaN(next)) value.value = next;
}
</script>

<template>
  <div>
    <div style="width: 320px; margin-right: 15px">
      <Slider :step="1" :value="value" @change="getSliderValue" />
    </div>
    <InputNumber :value="value" style="width: 100px" :min="0" :max="100" @change="getSliderValue" />
  </div>
</template>
