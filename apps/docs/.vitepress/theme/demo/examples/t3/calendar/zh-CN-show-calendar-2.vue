<script setup lang="ts">
import { Calendar } from '@aifuxi/semi-ui-vue/calendar';
import '@aifuxi/semi-theme-default/calendar.css';
const displayValue = new Date(2024, 7, 15);
</script>
<template>
  <Calendar mode="day" :display-value="displayValue" />
</template>
