<script setup lang="ts">
import { Timeline, type TimelineData } from '@aifuxi/semi-ui-vue/timeline';

const data: TimelineData[] = [
  { content: '需求确认', time: '09:00', type: 'success' },
  { content: '开发完成', time: '11:30', type: 'ongoing', position: 'right' },
  { content: '发布验证', time: '14:00', extra: '等待审批' },
];
import '@aifuxi/semi-theme-default/timeline.css';
</script>

<template><Timeline mode="center" :data-source="data" /></template>
