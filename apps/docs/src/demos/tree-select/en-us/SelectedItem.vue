<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { createTreeData } from '../data';
const treeData = createTreeData('en-us', 'selected');
</script>
<template>
  <div>
    <h4>Single TreeSelect</h4>
    <TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      ><template #selectedItem="{ node }">{{ node.label }}</template></TreeSelect
    >
    <h4>Multiple + isRenderInTag=true</h4>
    <TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      :render-selected-item="(node) => ({ content: node.label, isRenderInTag: true })"
    />
    <h4>Multiple + isRenderInTag=false</h4>
    <TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      :max-tag-count="2"
      ><template #selectedItem="{ node, index }"
        ><Tag :key="index" color="white">{{ node.value }}</Tag></template
      ></TreeSelect
    >
  </div>
</template>
