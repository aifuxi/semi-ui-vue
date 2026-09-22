<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { createTreeData } from '../data';
const treeData = createTreeData('zh-cn', 'selected');
</script>
<template>
  <div>
    <h4>单选</h4>
    <TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      ><template #selectedItem="{ node }">{{ node.label }}</template></TreeSelect
    >
    <h4>多选 + isRenderInTag=true</h4>
    <TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      :render-selected-item="(node) => ({ content: node.label, isRenderInTag: true })"
    />
    <h4>多选 + isRenderInTag=false</h4>
    <TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      multiple
      :max-tag-count="2"
      ><template #selectedItem="{ node, index, onClose }"
        ><Tag :key="index" color="white" closable @close="() => onClose()">{{
          node.value
        }}</Tag></template
      ></TreeSelect
    >
  </div>
</template>
