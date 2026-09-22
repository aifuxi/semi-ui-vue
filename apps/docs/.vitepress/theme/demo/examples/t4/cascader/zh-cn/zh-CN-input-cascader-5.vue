<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
import { shallowRef } from 'vue';
import type { CascaderValue } from '@aifuxi/semi-ui-vue/cascader';
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
const value = shallowRef<CascaderValue>(['zhejiang', 'ningbo', 'haishu']);
function onChange(next: CascaderValue) {
  value.value = next;
}
</script>
<template>
  <div>
    <Cascader
      :style="{ width: '300px' }"
      :tree-data="treeData"
      placeholder="请选择所在地区"
      :value="value"
      multiple
      filter-tree-node
      @change="onChange"
    ></Cascader>
  </div>
</template>
