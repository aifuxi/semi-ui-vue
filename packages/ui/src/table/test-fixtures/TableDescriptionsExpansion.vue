<script setup lang="ts">
import { h } from 'vue';
import { Table } from '../index';
import { Descriptions } from '../../descriptions';
import { Tag } from '../../tag';

const details = [{ key: 'Category', value: h(Tag, { style: { margin: '0px' } }, () => 'Design') }];
const columns = [{ dataIndex: 'name', title: 'Name' }];
const rows = [{ key: 'a', name: 'Alpha' }];
</script>

<template>
  <Table :columns="columns" :data-source="rows" :pagination="false">
    <template #expandedRow><Descriptions :data="details" align="justify" /></template>
  </Table>
</template>
