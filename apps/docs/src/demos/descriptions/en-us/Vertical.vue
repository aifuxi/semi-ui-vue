<script setup lang="ts">
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
const data = [
  { key: 'Account', value: 'SemiDesign' },
  { key: 'Streamer type', value: 'Independent streamer' },
  { key: 'Security level', value: 'Level 3' },
  {
    key: 'Category tags',
    value: () =>
      h(Space, {}, () => [
        h(Tag, { size: 'small', shape: 'circle', color: 'amber' }, () => 'Internet news'),
        h(Tag, { size: 'small', shape: 'circle', color: 'violet' }, () => 'Programming'),
      ]),
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
  <Descriptions layout="vertical" align="plain" :data="data" :column="4" />
</template>
