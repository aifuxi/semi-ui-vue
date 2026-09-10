<script setup lang="ts">
import { Timeline, TimelineItem } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
</script>
<template>
  <Timeline>
    <TimelineItem time="2019-07-14 10:35"> 第一个节点内容</TimelineItem>
    <TimelineItem time="2019-06-13 16:17"> 第二个节点内容</TimelineItem>
    <TimelineItem time="2019-05-14 18:34"> 第三个节点内容</TimelineItem>
  </Timeline>
</template>
