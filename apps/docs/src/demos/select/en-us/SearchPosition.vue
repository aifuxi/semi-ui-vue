<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Select filter search-position="dropdown" :style="{ width: '200px' }" default-value="ulikecam">
      <SelectOption value="douyin">Douyin</SelectOption>
      <SelectOption value="ulikecam">UlikeCam</SelectOption>
      <SelectOption value="jianying">Capcut</SelectOption>
      <SelectOption value="xigua">XiguaVideo</SelectOption>
    </Select>
    <br />
    <br />
    <Select
      filter
      search-position="dropdown"
      multiple
      :style="{ width: '300px' }"
      :default-value="['semi-1']"
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
