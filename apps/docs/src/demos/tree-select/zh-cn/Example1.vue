<script setup lang="ts">
import { ref } from 'vue';
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import { type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';

const value = ref('shanghai');
const treeData: TreeNodeData[] = [
  {
    label: '亚洲',
    value: 'asia',
    key: 'asia',
    children: [
      {
        label: '中国',
        value: 'china',
        key: 'china',
        children: [
          { label: '北京', value: 'beijing', key: 'beijing' },
          { label: '上海', value: 'shanghai', key: 'shanghai' },
        ],
      },
    ],
  },
];
import '@aifuxi/semi-theme-default/tree-select.css';
import '@aifuxi/semi-theme-default/tree.css';
</script>

<template>
  <TreeSelect
    v-model="value"
    :tree-data="treeData"
    filter-tree-node
    placeholder="请选择城市"
    :style="{ width: '300px' }"
  />
</template>
