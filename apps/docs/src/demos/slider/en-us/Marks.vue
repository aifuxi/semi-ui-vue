<script setup lang="ts">
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';
</script>

<template>
  <div>
    <div>step=10</div>
    <Slider
      :step="10"
      :marks="{ 0: '0', 10: '10', 20: '20', 30: '30', 40: '40', 50: '50', 100: '100' }"
      :default-value="[10, 100]"
      :range="true"
    ></Slider>
    <br />
    <br />
    <div>step=0.1</div>
    <Slider
      :step="0.1"
      :marks="{ 0.1: '0.1', 0.2: '0.2', 0.3: '0.3', 0.4: '0.4', 0.5: '0.5' }"
      :min="0"
      :max="1"
      :default-value="[0.1, 0.5]"
      :range="true"
    ></Slider>
    <br />
    <br />
    <div>Marks</div>
    <Slider
      :marks="{ 20: '20\xB0C', 40: '40\xB0C' }"
      :default-value="[0, 100]"
      :range="true"
      :tip-formatter="(v) => `${v}°C`"
      :get-aria-value-text="(value) => `${value}°C`"
    ></Slider>
    <br />
    <br />
    <div>Included</div>
    <Slider
      :marks="{ 20: '20\xB0C', 40: '40\xB0C' }"
      :included="false"
      :default-value="[0, 100]"
      :range="true"
      :tip-formatter="(v) => `${v}°C`"
      :get-aria-value-text="(value) => `${value}°C`"
    ></Slider>
  </div>
</template>
