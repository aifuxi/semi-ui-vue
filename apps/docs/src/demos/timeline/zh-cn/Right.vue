<script setup lang="ts">
import { Timeline, TimelineItem } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
</script>
<template>
  <Timeline mode="right">
    <TimelineItem time="2019-07-14 10:35" extra="节点辅助说明信息"> 第一个节点内容 </TimelineItem>
    <TimelineItem time="2019-06-13 16:17" extra="节点辅助说明信息"> 第二个节点内容 </TimelineItem>
    <TimelineItem time="2019-05-14 18:34" extra="节点辅助说明信息"> 第三个节点内容 </TimelineItem>
    <TimelineItem time="2019-05-09 09:12" extra="节点辅助说明信息"> 第四个节点内容 </TimelineItem>
  </Timeline>
</template>
