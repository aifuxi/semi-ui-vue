<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree, type TreeValue } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
const json = { Node1: { 'Child Node1': '0-0-1', 'Child Node2': '0-0-2' }, Node2: '0-1' };
const treeStyle = { width: '260px', height: '420px', border: '1px solid var(--semi-color-border)' };
const selected = shallowRef<TreeValue>();
const key = shallowRef('');
</script>

<template>
  <Tree
    :tree-data-simple-json="json"
    multiple
    :style="treeStyle"
    @change="selected = $event"
    @select="key = $event"
  />
  <p role="status">{{ selected }} · {{ key }}</p>
</template>
