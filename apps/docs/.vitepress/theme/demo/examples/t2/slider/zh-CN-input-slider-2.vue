<script setup lang="ts">
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';
</script>

<template>
  <div>
    <div>
      <div>Default</div>
      <Slider :show-boundary="true"></Slider>
    </div>
    <br />
    <br />
    <div>
      <div>Range</div>
      <Slider :default-value="[20, 60]" range></Slider>
    </div>
    <br />
    <br />
    <div>
      <div>Disabled</div>
      <Slider :default-value="40" disabled></Slider>
    </div>
  </div>
</template>
