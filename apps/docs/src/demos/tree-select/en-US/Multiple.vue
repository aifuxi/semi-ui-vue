<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';

import { createTreeData } from '../data';
const treeData = createTreeData('en-us', 'full');
</script>
<template>
  <div>
    <TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      placeholder="Please select"
    /><br /><br /><TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      leaf-only
      placeholder="Only render leaf nodes"
    /><br /><br />
  </div>
</template>
