<script setup lang="ts">
import { CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
const plainOptions = ['Semi UI', 'Semi DSM', 'Semi D2C'];
const options = [
  {
    extra: '从 Semi Design，到 Any Design 快速定制你的设计系统，并应用在设计稿和代码中',
    label: 'Semi DSM',
    value: 'dsm',
  },
  { extra: '高效的 Design To Code 设计稿转代码', label: 'Semi D2C', value: 'd2c' },
];
const optionsWithDisabled = [
  { label: 'Photography', value: 'Photography' },
  { label: 'Movies', value: 'Movies' },
  { label: 'Running', value: 'Running', disabled: false },
];
</script>

<template>
  <div>
    <CheckboxGroup
      :options="plainOptions"
      :default-value="['Semi D2C']"
      aria-label="CheckboxGroup demo"
      @change="console.log"
    /><br /><br />
    <CheckboxGroup
      :options="options"
      :default-value="[]"
      aria-label="CheckboxGroup extra demo"
      @change="console.log"
    /><br /><br />
    <CheckboxGroup
      :options="optionsWithDisabled"
      disabled
      :default-value="['Photography']"
      aria-label="Disabled CheckboxGroup demo"
      @change="console.log"
    />
  </div>
</template>
