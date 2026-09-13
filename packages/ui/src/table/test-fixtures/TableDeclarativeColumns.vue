<script setup lang="ts">
import { ref } from 'vue';
import { Table, type TableColumnProps } from '../index';

const data = [
  { key: 'a', name: 'Alpha', score: 2, state: 'Ready' },
  { key: 'b', name: 'Beta', score: 1, state: 'Pending' },
];
const filters = [{ text: 'Alpha only', value: 'Alpha' }];
const filtered = ref<string[]>([]);
const filterName: NonNullable<TableColumnProps['onFilter']> = (value, record) =>
  record?.name === value;
const sortScore: NonNullable<Exclude<TableColumnProps['sorter'], boolean>> = (a, b) =>
  Number(a.score) - Number(b.score);
</script>

<template>
  <button @click="filtered = filtered.length ? [] : ['Alpha']">Toggle filter</button>
  <Table :data-source="data" :pagination="false">
    <Table.Column title="Details">
      <Table.Column
        title="Name"
        data-index="name"
        :width="100"
        fixed
        :filters="filters"
        :filtered-value="filtered"
        :on-filter="filterName"
      />
      <Table.Column
        title="Score"
        data-index="score"
        :width="100"
        :fixed="false"
        :sorter="sortScore"
        default-sort-order="ascend"
      />
    </Table.Column>
    <Table.Column title="State" data-index="state" />
  </Table>
</template>
