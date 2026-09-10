<script setup lang="ts">
import { Timeline, TimelineItem } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
import { IconAlertTriangle } from '@aifuxi/semi-icons-vue';
</script>
<template>
  <Timeline>
    <TimelineItem time="2019-07-14 10:35"> Default Style</TimelineItem>
    <TimelineItem time="2019-06-13 16:17" type="warning">
      Customized Icon<template #dot><IconAlertTriangle /></template
    ></TimelineItem>
    <TimelineItem time="2019-05-14 18:34" color="pink"> Customized Color</TimelineItem>
    <TimelineItem time="2019-04-10 12:20">
      <span :style="{ fontSize: '18px' }"> Customized Node Style</span></TimelineItem
    >
  </Timeline>
</template>
