<script setup lang="ts">
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import { shallowRef } from 'vue';

const value = shallowRef('design');
import '@aifuxi/semi-theme-default/radio.css';
</script>

<template>
  <RadioGroup v-model="value" name="product" aria-label="产品">
    <Radio value="ui">Semi UI</Radio>
    <Radio value="design">Semi Design</Radio>
    <Radio value="d2c">Semi D2C</Radio>
  </RadioGroup>
</template>
