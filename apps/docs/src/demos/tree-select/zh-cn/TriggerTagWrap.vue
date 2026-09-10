<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';

import { createTreeData } from '../data';
const treeData = createTreeData('zh-cn', 'wrap');
</script>
<template>
  <TreeSelect
    :style="{ width: '260px' }"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    search-position="trigger"
    trigger-tag-wrap
    multiple
    filter-tree-node
    placeholder="请选择多个选项或输入长文本"
    :default-value="['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou']"
  />
</template>
