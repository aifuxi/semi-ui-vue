<script setup lang="ts">
import { Timeline, TimelineItem } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
</script>

<template>
  <Timeline aria-label="事故处理过程">
    <TimelineItem time="09:00" type="success">创建服务现场</TimelineItem>
    <TimelineItem time="09:30" type="warning" extra="网络抖动">初步排查</TimelineItem>
    <TimelineItem time="10:20" type="ongoing">正在修复</TimelineItem>
  </Timeline>
</template>
