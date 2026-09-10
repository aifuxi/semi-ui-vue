<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';

import { createTreeData } from '../data';
const treeData = createTreeData('zh-cn', 'full');
</script>
<template>
  <div>
    <TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      placeholder="请选择"
    /><br /><br /><TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      leaf-only
      placeholder="只渲染叶子节点"
    /><br /><br />
  </div>
</template>
