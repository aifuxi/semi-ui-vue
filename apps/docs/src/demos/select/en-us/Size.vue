<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Select placeholder="Business line" :style="{ width: '200px' }" size="small">
      <SelectOption value="douyin">Douyin</SelectOption>
    </Select>
    <br />
    <br />
    <Select placeholder="Business line" :style="{ width: '200px' }">
      <SelectOption value="douyin">Douyin</SelectOption>
    </Select>
    <br />
    <br />
    <Select placeholder="Business line" :style="{ width: '200px' }" size="large">
      <SelectOption value="douyin">Douyin</SelectOption>
    </Select>
  </div>
</template>
