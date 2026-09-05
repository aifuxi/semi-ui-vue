<script setup lang="ts">
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
</script>

<template>
  <RadioGroup direction="vertical" aria-label="RadioGroup demo" name="en-us-radio-vertical"
    ><Radio v-for="(label, index) in ['A', 'B', 'C', 'D']" :key="label" :value="index + 1">{{
      label
    }}</Radio></RadioGroup
  >
</template>
