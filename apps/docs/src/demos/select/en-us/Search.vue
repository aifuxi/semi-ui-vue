<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Select filter :style="{ width: '180px' }" placeholder="Searchable Select">
      <SelectOption value="app1">Douyin</SelectOption>
      <SelectOption value="app2">Coze</SelectOption>
      <SelectOption value="app3">Capcut</SelectOption>
      <SelectOption value="app4">BuzzVideo</SelectOption>
    </Select>
    <br />
    <br />
    <Select
      filter
      multiple
      :style="{ width: '350px' }"
      placeholder="Searchable Multiple Select"
      :auto-clear-search-value="false"
    >
      <SelectOption value="semi-0">Semi-0</SelectOption>
      <SelectOption value="semi-1">Semi-1</SelectOption>
      <SelectOption value="semi-2">Semi-2</SelectOption>
      <SelectOption value="semi-3">Semi-3</SelectOption>
      <SelectOption value="semi-4">Semi-4</SelectOption>
    </Select>
  </div>
</template>
