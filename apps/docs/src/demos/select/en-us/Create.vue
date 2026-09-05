<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
const optionList = [
  { value: 'douyin', label: 'Douyin' },
  { value: 'capcut', label: 'Capcut' },
  { value: 'xigua', label: 'BuzzVideo' },
];
</script>
<template>
  <div>
    <Select
      style="width: 400px"
      :option-list="optionList"
      allow-create
      multiple
      filter
      default-active-first-option
      @change="console.log"
    /><br /><br /><Select
      style="width: 400px"
      :option-list="optionList"
      allow-create
      multiple
      filter
      default-active-first-option
      @change="console.log"
      ><template #createItem="{ inputValue, style }"
        ><div :style="[{ padding: '10px' }, style]">Create Item：{{ inputValue }}</div></template
      ></Select
    >
  </div>
</template>
