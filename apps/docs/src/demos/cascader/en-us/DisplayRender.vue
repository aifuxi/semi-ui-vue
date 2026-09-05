<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import { Title } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/cascader.css';
import '@aifuxi/semi-theme-default/tag.css';
import '@aifuxi/semi-theme-default/typography.css';
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
</script>
<template>
  <div>
    <Title :heading="6">single selection</Title
    ><Cascader
      style="width: 300px"
      :tree-data="treeData"
      placeholder="Please select"
      :default-value="['impressionism', 'visualArts', 'Monet']"
      ><template #display="{ selected }"
        >Selected：{{ Array.isArray(selected) ? selected.join(' -> ') : '' }}</template
      ></Cascader
    ><br /><br /><Title :heading="6">multiple selection</Title
    ><Cascader
      multiple
      style="width: 300px"
      :tree-data="treeData"
      :default-value="['impressionism', 'visualArts', 'Monet']"
      placeholder="Please select"
      ><template #display="{ selected, index }"
        ><Tag
          v-if="!Array.isArray(selected)"
          :key="index"
          style="margin-right: 4px"
          color="white"
          >{{ selected.data.label }}</Tag
        ></template
      ></Cascader
    >
  </div>
</template>
