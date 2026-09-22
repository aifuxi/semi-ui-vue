<script setup lang="ts">
import { h } from 'vue';
import { Tree, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import { IconMapPin } from '@aifuxi/semi-icons-vue';
const treeData: TreeNodeData[] = [
  {
    label: 'Asia',
    value: 'Asia',
    key: '0',
    icon: h(IconMapPin, { style: { color: 'var(--semi-color-text-2)' } }),
    children: [
      {
        label: 'China',
        value: 'China',
        key: '0-0',
        icon: h(IconMapPin, { style: { color: 'var(--semi-color-text-2)' } }),
      },
      {
        label: 'Japan',
        value: 'Japan',
        key: '0-1',
        icon: h(IconMapPin, { style: { color: 'var(--semi-color-text-2)' } }),
      },
    ],
  },
];
const treeStyle = { width: '260px', height: '420px', border: '1px solid var(--semi-color-border)' };
</script>

<template>
  <Tree :tree-data="treeData" :style="treeStyle" />
</template>
