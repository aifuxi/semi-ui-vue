<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import { Title } from '@aifuxi/semi-ui-vue/typography';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/cascader.css';
import '@aifuxi/semi-theme-default/typography.css';
import '@aifuxi/semi-theme-default/tooltip.css';
import { h } from 'vue';
import type { CascaderData } from '@aifuxi/semi-ui-vue/cascader';
const treeData = [
  {
    label: 'Impressionism',
    value: 'impressionism',
    children: [
      {
        label: 'Visual Arts',
        value: 'visualArts',
        children: [
          { label: 'Claude Monet', value: 'Monet' },
          { label: 'Pierre-Auguste Renoir', value: 'Renoir' },
          { label: 'Édouard Manet', value: 'Manet' },
        ],
      },
      {
        label: 'Music',
        value: 'music',
        children: [
          { label: 'Claude Debussy', value: 'Debussy' },
          { label: 'Maurice Ravel', value: 'Ravel' },
        ],
      },
    ],
  },
];
// Data fields require VNodes; all interactive demo structure remains in the template.
const labelNodeTreeData: CascaderData[] = [
  {
    label: h(Tooltip, { content: 'Other info' }, { default: () => 'Impressionism' }),
    labelText: 'Impressionism',
    value: 'impressionism',
    children: [
      {
        label: h(Tooltip, { content: 'Other info' }, { default: () => 'Visual Arts' }),
        labelText: 'Visual Arts',
        value: 'visualArts',
        children: [
          {
            label: h(Tooltip, { content: 'Other info' }, { default: () => 'Claude Monet' }),
            labelText: 'Claude Monet',
            value: 'Monet',
          },
          {
            label: h(
              Tooltip,
              { content: 'Other info' },
              { default: () => "'Pierre-Auguste Renoir" },
            ),
            labelText: 'Pierre-Auguste Renoir',
            value: 'Renoir',
          },
          {
            label: h(Tooltip, { content: 'Other info' }, { default: () => 'Édouard Manet' }),
            labelText: 'Édouard Manet',
            value: 'Manet',
          },
        ],
      },
      {
        label: h(Tooltip, { content: 'Other info' }, { default: () => 'Music' }),
        labelText: 'Music',
        value: 'music',
        children: [
          {
            label: h(Tooltip, { content: 'Other info' }, { default: () => 'Claude Debussy' }),
            labelText: 'Claude Debussy',
            value: 'Debussy',
          },
          {
            label: h(Tooltip, { content: 'Other info' }, { default: () => 'Maurice Ravel' }),
            labelText: 'Maurice Ravel',
            value: 'Ravel',
          },
        ],
      },
    ],
  },
];
</script>
<template>
  <div>
    <div>
      <Cascader
        :style="{ width: '300px' }"
        :tree-data="treeData"
        placeholder="Search in label by default"
        filter-tree-node
      ></Cascader>
      <br />
      <br />
      <Cascader
        :style="{ width: '300px' }"
        :tree-data="treeData"
        placeholder="Search in value"
        filter-tree-node
        tree-node-filter-prop="value"
      ></Cascader>
      <br />
      <br />
      <Title :heading="6">filterLeafOnly=false:</Title>
      <Cascader
        :style="{ width: '300px' }"
        :tree-data="treeData"
        placeholder="filterLeafOnly=false"
        filter-tree-node
        :filter-leaf-only="false"
      ></Cascader>
      <br />
      <br />
      <Title :heading="6">Label is VNodeChild, specify other attributes to search</Title>
      <Cascader
        :style="{ width: '300px' }"
        :tree-data="labelNodeTreeData"
        placeholder="Search for labelText"
        filter-tree-node
        tree-node-filter-prop="labelText"
      ></Cascader>
    </div>
  </div>
</template>
