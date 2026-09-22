<script setup lang="ts">
import { Checkbox, CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
</script>

<template>
  <CheckboxGroup style="width: 100%" :default-value="['A', 'B']" aria-label="CheckboxGroup demo">
    <Checkbox v-for="value in ['A', 'B', 'C', 'D', 'E']" :key="value" :value="value">{{
      value
    }}</Checkbox>
  </CheckboxGroup>
</template>
