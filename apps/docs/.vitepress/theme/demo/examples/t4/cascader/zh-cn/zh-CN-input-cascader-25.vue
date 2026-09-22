<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
const treeData = [
  {
    label: '亚洲',
    value: 'Asia',
    children: [
      {
        label: '中国',
        value: 'China',
        children: [
          { label: '北京', value: 'Beijing' },
          { label: '上海', value: 'Shanghai' },
        ],
      },
    ],
  },
  { label: '北美洲', value: 'North America' },
];
</script>
<template>
  <div>
    <Cascader
      multiple
      :default-value="[['Asia'], ['Asia', 'China', 'Beijing']]"
      check-relation="unRelated"
      :style="{ width: '300px' }"
      :tree-data="treeData"
    ></Cascader>
  </div>
</template>
