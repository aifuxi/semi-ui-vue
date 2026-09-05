<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Select :style="{ width: '180px' }" default-value="Capcut">
      <SelectOption value="Capcut">Capcut</SelectOption>
    </Select>
    <br />
    <br />
    <Select :style="{ width: '180px' }" validate-status="warning" default-value="Capcut">
      <SelectOption value="Capcut">Capcut</SelectOption>
    </Select>
    <br />
    <br />
    <Select :style="{ width: '180px' }" validate-status="error" default-value="Capcut">
      <SelectOption value="Capcut">Capcut</SelectOption>
    </Select>
  </div>
</template>
