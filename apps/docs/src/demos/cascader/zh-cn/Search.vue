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
    label: '浙江省',
    value: 'zhejiang',
    children: [
      {
        label: '杭州市',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '萧山区', value: 'xiaoshan' },
          { label: '临安区', value: 'linan' },
        ],
      },
      {
        label: '宁波市',
        value: 'ningbo',
        children: [
          { label: '海曙区', value: 'haishu' },
          { label: '江北区', value: 'jiangbei' },
        ],
      },
    ],
  },
];
// Data fields require VNodes; all interactive demo structure remains in the template.
const labelNodeTreeData: CascaderData[] = [
  {
    label: h(Tooltip, { content: '说明' }, { default: () => '浙江省' }),
    labelText: '浙江省',
    value: 'zhejiang',
    children: [
      {
        label: h(Tooltip, { content: '说明' }, { default: () => '杭州市' }),
        labelText: '杭州市',
        value: 'hangzhou',
        children: [
          {
            label: h(Tooltip, { content: '说明' }, { default: () => '西湖区' }),
            labelText: '西湖区',
            value: 'xihu',
          },
          {
            label: h(Tooltip, { content: '说明' }, { default: () => '萧山区' }),
            labelText: '萧山区',
            value: 'xiaoshan',
          },
          {
            label: h(Tooltip, { content: '说明' }, { default: () => '临安区' }),
            labelText: '临安区',
            value: 'linan',
          },
        ],
      },
      {
        label: h(Tooltip, { content: '说明' }, { default: () => '宁波市' }),
        labelText: '宁波市',
        value: 'ningbo',
        children: [
          {
            label: h(Tooltip, { content: '说明' }, { default: () => '海曙区' }),
            labelText: '海曙区',
            value: 'haishu',
          },
          {
            label: h(Tooltip, { content: '说明' }, { default: () => '江北区' }),
            labelText: '江北区',
            value: 'jiangbei',
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
        placeholder="默认对label值进行搜索"
        filter-tree-node
      ></Cascader>
      <br />
      <br />
      <Cascader
        :style="{ width: '300px' }"
        :tree-data="treeData"
        placeholder="对value值进行搜索"
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
      <Title :heading="6">Label 为 VNodeChild，指定其他属性进行搜索</Title>
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
