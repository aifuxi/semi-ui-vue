<script setup lang="ts">
import { Calendar } from '@aifuxi/semi-ui-vue/calendar';
import '@aifuxi/semi-theme-default/calendar.css';
const displayValue = new Date(2019, 6, 23, 8, 32, 0);
</script>
<template>
  <Calendar mode="day" :display-value="displayValue" :show-curr-time="false" />
</template>
