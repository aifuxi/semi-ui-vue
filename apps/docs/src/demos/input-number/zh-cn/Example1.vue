<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
</script>

<template>
  <InputNumber :default-value="1" :min="1" :max="10" :step="2" />
</template>
