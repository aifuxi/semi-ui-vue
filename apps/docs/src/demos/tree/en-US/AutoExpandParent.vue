<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
const treeData: TreeNodeData[] = [
  {
    label: 'Asia',
    value: 'Asia',
    key: '0',
    children: [
      {
        label: 'China',
        value: 'China',
        key: '0-0',
        children: [
          {
            label: 'Beijing',
            value: 'Beijing',
            key: '0-0-0',
          },
          {
            label: 'Shanghai',
            value: 'Shanghai',
            key: '0-0-1',
          },
        ],
      },
    ],
  },
  {
    label: 'North America',
    value: 'North America',
    key: '1',
  },
];
const treeStyle = { width: '260px', height: '420px', border: '1px solid var(--semi-color-border)' };
const expanded = shallowRef(['0', '0-0']);
</script>

<template>
  <div>Collapse China before collapsing Asia</div>
  <br /><Tree
    v-model:expanded-keys="expanded"
    :tree-data="treeData"
    :style="treeStyle"
    auto-expand-parent
  />
</template>
