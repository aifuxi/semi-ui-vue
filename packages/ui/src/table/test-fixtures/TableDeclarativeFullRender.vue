<script setup lang="ts">
import { h } from 'vue';
import { Table, type TableColumnProps } from '../index';

const data = [
  { key: 'a', name: 'Alpha' },
  { key: 'b', name: 'Beta' },
];
const renderTitle: TableColumnProps['title'] = (options) =>
  h('span', { class: 'custom-title' }, [options?.selection, 'Name']);
const renderName: TableColumnProps['render'] = (text, _record, _index, options) =>
  h('span', { class: 'custom-cell' }, [options?.selection, String(text)]);
</script>

<template>
  <Table :data-source="data" :pagination="false" :row-selection="{ hidden: true }">
    <Table.Column data-index="name" use-full-render :title="renderTitle" :render="renderName" />
  </Table>
</template>
