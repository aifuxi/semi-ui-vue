<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
const treeData: TreeNodeData[] = [
  {
    label: 'parent-0',
    key: 'parent-0',
    children: [
      {
        label: 'leaf-0-0',
        key: 'leaf-0-0',
        children: [0, 1, 2].map((index) => ({
          label: `leaf-0-0-${index}`,
          key: `leaf-0-0-${index}`,
        })),
      },
      { label: 'leaf-0-1', key: 'leaf-0-1' },
    ],
  },
  { label: 'parent-1', key: 'parent-1' },
];
const treeStyle = { width: '260px', height: '420px', border: '1px solid var(--semi-color-border)' };
const show = shallowRef(true);
</script>

<template>
  <div style="display: flex; align-items: center; column-gap: 5px; margin-bottom: 5px">
    <strong>showLine</strong><Switch v-model="show" aria-label="showLine" />
  </div>
  <Tree :tree-data="treeData" :style="treeStyle" :show-line="show" default-expand-all />
</template>
