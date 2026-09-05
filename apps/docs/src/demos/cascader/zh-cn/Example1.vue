<script setup lang="ts">
import { ref } from 'vue';
import { Cascader, type CascaderData, type CascaderValue } from '@aifuxi/semi-ui-vue/cascader';

const value = ref<CascaderValue>(['asia', 'china', 'shanghai']);
const treeData: CascaderData[] = [
  {
    label: '亚洲',
    value: 'asia',
    children: [
      {
        label: '中国',
        value: 'china',
        children: [{ label: '上海', value: 'shanghai' }],
      },
    ],
  },
];
import '@aifuxi/semi-theme-default/cascader.css';
</script>

<template>
  <Cascader
    v-model="value"
    :tree-data="treeData"
    filter-tree-node
    placeholder="请选择城市"
    show-clear
    :style="{ width: '300px' }"
  />
</template>
