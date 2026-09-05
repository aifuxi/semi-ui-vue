<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
import { shallowRef } from 'vue';
import type { CascaderValue } from '@aifuxi/semi-ui-vue/cascader';
const treeData = [
  {
    label: 'Impressionism',
    value: 'impressionism',
    children: [
      {
        label: 'Visual Arts',
        value: 'visualArts',
        children: [
          { label: 'Claude Monet', value: 'Monet' },
          { label: 'Pierre-Auguste Renoir', value: 'Renoir' },
          { label: 'Édouard Manet', value: 'Manet' },
        ],
      },
      {
        label: 'Music',
        value: 'music',
        children: [
          { label: 'Claude Debussy', value: 'Debussy' },
          { label: 'Maurice Ravel', value: 'Ravel' },
        ],
      },
    ],
  },
];
const value = shallowRef<CascaderValue>(['impressionism', 'visualArts']);
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
      placeholder="Please select"
      :value="value"
      multiple
      :auto-merge-value="false"
      @change="onChange"
    ></Cascader>
  </div>
</template>
