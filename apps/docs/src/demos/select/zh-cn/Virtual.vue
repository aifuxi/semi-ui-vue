<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
const newOptions = Array.from({ length: 3000 }, (_, i) => ({ label: `option-${i}`, value: i }));
const virtualize = { height: 270, width: '100%', itemSize: 36 };
</script>
<template>
  <div>
    <Select
      placeholder="拥有3k个Option的Select"
      :style="{ width: '260px' }"
      filter
      :virtualize="virtualize"
      :option-list="newOptions"
    ></Select>
  </div>
</template>
