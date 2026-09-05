<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { generateTreeData } from '../treeOperations';
const treeData = shallowRef<TreeNodeData[]>([]);
const total = shallowRef(0);
function generate() {
  const result = generateTreeData();
  treeData.value = result.nodes;
  total.value = result.total;
}
</script>

<template>
  <div style="padding: 0 20px">
    <Button @click="generate">生成数据</Button><span role="status">共 {{ total }} 个节点</span
    ><br /><br /><Tree
      v-if="treeData.length"
      :tree-data="treeData"
      filter-tree-node
      show-filtered-only
      style="width: 260px; border: 1px solid var(--semi-color-border)"
      :virtualize="{ height: 300, itemSize: 28 }"
    />
  </div>
</template>
