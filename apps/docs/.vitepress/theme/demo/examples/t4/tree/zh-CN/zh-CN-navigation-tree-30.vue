<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree, type TreeNodeData, type TreeValue } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import VNodeContent from '../VNodeContent';
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
      {
        label: 'Japan',
        value: 'Japan',
        key: '0-1',
        children: [
          {
            label: 'Osaka',
            value: 'Osaka',
            key: '0-1-0',
          },
        ],
      },
    ],
  },
  {
    label: 'North America',
    value: 'North America',
    key: '1',
    children: [
      {
        label: 'United States',
        value: 'United States',
        key: '1-0',
      },
      {
        label: 'Canada',
        value: 'Canada',
        key: '1-1',
      },
    ],
  },
];
const treeStyle = { width: '260px', height: '420px', border: '1px solid var(--semi-color-border)' };
const value = shallowRef<TreeValue>();
</script>

<template>
  <Tree :tree-data="treeData" :style="treeStyle" @change="value = $event"
    ><template #fullLabel="row"
      ><li
        :class="row.className"
        :style="row.style"
        :data-key="row.data.key"
        role="treeitem"
        :aria-level="row.level + 1"
        :aria-expanded="row.expandStatus.expanded"
        @contextmenu="row.onContextMenu"
        @dblclick="row.onDoubleClick"
        @click="!row.data.children?.length ? row.onClick($event) : row.onExpand($event)"
      >
        <VNodeContent :content="row.expandIcon" /><span>{{ row.data.label }}</span>
      </li></template
    ></Tree
  >
  <p role="status">{{ value }}</p>
</template>
