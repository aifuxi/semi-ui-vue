<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';

import { createTreeData } from '../data';
const treeData = createTreeData('zh-cn', 'full');
</script>
<template>
  <div>
    <h4 style="margin: 20px 0 10px">maxTagCount=2:</h4>
    <TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      :max-tag-count="2"
      :default-value="['Beijing', 'Chengdu', 'Canada']"
      placeholder="当选中标签超过两个将折叠"
    />
    <h4 style="margin: 20px 0 10px">maxTagCount=2, showRestTagsPopover:</h4>
    <TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      show-rest-tags-popover
      :rest-tags-popover-props="{ position: 'top' }"
      :max-tag-count="2"
      :default-value="['Beijing', 'Chengdu', 'Canada']"
      placeholder="hover +N 查看"
    />
  </div>
</template>
