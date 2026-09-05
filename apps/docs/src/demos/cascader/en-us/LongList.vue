<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
const treeData = [
  {
    label: 'A',
    value: 'A',
    children: [
      {
        label: 'B',
        value: 'B',
        children: [
          {
            label: 'C',
            value: 'C',
            children: [
              {
                label: 'D',
                value: 'D',
                children: [{ label: 'E', value: 'E', children: [{ label: 'F', value: 'F' }] }],
              },
            ],
          },
        ],
      },
    ],
  },
];
</script>
<template>
  <div>
    <Cascader
      dropdown-class-name="components-cascader-demo"
      :style="{ width: '300px' }"
      :tree-data="treeData"
    ></Cascader>
  </div>
</template>

<style>
.components-cascader-demo .semi-cascader-option-lists {
  max-width: 510px;
  overflow-x: auto;
}
</style>
