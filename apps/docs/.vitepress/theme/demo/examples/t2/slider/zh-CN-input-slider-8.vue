<script setup lang="ts">
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';
</script>

<template>
  <div>
    <div
      :style="{
        height: '300px',
        marginLeft: '30px',
        marginTop: '10px',
        paddingRight: '30px',
        display: 'inline-block',
      }"
    >
      <Slider vertical></Slider>
    </div>
    <div
      :style="{
        height: '300px',
        marginLeft: '30px',
        marginTop: '10px',
        paddingRight: '30px',
        display: 'inline-block',
      }"
    >
      <Slider vertical vertical-reverse></Slider>
    </div>
    <div
      :style="{
        height: '300px',
        marginLeft: '30px',
        marginTop: '10px',
        paddingRight: '30px',
        display: 'inline-block',
      }"
    >
      <Slider vertical range :default-value="[20, 60]"></Slider>
    </div>
    <div
      :style="{
        height: '300px',
        marginLeft: '30px',
        marginTop: '10px',
        paddingRight: '30px',
        display: 'inline-block',
      }"
    >
      <Slider vertical vertical-reverse range :default-value="[20, 60]"></Slider>
    </div>
    <div
      :style="{
        height: '300px',
        marginLeft: '30px',
        marginTop: '10px',
        paddingRight: '30px',
        display: 'inline-block',
      }"
    >
      <Slider
        vertical
        range
        :marks="{ 20: '20\xB0C', 40: '40\xB0C' }"
        :step="10"
        :default-value="[20, 60]"
      ></Slider>
    </div>
    <div
      :style="{
        height: '300px',
        marginLeft: '30px',
        marginTop: '10px',
        paddingRight: '30px',
        display: 'inline-block',
      }"
    >
      <Slider
        vertical
        vertical-reverse
        range
        :marks="{ 20: '20\xB0C', 40: '40\xB0C' }"
        :step="10"
        :default-value="[20, 60]"
      ></Slider>
    </div>
  </div>
</template>
