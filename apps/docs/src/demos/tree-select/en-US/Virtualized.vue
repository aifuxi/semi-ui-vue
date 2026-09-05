<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
import { shallowRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const treeData = shallowRef<TreeNodeData[]>([]);
const total = shallowRef(0);
function generate() {
  let count = 0;
  function level(depth: number, prefix = '0'): TreeNodeData[] {
    return Array.from({ length: 5 }, (_, i) => {
      count++;
      const key = prefix + '-' + i;
      return {
        label: key + '-label',
        key: key + '-key',
        value: key + '-value',
        ...(depth >= 0 && i < 4 ? { children: level(depth - 1, key) } : {}),
      };
    });
  }
  treeData.value = level(3);
  total.value = count;
}
import type { TreeNodeData } from '@aifuxi/semi-ui-vue/tree-select';
</script>
<template>
  <div style="padding: 0 20px">
    <Button @click="generate">Generate Data: </Button><span>In total: {{ total }}</span
    ><br /><br /><TreeSelect
      v-if="treeData.length"
      :style="{ width: '300px' }"
      :tree-data="treeData"
      filter-tree-node
      show-filtered-only
      placeholder="Please select"
      :dropdown-style="{ overflow: 'hidden' }"
      :virtualize="{ itemSize: 28, height: 236 }"
    />
  </div>
</template>
