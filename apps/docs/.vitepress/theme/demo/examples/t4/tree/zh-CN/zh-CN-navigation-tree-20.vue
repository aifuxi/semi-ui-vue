<script setup lang="ts">
import { h } from 'vue';
import { Tree, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import { IconChevronDown, IconMinus, IconPlus } from '@aifuxi/semi-icons-vue';
const treeData: TreeNodeData[] = [
  {
    label: '亚洲',
    key: 'yazhou',
    children: [
      {
        label: '中国',
        key: 'zhongguo',
        children: [
          {
            label: '北京',
            key: 'beijing',
          },
          {
            label: '上海',
            key: 'shanghai',
          },
        ],
      },
      {
        label: '日本',
        key: 'riben',
      },
    ],
  },
  {
    label: '北美洲',
    key: 'beimeizhou',
  },
];
const treeStyle = { width: '260px', height: '200px', border: '1px solid var(--semi-color-border)' };
const expandIcon = h(IconChevronDown, { size: 'small', class: 'testCls' });
</script>

<template>
  <p>expandIcon 是 VNode</p>
  <Tree
    :tree-data="treeData"
    :style="treeStyle"
    multiple
    :default-expanded-keys="['yazhou']"
    :expand-icon="expandIcon"
  /><br />
  <p>自定义展开图标插槽</p>
  <Tree :tree-data="treeData" :style="treeStyle" multiple :default-expanded-keys="['yazhou']"
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
