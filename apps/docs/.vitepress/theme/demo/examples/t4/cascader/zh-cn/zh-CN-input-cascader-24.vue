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
const value = shallowRef<CascaderValue>([]);
function onChange(next: CascaderValue) {
  value.value = next;
  console.log(next);
}
</script>
<template>
  <div>
    <Cascader
      :style="{ width: '300px' }"
      :tree-data="treeData"
      placeholder="开启 leafOnly"
      :value="value"
      multiple
      leaf-only
      @change="onChange"
    ></Cascader>
  </div>
</template>
