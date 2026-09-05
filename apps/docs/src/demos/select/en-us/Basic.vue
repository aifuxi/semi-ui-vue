<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Select default-value="douyin" :style="{ width: '120px' }">
      <SelectOption value="douyin">Douyin</SelectOption>
      <SelectOption value="capcut">Capcut</SelectOption>
    </Select>
    <br />
    <br />
    <Select placeholder="Select line of business" :style="{ width: '120px' }">
      <SelectOption value="douyin">Douyin</SelectOption>
      <SelectOption value="capcut">Capcut</SelectOption>
    </Select>
  </div>
</template>
