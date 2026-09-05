<script setup lang="ts">
import { Checkbox } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
</script>

<template>
  <Checkbox default-checked aria-label="Checkbox demo" @change="console.log">Semi Design</Checkbox>
</template>
