<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const json = shallowRef<Record<string, unknown>>({
  Node1: { 'Child Node1': '0-0-1', 'Child Node2': '0-0-2' },
  Node2: '0-1',
});
const nextJson = {
  Node3: {
    'Child Node1': '0-0-1',
    'Child Node2': '0-0-2',
    'Child Node3': '0-0-3',
    'Child Node4': '0-0-4',
  },
  Node2: '0-1',
};
const treeStyle = { width: '260px', height: '420px', border: '1px solid var(--semi-color-border)' };
</script>

<template>
  <Button style="margin-bottom: 10px" @click="json = nextJson">Update TreeData</Button>
  <div style="display: flex; gap: 20px">
    <div>
      <span>defaultExpandAll</span
      ><Tree default-expand-all :tree-data-simple-json="json" :style="treeStyle" />
    </div>
    <div>
      <span>expandAll</span><Tree expand-all :tree-data-simple-json="json" :style="treeStyle" />
    </div>
  </div>
</template>
