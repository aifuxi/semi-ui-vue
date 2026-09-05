<script setup lang="ts">
import { shallowRef } from 'vue';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import type { RadioValue } from '@aifuxi/semi-ui-vue/radio';
const value1 = shallowRef<RadioValue | undefined>(1);
const value2 = shallowRef<RadioValue | undefined>(1);
const value3 = shallowRef<RadioValue | undefined>(1);
</script>

<template>
  <Space vertical spacing="loose" align="start">
    <RadioGroup
      v-model="value1"
      type="button"
      button-size="small"
      aria-label="RadioGroup demo"
      name="en-us-radio-small"
      ><Radio :value="1">Instant push</Radio><Radio :value="2">Timed push</Radio
      ><Radio :value="3">Dynamic push</Radio></RadioGroup
    >
    <RadioGroup
      v-model="value2"
      type="button"
      button-size="middle"
      aria-label="RadioGroup demo"
      name="en-us-radio-middle"
      ><Radio :value="1">Instant push</Radio><Radio :value="2">Timed push</Radio
      ><Radio :value="3">Dynamic push</Radio></RadioGroup
    >
    <RadioGroup
      v-model="value3"
      type="button"
      button-size="large"
      aria-label="RadioGroup demo"
      name="en-us-radio-large"
      ><Radio :value="1">Instant push</Radio><Radio :value="2">Timed push</Radio
      ><Radio :value="3">Dynamic push</Radio></RadioGroup
    >
  </Space>
</template>
