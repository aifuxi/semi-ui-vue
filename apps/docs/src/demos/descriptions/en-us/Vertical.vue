<script setup lang="ts">
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
const data = [
  { key: 'UID', value: 'SemiDesign' },
  { key: 'Anchor Type', value: 'Freelance anchor' },
  { key: 'Security Level', value: 'Level 3' },
  {
    key: 'Classification',
    value: () => h(Tag, { size: 'small', shape: 'circle', color: 'amber' }, () => 'Tech News'),
  },
  { key: 'Videos Count', value: '88888888' },
  {
    key: 'Certification status',
    value: 'This is a long, long, long value that needs to be automatically wrapped and displayed.',
    span: 3,
  },
];
</script>

<template>
  <Descriptions layout="vertical" align="plain" :data="data" :column="4" />
</template>
