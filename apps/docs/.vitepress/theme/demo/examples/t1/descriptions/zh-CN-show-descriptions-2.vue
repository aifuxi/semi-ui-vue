<script setup lang="ts">
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import IconArrowUp from '@aifuxi/semi-icons-vue/icons/IconArrowUp';
const data = [
  { key: '实际用户数量', value: '1,480,000' },
  {
    key: '7天留存',
    value: () =>
      h('div', [
        '98%',
        h(IconArrowUp, {
          size: 'small',
          style: { color: 'var(--semi-color-success)', marginLeft: '2px' },
        }),
      ]),
  },
  { key: '安全等级', value: '3级' },
  { key: '垂类标签', value: () => h(Tag, { style: { margin: 0 } }, () => '电商') },
  { key: '认证状态', value: '未认证' },
];
</script>

<template>
  <Descriptions :data="data" />
</template>
