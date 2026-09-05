<script setup lang="ts">
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
</script>

<template>
  <RadioGroup
    type="card"
    :default-value="1"
    direction="vertical"
    aria-label="RadioGroup demo"
    name="en-us-radio-card"
    ><Radio
      v-for="value in [1, 2, 3]"
      :key="value"
      :value="value"
      :disabled="value === 2"
      extra="Radio description"
      style="width: 280px"
      >Radio Title</Radio
    ></RadioGroup
  >
</template>
