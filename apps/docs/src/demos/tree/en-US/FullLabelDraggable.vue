<script setup lang="ts">
import { shallowRef, h } from 'vue';
import { Tree, type TreeNodeData, type TreeDropProps } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import {
  IconAbsoluteStroked,
  IconComponentStroked,
  IconFixedStroked,
  IconSectionStroked,
} from '@aifuxi/semi-icons-vue';
import VNodeContent from '../VNodeContent';
import { descendantKeys, moveTreeNode } from '../treeOperations';
const treeData = shallowRef<TreeNodeData[]>([
  {
    label: 'Fixed Black Button',
    icon: h(IconFixedStroked, { style: { marginRight: '8px', color: 'var(--semi-color-text-2)' } }),
    key: 'fix-btn-0',
  },
  {
    label: 'Module',
    key: 'module-0',
    icon: h(IconSectionStroked, {
      style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
    }),
    children: [
      {
        label: 'Free Components',
        icon: h(IconAbsoluteStroked, {
          style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
        }),
        key: 'free-compo-0',
      },
      {
        label: 'Split Container',
        icon: h(IconSectionStroked, {
          style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
        }),
        key: 'split-col-0',
        children: [
          {
            label: 'Button',
            icon: h(IconComponentStroked, {
              style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
            }),
            key: 'btn-0',
          },
          {
            label: 'Button',
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
    label: 'Module',
    icon: h(IconSectionStroked, {
      style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
    }),
    key: 'module-1',
    children: [
      {
        label: 'Custom Component',
        icon: h(IconComponentStroked, {
          style: { marginRight: '8px', color: 'var(--semi-color-text-2)' },
        }),
        key: 'cus-0',
      },
    ],
  },
]);
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
function drop(info: TreeDropProps) {
  treeData.value = moveTreeNode(treeData.value, info);
}
</script>

<template>
  <Tree
    :tree-data="treeData"
    :style="treeStyle"
    default-expand-all
    draggable
    @select="select"
    @drop="drop"
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
