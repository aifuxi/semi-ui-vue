<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';

import { createTreeData } from '../data';
const treeData = createTreeData('zh-cn', 'strict');
</script>
<template>
  <TreeSelect
    :style="{ width: '300px' }"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    disable-strictly
    multiple
    :default-value="['Shanghai']"
  />
</template>
