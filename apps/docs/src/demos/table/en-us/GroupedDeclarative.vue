<script setup lang="ts">
import { h } from 'vue';
import { Table } from '@aifuxi/semi-ui-vue/table';
import { IconMore } from '@aifuxi/semi-icons-vue';
import {
  filterName,
  logChange,
  makeData,
  nameFilters,
  renderDate,
  renderName,
  renderOwner,
  sortSize,
  sortUpdate,
} from './third-batch-render-fixture';

const data = makeData(46);
</script>

<template>
  <Table
    :data-source="data"
    :row-selection="{ fixed: true }"
    :scroll="{ y: 400 }"
    @change="logChange"
  >
    <Table.Column title="Basic Info" fixed="left">
      <Table.Column
        title="Title"
        data-index="name"
        :width="300"
        fixed
        :render="(text: unknown) => renderName(text, 'span')"
        :filters="nameFilters"
        :on-filter="filterName"
      />
      <Table.Column
        title="Size"
        data-index="size"
        :width="100"
        fixed
        :render="(text: unknown) => `${text} KB`"
        :sorter="sortSize"
      />
    </Table.Column>
    <Table.Column title="Others Info">
      <Table.Column title="Owner" data-index="owner" :render="renderOwner" />
      <Table.Column
        title="Update"
        data-index="updateTime"
        :sorter="sortUpdate"
        :render="renderDate"
      />
    </Table.Column>
    <Table.Column
      title="More"
      data-index="operate"
      fixed="right"
      :width="100"
      align="center"
      :render="() => h(IconMore)"
    />
    <template #expandedRow="{ record }">
      <article>{{ record.name }}</article>
    </template>
  </Table>
</template>
