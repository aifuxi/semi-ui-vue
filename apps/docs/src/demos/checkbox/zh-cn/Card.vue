<script setup lang="ts">
import { Checkbox, CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
</script>

<template>
  <CheckboxGroup
    type="card"
    :default-value="['1', '3']"
    direction="vertical"
    aria-label="CheckboxGroup demo"
  >
    <Checkbox
      v-for="value in ['1', '2', '3', '4']"
      :key="value"
      :value="value"
      :disabled="value === '1' || value === '2'"
      extra="Semi Design 是由抖音前端团队与 UED 团队共同设计开发并维护的设计系统"
      style="width: 280px"
      >单选框标题</Checkbox
    >
  </CheckboxGroup>
</template>
