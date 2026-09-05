<script setup lang="ts">
import { Calendar } from '@aifuxi/semi-ui-vue/calendar';
import '@aifuxi/semi-theme-default/calendar.css';
const range = [new Date(2020, 8, 26), new Date(2020, 8, 31)];
</script>
<template>
  <Calendar mode="range" :range="range" :display-value="range[0]!" :show-curr-time="false" />
</template>
