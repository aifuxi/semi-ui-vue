<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import type { SelectOptionProps } from '@aifuxi/semi-ui-vue/select';
function searchLabel(input: string, option: SelectOptionProps) {
  const query = input.toUpperCase();
  return (
    String(option.label ?? '')
      .toUpperCase()
      .includes(query) ||
    String(option.value ?? '')
      .toUpperCase()
      .includes(query)
  );
}
</script>
<template>
  <div>
    <Select :filter="searchLabel" :style="{ width: '180px' }" placeholder="try hello or douyin">
      <SelectOption value="hello">Douyin</SelectOption>
      <SelectOption value="bytedance">UlikeCam</SelectOption>
      <SelectOption value="semi">BuzzVideo</SelectOption>
    </Select>
  </div>
</template>
