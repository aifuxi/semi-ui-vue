<script setup lang="ts">
import { shallowRef } from 'vue';
import { Timeline, TimelineItem, type TimelineData } from '@aifuxi/semi-ui-vue/timeline';

const lastAction = shallowRef('暂无操作');
const centerData: TimelineData[] = [
  { content: '需求确认', time: '09:00', type: 'success' },
  { content: '开发完成', time: '11:30', type: 'ongoing', position: 'right' },
  { content: '发布验证', time: '14:00', extra: '等待审批', color: '#b35c00' },
];
</script>

<template>
  <div class="timeline-scenario" data-testid="timeline-vue">
    <Timeline
      aria-label="处理进度"
      data-parity-target="timeline-basic"
      class="timeline-scenario__column"
    >
      <TimelineItem
        data-parity-target="timeline-success"
        type="success"
        time="08:30"
        @click="lastAction = '创建服务现场'"
      >
        创建服务现场
      </TimelineItem>
      <TimelineItem type="warning" time="09:15" extra="网络抖动">初步排查</TimelineItem>
      <TimelineItem type="error" time="10:20">发现异常</TimelineItem>
      <TimelineItem type="ongoing" time="11:00">正在修复</TimelineItem>
    </Timeline>
    <Timeline
      aria-label="发布过程"
      class="timeline-scenario__column"
      data-parity-target="timeline-center"
      mode="center"
      :data-source="centerData"
    />
    <p class="timeline-scenario__status" role="status">最近操作：{{ lastAction }}</p>
  </div>
</template>
