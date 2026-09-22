<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import type { SelectOptionProps } from '@aifuxi/semi-ui-vue/select';
function searchLabel(input: string, option: SelectOptionProps) {
  return String(option.label ?? '')
    .toUpperCase()
    .includes(input.toUpperCase());
}
</script>
<template>
  <div>
    <Select :filter="searchLabel" :style="{ width: '180px' }" placeholder="try douyin">
      <SelectOption value="douyin">douyin</SelectOption>
      <SelectOption value="ulikecam">HOTSOON</SelectOption>
      <SelectOption value="jianying">PIPIXIA</SelectOption>
      <SelectOption value="xigua">XIGUA</SelectOption>
    </Select>
  </div>
</template>
