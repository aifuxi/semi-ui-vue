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
      {
        label: '宁波市',
        value: 'ningbo',
        children: [
          { label: '海曙区', value: 'haishu' },
          { label: '江北区', value: 'jiangbei' },
        ],
      },
    ],
  },
];
</script>
<template>
  <div>
    <div>
      <Cascader
        :style="{ width: '300px' }"
        :tree-data="treeData"
        change-on-select
        placeholder="选择即改变"
      ></Cascader>
      <br />
      <br />
      <Cascader
        :style="{ width: '300px' }"
        :tree-data="treeData"
        change-on-select
        placeholder="可搜索的选择即改变"
        filter-tree-node
      ></Cascader>
    </div>
  </div>
</template>
