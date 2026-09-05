<script setup lang="ts">
import { shallowRef } from 'vue';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import type { RadioValue } from '@aifuxi/semi-ui-vue/radio';
const value = shallowRef<RadioValue | undefined>(1);
</script>

<template>
  <RadioGroup v-model="value" aria-label="RadioGroup demo" name="zh-cn-radio-group"
    ><Radio v-for="(label, index) in ['A', 'B', 'C', 'D']" :key="label" :value="index + 1">{{
      label
    }}</Radio></RadioGroup
  >
</template>
