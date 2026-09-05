<script setup lang="ts">
import { shallowRef } from 'vue';
import { RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
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
  <div>
    <RadioGroup
      v-model="value1"
      :options="plainOptions"
      aria-label="RadioGroup demo"
      name="en-us-radio-options-1"
    /><br /><br /><RadioGroup
      v-model="value2"
      :options="optionsWithDisabled"
      aria-label="RadioGroup demo"
      name="en-us-radio-options-2"
    /><br /><br /><RadioGroup
      v-model="value3"
      :options="options"
      aria-label="RadioGroup demo"
      name="en-us-radio-options-3"
    />
  </div>
</template>
