<script setup lang="ts">
import { shallowRef, h } from 'vue';
import { Tree, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import {
  IconAbsoluteStroked,
  IconComponentStroked,
  IconFixedStroked,
  IconInnerSectionStroked,
  IconSectionStroked,
} from '@aifuxi/semi-icons-vue';
import VNodeContent from '../VNodeContent';
import { descendantKeys } from '../treeOperations';
const treeData: TreeNodeData[] = [
  {
    label: '黑色固定按钮',
    icon: h(IconFixedStroked, { style: { marginRight: '8px', color: 'var(--semi-color-text-2)' } }),
    key: 'fix-btn-0',
  },
  {
    label: '模块',
    key: 'module-0',
    icon: h(IconSectionStroked, {
      style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
    }),
    children: [
      {
        label: '可自由摆放的组件',
        icon: h(IconAbsoluteStroked, {
          style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
        }),
        key: 'free-compo-0',
      },
      {
        label: '分栏容器',
        icon: h(IconInnerSectionStroked, {
          style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
        }),
        key: 'split-col-0',
        children: [
          {
            label: '按钮组件',
            icon: h(IconComponentStroked, {
              style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
            }),
            key: 'btn-0',
          },
          {
            label: '按钮组件',
            icon: h(IconComponentStroked, {
              style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
            }),
            key: 'btn-1',
          },
        ],
      },
    ],
  },
  {
    label: '模块',
    icon: h(IconSectionStroked, {
      style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
    }),
    key: 'module-1',
    children: [
      {
        label: '自定义组件',
        icon: h(IconComponentStroked, {
          style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
        }),
        key: 'cus-0',
      },
    ],
  },
];
const treeStyle = { width: '260px', height: '420px', border: '1px solid var(--semi-color-border)' };
const selected = shallowRef(new Set<string>());
const inherited = shallowRef(new Set<string>());
function select(key: string, _selected: boolean, node: TreeNodeData) {
  selected.value = new Set([key]);
  inherited.value = new Set(descendantKeys(node));
}
function background(key?: string) {
  return key && selected.value.has(key)
    ? 'rgba(var(--semi-blue-0), 1)'
    : key && inherited.value.has(key)
      ? 'rgba(var(--semi-blue-0), .5)'
      : 'transparent';
}
</script>

<template>
  <Tree :tree-data="treeData" :style="treeStyle" default-expand-all @select="select"
    ><template #fullLabel="row"
      ><li
        :class="row.className"
        :style="[row.style, { backgroundColor: background(row.data.key) }]"
        :data-key="row.data.key"
        role="treeitem"
        :aria-level="row.level + 1"
        :aria-expanded="row.expandStatus.expanded"
        @contextmenu="row.onContextMenu"
        @dblclick="row.onDoubleClick"
        @click="row.onClick"
      >
        <span v-if="!row.data.children?.length" style="width: 24px" /><VNodeContent
          v-else
          :content="row.expandIcon"
        /><VNodeContent :content="row.data.icon" /><span>{{ row.data.label }}</span>
      </li></template
    ></Tree
  >
</template>
