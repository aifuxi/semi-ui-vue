<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import {
  makeData,
  renderDate,
  renderName,
  renderOwner,
  sortUpdate,
  type Row,
} from './third-batch-render-fixture';

const data = shallowRef<Row[]>([]);
onMounted(() => {
  data.value = makeData(5);
});
const columns: TableColumnProps[] = [
  {
    title: 'Title',
    dataIndex: 'name',
    width: 400,
    render: (text, _record, index) => ({
      children: renderName(text),
      ...(index === 0
        ? { props: { colSpan: 4 } }
        : index === 1
          ? { props: { rowSpan: 2 } }
          : index === 2
            ? { props: { rowSpan: 0 } }
            : {}),
    }),
  },
  {
    title: 'Size',
    dataIndex: 'size',
    render: (text, _record, index) => {
      const children = `${text} KB`;
      if (index === 0) return { children, props: { colSpan: 0 } };
      if (index === 1) return { children, props: { rowSpan: 2 } };
      if (index === 2) return { children, props: { rowSpan: 0 } };
      return children;
    },
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    render: (text, record, index) => {
      const children = renderOwner(text, record);
      return index === 0 ? { children, props: { colSpan: 0 } } : children;
    },
  },
  {
    title: 'Update',
    dataIndex: 'updateTime',
    sorter: sortUpdate,
    render: (value, _record, index) => {
      const children = renderDate(value);
      if (index === 0) return { children, props: { colSpan: 0 } };
      if (index === 1) return { children, props: { rowSpan: 2 } };
      if (index === 2) return { children, props: { rowSpan: 0 } };
      return children;
    },
  },
];
</script>

<template>
  <Table :columns="columns" :data-source="data" :pagination="false" />
</template>
