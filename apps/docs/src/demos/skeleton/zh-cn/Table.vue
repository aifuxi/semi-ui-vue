<script setup lang="ts">
import { h } from 'vue';
import { Skeleton, SkeletonTitle, SkeletonParagraph } from '@aifuxi/semi-ui-vue/skeleton';
import '@aifuxi/semi-theme-default/skeleton.css';
import { Table } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';
const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Address', dataIndex: 'address' },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
  },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
  { key: '4', name: 'Disabled User', age: 99, address: 'Sidney No. 1 Lake Park' },
];
const placeholderColumns = [1, 2, 3].map((key) => ({
  title: h(SkeletonTitle, { style: { width: '0' } }),
  dataIndex: String(key),
}));
const placeholderData = [1, 2, 3, 4].map((key) => ({
  key,
  ...Object.fromEntries(
    [1, 2, 3].map((index) => [
      String(index),
      h(SkeletonParagraph, { style: { width: `${50 * index}px` }, rows: 1 }),
    ]),
  ),
}));
</script>

<template>
  <Skeleton :loading="true">
    <template #placeholder>
      <div style="position: relative">
        <Table
          style="background-color: var(--semi-color-bg-1)"
          :columns="placeholderColumns"
          :data-source="placeholderData"
          :pagination="false"
        />
        <div style="position: absolute; left: 0; right: 0; top: 0; bottom: 0"></div>
      </div>
    </template>
    <div><Table :columns="columns" :data-source="data" :pagination="false" /></div>
  </Skeleton>
</template>
