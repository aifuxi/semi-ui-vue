<script setup lang="ts">
import { Timeline } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
import { h } from 'vue';
import { IconAlertTriangle } from '@aifuxi/semi-icons-vue';
import type { TimelineData } from '@aifuxi/semi-ui-vue/timeline';
const dataSource: TimelineData[] = [
  {
    time: '2019-07-14 10:35',
    extra: 'Extra Information',
    content: 'First Node Content',
    type: 'ongoing',
  },
  {
    time: '2019-06-13 16:17',
    extra: 'Extra Information',
    content: h('span', { style: { fontSize: '18px' } }, 'Second Node Content'),
    color: 'pink',
  },
  {
    time: '2019-05-14 18:34',
    extra: 'Extra Information',
    dot: h(IconAlertTriangle, {}),
    content: 'Third Node Content',
    type: 'warning',
  },
  {
    time: '2019-05-09 09:12',
    extra: 'Extra Information',
    content: 'Forth Node Content',
    type: 'success',
  },
];
</script>
<template>
  <Timeline mode="alternate" :data-source="dataSource" />
</template>
