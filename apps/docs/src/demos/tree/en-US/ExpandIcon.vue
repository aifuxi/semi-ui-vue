<script setup lang="ts">
import { h } from 'vue';
import { Tree, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import { IconChevronDown, IconMinus, IconPlus } from '@aifuxi/semi-icons-vue';
const treeData: TreeNodeData[] = [
  {
    label: 'Asia',
    key: 'Asia',
    children: [
      {
        label: 'China',
        key: 'China',
        children: [
          {
            label: 'Beijing',
            key: 'Beijing',
          },
          {
            label: 'Shanghai',
            key: 'Shanghai',
          },
        ],
      },
    ],
  },
  {
    label: 'North America',
    key: 'North America',
  },
];
const treeStyle = { width: '260px', height: '200px', border: '1px solid var(--semi-color-border)' };
const expandIcon = h(IconChevronDown, { size: 'small', class: 'testCls' });
</script>

<template>
  <p>expandIcon as a VNode</p>
  <Tree
    :tree-data="treeData"
    :style="treeStyle"
    multiple
    :default-expanded-keys="['Asia']"
    :expand-icon="expandIcon"
  /><br />
  <p>Custom expand icon slot</p>
  <Tree :tree-data="treeData" :style="treeStyle" multiple :default-expanded-keys="['Asia']"
    ><template #expandIcon="icon"
      ><IconMinus
        v-if="icon.expanded"
        size="small"
        :class="icon.className"
        @click="icon.onClick" /><IconPlus
        v-else
        size="small"
        :class="icon.className"
        @click="icon.onClick" /></template
  ></Tree>
</template>
