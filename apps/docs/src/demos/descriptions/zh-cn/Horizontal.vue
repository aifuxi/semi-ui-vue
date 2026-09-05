<script setup lang="ts">
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
const data = [
  { key: '抖音号', value: 'SemiDesign' },
  { key: '主播类型', value: '自由主播' },
  { key: '安全等级', value: '3级' },
  {
    key: '垂类标签',
    value: () => h(Tag, { size: 'small', shape: 'circle', color: 'violet' }, () => '编程'),
  },
  { key: '作品数量', value: '88888888' },
  { key: '认证状态', value: '这是一个很长很长很长很长很长很长很长很长很长的值', span: 3 },
  { key: '上次直播时间', value: '2024-05-01 12:00:00', span: 3 },
];
</script>

<template>
  <Descriptions layout="horizontal" align="plain" :data="data" :column="5" />
</template>
