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
        ],
      },
      { label: '宁波市', value: 'ningbo', children: [{ label: '海曙区', value: 'haishu' }] },
    ],
  },
];
</script>
<template>
  <div>
    <Cascader
      :style="{ width: '300px' }"
      :tree-data="treeData"
      multiple
      placeholder="请选择所在地区"
      show-next="hover"
      click-to-select
    ></Cascader>
  </div>
</template>
