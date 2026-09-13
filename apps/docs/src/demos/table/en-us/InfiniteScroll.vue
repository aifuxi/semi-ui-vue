<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import { Table, type TableVirtualizedOnScrollArgs } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, generatedRows, type FileRow } from './third-batch-virtual-fixture';

const columns = fileColumns();
const data = shallowRef<FileRow[]>([]);
const scroll = { y: 600, x: 1000 };
function loadMore() {
  data.value = [...data.value, ...generatedRows(20, data.value.length)];
}
const itemSize = 56;
const virtualized = {
  itemSize,
  onScroll: ({
    scrollDirection,
    scrollOffset = 0,
    scrollUpdateWasRequested,
  }: TableVirtualizedOnScrollArgs) => {
    if (
      scrollDirection === 'forward' &&
      scrollOffset >= (data.value.length - Math.ceil(scroll.y / itemSize) * 1.5) * itemSize &&
      !scrollUpdateWasRequested
    ) {
      loadMore();
    }
  },
};
onMounted(loadMore);
</script>

<template>
  <Table
    :pagination="false"
    :columns="columns"
    :data-source="data"
    :scroll="scroll"
    :style="{ width: '750px', margin: '0 auto' }"
    :virtualized="virtualized"
  />
</template>
