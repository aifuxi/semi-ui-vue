<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
import { shallowRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const treeData = shallowRef<TreeNodeData[]>([]);
let revision = 0;
function update() {
  revision++;
  treeData.value = Array.from({ length: (revision % 5) + 1 }, (_, i) => ({
    key: String(i),
    value: String(i),
    label: 'Item-' + i,
    children: Array.from({ length: (revision + i) % 3 }, (_, j) => ({
      key: i + '-' + j,
      value: i + '-' + j,
      label: 'Leaf-' + i + '-' + j,
    })),
  }));
}
import type { TreeNodeData } from '@aifuxi/semi-ui-vue/tree-select';
</script>
<template>
  <div>
    <TreeSelect
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      placeholder="请选择"
    /><br /><br /><Button @click="update">动态改变数据</Button>
  </div>
</template>
