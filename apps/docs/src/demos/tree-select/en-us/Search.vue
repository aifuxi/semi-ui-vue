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
const treeData = createTreeData('en-us', 'search');
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
      placeholder="Single Searchable TreeSelect"
      @search="onSearch"
    /><br /><br /><TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      filter-tree-node
      :max-tag-count="2"
      :show-filtered-only="showFilteredOnly"
      placeholder="Multiple Searchable TreeSelect"
      search-placeholder="Start searching"
      @search="onSearch"
    /><br /><br /><TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      filter-tree-node
      :max-tag-count="2"
      :show-filtered-only="showFilteredOnly"
      placeholder="search input autofocus"
      search-placeholder="autofocus"
      search-auto-focus
      @search="onSearch"
    />
  </div>
</template>
