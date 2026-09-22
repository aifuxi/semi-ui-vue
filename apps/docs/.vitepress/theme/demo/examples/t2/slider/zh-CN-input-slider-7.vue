<script setup lang="ts">
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { shallowRef } from 'vue';
const value = shallowRef(10);
</script>

<template>
  <div>
    <Button style="margin-right: 20px" @click="value += 10">点击改变value值</Button
    ><br /><br /><Slider :value="value" />
  </div>
</template>
