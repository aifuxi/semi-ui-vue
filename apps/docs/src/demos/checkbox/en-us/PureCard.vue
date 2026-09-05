<script setup lang="ts">
import { Checkbox, CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
</script>

<template>
  <CheckboxGroup
    type="pureCard"
    :default-value="['1', '3']"
    direction="vertical"
    aria-label="CheckboxGroup demo"
  >
    <Checkbox
      v-for="value in ['1', '2', '3', '4']"
      :key="value"
      :value="value"
      :disabled="value === '1' || value === '2'"
      extra="Checkbox Description"
      style="width: 280px"
      >Checkbox Title</Checkbox
    >
  </CheckboxGroup>
</template>
