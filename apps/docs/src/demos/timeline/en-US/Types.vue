<script setup lang="ts">
import { Timeline, TimelineItem } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
</script>
<template>
  <Timeline>
    <TimelineItem time="2019-07-14 10:35" type="ongoing"> Processing</TimelineItem>
    <TimelineItem time="2019-06-13 16:17" type="success"> Succeed</TimelineItem>
    <TimelineItem time="2019-05-14 18:34" type="error"> Failed</TimelineItem>
  </Timeline>
</template>
