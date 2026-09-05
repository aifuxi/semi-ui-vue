<script setup lang="ts">
import { shallowRef } from 'vue';
import { Radio } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
const checked = shallowRef(true);
</script>

<template>
  <Radio v-model="checked" mode="advanced" aria-label="Radio demo" name="en-us-radio-advanced"
    >Click Again to Uncheck</Radio
  >
</template>
