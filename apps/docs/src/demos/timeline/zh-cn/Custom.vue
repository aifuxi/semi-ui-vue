<script setup lang="ts">
import { Timeline, TimelineItem } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
import { IconAlertTriangle } from '@aifuxi/semi-icons-vue';
</script>
<template>
  <Timeline>
    <TimelineItem time="2019-07-14 10:35"> 默认样式的节点</TimelineItem>
    <TimelineItem time="2019-06-13 16:17" type="warning">
      自定义图标
      <template #dot><IconAlertTriangle /></template
    ></TimelineItem>
    <TimelineItem time="2019-05-14 18:34" color="pink"> 自定义节点颜色 </TimelineItem>
    <TimelineItem time="2019-04-10 12:20">
      <span :style="{ fontSize: '18px' }"> 自定义节点样式</span>
    </TimelineItem>
  </Timeline>
</template>
