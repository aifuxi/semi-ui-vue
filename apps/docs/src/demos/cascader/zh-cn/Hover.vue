<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
const treeData = [
  {
    label: '浙江省',
    value: 'zhejiang',
    children: [
      {
        label: '杭州市',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '萧山区', value: 'xiaoshan' },
          { label: '临安区', value: 'linan' },
        ],
      },
    ],
  },
];
</script>
<template>
  <div>
    <Cascader
      :style="{ width: '300px' }"
      :tree-data="treeData"
      placeholder="请选择所在地区"
      show-next="hover"
    ></Cascader>
  </div>
</template>
