<script setup lang="ts">
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import '@aifuxi/semi-theme-default/time-picker.css';
</script>
<template>
  <div><TimePicker :minute-step="15" :second-step="10"></TimePicker></div>
</template>
