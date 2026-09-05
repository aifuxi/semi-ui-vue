<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Select
      :style="{ width: '180px' }"
      :dropdown-style="{ width: '250px' }"
      dropdown-class-name="test"
    >
      <SelectOption value="douyin">Douyin</SelectOption>
      <SelectOption value="coze">Coze</SelectOption>
      <SelectOption value="capcut">Capcut</SelectOption>
      <SelectOption value="xigua">BuzzVideo</SelectOption>
    </Select>
  </div>
</template>
