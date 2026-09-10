<script setup lang="ts">
import { Timeline, TimelineItem } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
</script>
<template>
  <Timeline mode="alternate">
    <TimelineItem time="2019-07-14 10:35" extra="Extra Information">
      First Node Content</TimelineItem
    >
    <TimelineItem time="2019-06-13 16:17" extra="Extra Information">
      Second Node Content</TimelineItem
    >
    <TimelineItem time="2019-05-14 18:34" extra="Extra Information">
      Third Node Content</TimelineItem
    >
    <TimelineItem time="2019-05-09 09:12" extra="Extra Information">
      Forth Node Content</TimelineItem
    >
  </Timeline>
</template>
