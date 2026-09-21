<script setup lang="ts">
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';
</script>

<template>
  <div>
    <div>
      <div>Default</div>
      <Slider :show-boundary="true" :handle-dot="{ size: '4px', color: 'blue' }"></Slider>
    </div>
    <br />
    <br />
    <div>
      <div>Range</div>
      <Slider
        :default-value="[20, 60]"
        range
        :handle-dot="[
          { size: '4px', color: 'blue' },
          { size: '4px', color: 'pink' },
        ]"
      ></Slider>
    </div>
  </div>
</template>
