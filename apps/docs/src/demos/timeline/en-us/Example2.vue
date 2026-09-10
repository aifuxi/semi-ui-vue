<script setup lang="ts">
import { Timeline, type TimelineData } from '@aifuxi/semi-ui-vue/timeline';

const data: TimelineData[] = [
  { content: 'Requirements approved', time: '09:00', type: 'success' },
  { content: 'Development complete', time: '11:30', type: 'ongoing', position: 'right' },
  { content: 'Release verification', time: '14:00', extra: 'Awaiting approval' },
];
import '@aifuxi/semi-theme-default/timeline.css';
</script>

<template><Timeline mode="center" :data-source="data" /></template>
