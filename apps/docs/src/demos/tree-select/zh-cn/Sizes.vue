<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
const sizes = ['small', 'default', 'large'] as const;
import { createTreeData } from '../data';
const treeData = createTreeData('zh-cn', 'basic');
</script>
<template>
  <div>
    <template v-for="size in sizes" :key="size"
      ><TreeSelect
        :style="{ width: '300px' }"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :tree-data="treeData"
        multiple
        :size="size"
        :placeholder="size" /><br /><br
    /></template>
  </div>
</template>
