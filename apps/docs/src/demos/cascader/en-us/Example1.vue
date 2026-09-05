<script setup lang="ts">
import { ref } from 'vue';
import { Cascader, type CascaderData, type CascaderValue } from '@aifuxi/semi-ui-vue/cascader';

const value = ref<CascaderValue>(['asia', 'china', 'shanghai']);
const treeData: CascaderData[] = [
  {
    label: 'Asia',
    value: 'asia',
    children: [
      {
        label: 'China',
        value: 'china',
        children: [{ label: 'Shanghai', value: 'shanghai' }],
      },
    ],
  },
];
import '@aifuxi/semi-theme-default/cascader.css';
</script>

<template>
  <Cascader v-model="value" :tree-data="treeData" filter-tree-node show-clear />
</template>
