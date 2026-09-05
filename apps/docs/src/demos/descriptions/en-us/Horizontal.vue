<script setup lang="ts">
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
const data = [
  { key: 'Account', value: 'SemiDesign' },
  { key: 'Streamer type', value: 'Independent streamer' },
  { key: 'Security level', value: 'Level 3' },
  {
    key: 'Category tags',
    value: () => h(Tag, { size: 'small', shape: 'circle', color: 'amber' }, () => 'Tech news'),
  },
  { key: 'Published works', value: '88888888' },
  {
    key: 'Verification',
    value: 'This is a very long value that spans multiple columns in the description list',
    span: 3,
  },
];
</script>

<template>
  <Descriptions layout="horizontal" align="plain" :data="data" :column="4" />
</template>
