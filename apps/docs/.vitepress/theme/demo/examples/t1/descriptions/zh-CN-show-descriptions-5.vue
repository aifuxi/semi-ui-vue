<script setup lang="ts">
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
const data = [
  { key: '抖音号', value: 'SemiDesign' },
  { key: '主播类型', value: '自由主播' },
  { key: '安全等级', value: '3级' },
  {
    key: '垂类标签',
    value: () =>
      h(Space, {}, () => [
        h(Tag, { size: 'small', shape: 'circle', color: 'amber' }, () => '互联网资讯'),
        h(Tag, { size: 'small', shape: 'circle', color: 'violet' }, () => '编程'),
      ]),
  },
  { key: '作品数量', value: '88888888' },
  { key: '认证状态', value: '这是一个很长很长很长很长很长很长很长很长很长的值', span: 3 },
];
</script>

<template>
  <Descriptions layout="vertical" align="plain" :data="data" :column="4" />
</template>
