<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
import { shallowRef } from 'vue';
const value = shallowRef<TreeValue>('Shanghai');
import { createTreeData } from '../data';
import type { TreeValue } from '@aifuxi/semi-ui-vue/tree-select';
const treeData = createTreeData('en-us', 'basic');
</script>
<template>
  <TreeSelect
    v-model="value"
    :style="{ width: '300px' }"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    placeholder="Please select"
  />
</template>
