<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import { Title } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/cascader.css';
import '@aifuxi/semi-theme-default/typography.css';
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
</script>
<template>
  <div>
    <Title :heading="6">单选</Title>
    <Cascader
      :style="{ width: '300px' }"
      :tree-data="treeData"
      placeholder="回填时显示数据的value值"
      display-prop="value"
      :default-value="['zhejiang', 'ningbo', 'jiangbei']"
    ></Cascader>
    <br />
    <br />
    <Title :heading="6">多选</Title>
    <Cascader
      multiple
      :style="{ width: '300px' }"
      :tree-data="treeData"
      :default-value="['zhejiang', 'ningbo', 'jiangbei']"
      placeholder="回填时显示数据的value值"
      display-prop="value"
    ></Cascader>
  </div>
</template>
