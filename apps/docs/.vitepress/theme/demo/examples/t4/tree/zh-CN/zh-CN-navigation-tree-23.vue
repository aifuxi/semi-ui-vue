<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const treeData = shallowRef<TreeNodeData[]>([{ key: '0', label: 'item-0', value: '0' }]);
let generation = 0;
function update() {
  generation++;
  treeData.value = Array.from({ length: (generation % 5) + 1 }, (_, index) => ({
    key: String(index),
    label: `Item-${index}`,
    value: String(index),
    children: Array.from({ length: (generation + index) % 3 }, (_, child) => ({
      key: `${index}-${child}`,
      label: `Leaf-${index}-${child}`,
      value: `${index}-${child}`,
    })),
  }));
}
const treeStyle = { width: '260px', height: '420px', border: '1px solid var(--semi-color-border)' };
</script>

<template>
  <div :style="treeStyle">
    <Tree :tree-data="treeData" /><br /><Button style="margin: 20px" @click="update"
      >动态改变数据</Button
    >
  </div>
</template>
