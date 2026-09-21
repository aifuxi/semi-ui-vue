<script setup lang="ts">
import { Timeline } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
import { h } from 'vue';
import { IconAlertTriangle } from '@aifuxi/semi-icons-vue';
import type { TimelineData } from '@aifuxi/semi-ui-vue/timeline';
const dataSource: TimelineData[] = [
  {
    time: '2019-07-14 10:35',
    extra: '节点辅助说明信息',
    content: '第一个节点内容',
    type: 'ongoing',
  },
  {
    time: '2019-06-13 16:17',
    extra: '节点辅助说明信息',
    content: h('span', { style: { fontSize: '18px' } }, '第二个节点内容'),
    color: 'pink',
  },
  {
    time: '2019-05-14 18:34',
    extra: '节点辅助说明信息',
    dot: h(IconAlertTriangle, {}),
    content: '第三个节点内容',
    type: 'warning',
  },
  {
    time: '2019-05-09 09:12',
    extra: '节点辅助说明信息',
    content: '第四个节点内容',
    type: 'success',
  },
];
</script>
<template>
  <Timeline mode="alternate" :data-source="dataSource" />
</template>
