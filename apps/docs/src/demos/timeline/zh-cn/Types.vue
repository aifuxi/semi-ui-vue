<script setup lang="ts">
import { Timeline, TimelineItem } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
</script>
<template>
  <Timeline>
    <TimelineItem time="2019-07-14 10:35" type="ongoing"> 审核中 </TimelineItem>
    <TimelineItem time="2019-06-13 16:17" type="success"> 发布成功 </TimelineItem>
    <TimelineItem time="2019-05-14 18:34" type="error"> 审核失败 </TimelineItem>
  </Timeline>
</template>
