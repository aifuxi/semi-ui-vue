<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
import { shallowRef } from 'vue';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
const showFilteredOnly = shallowRef(false);
function onSearch(input: string, keys: string[], nodes: TreeNodeData[]) {
  console.log('onSearch', input, keys, nodes);
}
import { createTreeData } from '../data';
import type { TreeNodeData } from '@aifuxi/semi-ui-vue/tree-select';
const treeData = createTreeData('zh-cn', 'search');
</script>
<template>
  <div>
    <span>showFilteredOnly</span
    ><Switch
      v-model="showFilteredOnly"
      size="small"
      aria-label="showFilteredOnly"
    /><br /><br /><TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      filter-tree-node
      :show-filtered-only="showFilteredOnly"
      placeholder="单选可搜索的"
      @search="onSearch"
    /><br /><br /><TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      filter-tree-node
      :max-tag-count="2"
      :show-filtered-only="showFilteredOnly"
      placeholder="多选可搜索的"
      search-placeholder="请输入关键字开始搜索"
      @search="onSearch"
    /><br /><br /><TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      filter-tree-node
      :max-tag-count="2"
      :show-filtered-only="showFilteredOnly"
      placeholder="搜索框autofocus"
      search-placeholder="autofocus"
      search-auto-focus
      @search="onSearch"
    />
  </div>
</template>
