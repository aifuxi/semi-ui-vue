<script setup lang="ts">
import { shallowRef } from 'vue';
import { RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import type { RadioValue } from '@aifuxi/semi-ui-vue/radio';
const value1 = shallowRef<RadioValue | undefined>('Guest');
const value2 = shallowRef<RadioValue | undefined>('Developer');
const value3 = shallowRef<RadioValue | undefined>('Maintainer');
const plainOptions = ['Guest', 'Developer', 'Maintainer'];
const options = plainOptions.map((value) => ({
  label: value,
  value,
  extra: 'Semi Design',
  style: { width: '120px' },
}));
const optionsWithDisabled = plainOptions.map((value) => ({
  label: value,
  value,
  disabled: value === 'Maintainer',
}));
</script>

<template>
  <Space vertical align="start" spacing="loose"
    ><RadioGroup
      v-model="value1"
      :options="plainOptions"
      aria-label="RadioGroup demo"
      name="zh-cn-radio-options-1" />
    <RadioGroup
      v-model="value2"
      :options="optionsWithDisabled"
      aria-label="RadioGroup demo"
      name="zh-cn-radio-options-2" />
    <RadioGroup
      v-model="value3"
      :options="options"
      aria-label="RadioGroup demo"
      name="zh-cn-radio-options-3"
  /></Space>
</template>
