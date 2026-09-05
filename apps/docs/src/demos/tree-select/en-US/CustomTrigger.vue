<script setup lang="ts">
import type { TreeNodeData } from '@aifuxi/semi-ui-vue/tree-select';
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag-input.css';
import '@aifuxi/semi-theme-default/tag.css';
import { createTreeData } from '../data';
const treeData = createTreeData('en-us', 'basic');
</script>
<template>
  <TreeSelect
    :style="{ width: '300px' }"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    multiple
    filter-tree-node
    search-position="trigger"
    placeholder="Custom Trigger"
    ><template #trigger="{ value, inputValue, onSearch, onRemove }"
      ><TagInput
        :input-value="inputValue"
        :value="value.map((item: TreeNodeData) => item.key!)"
        @input-change="onSearch"
        ><template #tag="{ value: key }"
          ><Tag :style="{ marginLeft: '2px' }" :tag-key="key" closable @close="onRemove(key)">{{
            value.find((item: TreeNodeData) => item.key! === key)?.label
          }}</Tag></template
        ></TagInput
      ></template
    ></TreeSelect
  >
</template>
