<script setup lang="ts">
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import '@aifuxi/semi-theme-default/time-picker.css';
</script>
<template>
  <div><TimePicker :scroll-item-props="{ mode: 'wheel', cycled: true }"></TimePicker></div>
</template>
