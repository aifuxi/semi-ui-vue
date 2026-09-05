<script setup lang="ts">
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Card } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
const data = [
  { key: '实际用户数量', value: '1,480,000' },
  { key: '7天留存', value: '98%' },
  { key: '安全等级', value: '3级' },
  { key: '垂类标签', value: () => h(Tag, { style: { margin: 0 } }, () => '电商') },
  { key: '认证状态', value: '未认证' },
];
const aligns = ['center', 'justify', 'left', 'plain'] as const;
</script>

<template>
  <div style="display: flex; flex-wrap: wrap">
    <Card v-for="align in aligns" :key="align" shadows="always" style="margin: 10px">
      <Descriptions :align="align" :data="data" />
    </Card>
  </div>
</template>
