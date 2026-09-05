<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
const optionList = [
  { value: 'douyin', label: '抖音' },
  { value: 'ulikecam', label: '轻颜相机' },
  { value: 'jianying', label: '剪映' },
  { value: 'toutiao', label: '今日头条' },
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
      placeholder="With renderCreateItem"
      default-active-first-option
      @change="console.log"
      ><template #createItem="{ inputValue, style }"
        ><div :style="[{ padding: '10px' }, style]">Create Item：{{ inputValue }}</div></template
      ></Select
    >
  </div>
</template>
