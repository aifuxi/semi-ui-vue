<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { shallowRef } from 'vue';
import type { SelectModelValue } from '@aifuxi/semi-ui-vue/select';
const value = shallowRef<SelectModelValue>('xigua');
</script>
<template>
  <div>
    <Select v-model="value" :style="{ width: '300px' }" placeholder="Controlled Component">
      <SelectOption value="douyin">Douyin</SelectOption>
      <SelectOption value="capcut">Capcut</SelectOption>
      <SelectOption value="xigua">BuzzVideo</SelectOption>
    </Select>
  </div>
</template>
