<script setup lang="ts">
import { InputGroup } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { Select, SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
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
    <InputGroup>
      <Select :style="{ width: '100px' }" default-value="from">
        <SelectOption value="from">From: </SelectOption>
        <SelectOption value="to">To: </SelectOption>
      </Select>
      <TreeSelect
        :style="{ width: '220px' }"
        :tree-data="treeData"
        placeholder="Please select"
      ></TreeSelect>
    </InputGroup>
    <br /><br />

    <InputGroup>
      <Select :style="{ width: '100px' }" default-value="from">
        <SelectOption value="from">From: </SelectOption>
        <SelectOption value="to">To: </SelectOption>
      </Select>
      <Cascader
        :style="{ width: '220px' }"
        :tree-data="treeData"
        placeholder="Please select"
      ></Cascader>
    </InputGroup>
  </div>
</template>
