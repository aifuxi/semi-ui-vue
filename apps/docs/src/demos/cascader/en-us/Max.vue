<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/toast.css';
import type { CascaderEntity } from '@aifuxi/semi-ui-vue/cascader';
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
function exceed(value: CascaderEntity[]) {
  Toast.warning('exceed max');
  console.log(value);
}
</script>
<template>
  <div>
    <Cascader
      :style="{ width: '300px' }"
      :tree-data="treeData"
      placeholder="Please selection"
      multiple
      :max="1"
      :default-value="[['impressionism', 'visualArts', 'Monet']]"
      @exceed="exceed"
    ></Cascader>
  </div>
</template>
