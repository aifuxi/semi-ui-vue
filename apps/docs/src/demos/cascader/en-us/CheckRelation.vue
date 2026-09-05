<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
const treeData = [
  {
    label: 'Asia',
    value: 'Asia',
    key: '0',
    children: [
      {
        label: 'China',
        value: 'China',
        key: '0-0',
        children: [
          { label: 'Beijing', value: 'Beijing', key: '0-0-0' },
          { label: 'Shanghai', value: 'Shanghai', key: '0-0-1' },
        ],
      },
    ],
  },
  { label: 'North America', value: 'North America', key: '1' },
];
</script>
<template>
  <div>
    <Cascader
      multiple
      :default-value="[['Asia'], ['Asia', 'China', 'Beijing']]"
      check-relation="unRelated"
      :style="{ width: '300px' }"
      :tree-data="treeData"
    ></Cascader>
  </div>
</template>
