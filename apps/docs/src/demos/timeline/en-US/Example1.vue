<script setup lang="ts">
import { Timeline, TimelineItem } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
</script>

<template>
  <Timeline aria-label="Incident response">
    <TimelineItem time="09:00" type="success">Site created</TimelineItem>
    <TimelineItem time="09:30" type="warning" extra="Network jitter">Investigating</TimelineItem>
    <TimelineItem time="10:20" type="ongoing">Repairing</TimelineItem>
  </Timeline>
</template>
