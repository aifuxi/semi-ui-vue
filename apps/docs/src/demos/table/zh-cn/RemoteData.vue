<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, generatedRows, type FileRow } from './first-batch-fixture';
import { shallowRef, onMounted, onBeforeUnmount } from 'vue';

const columns = fileColumns('zh-cn', 6);
const data: FileRow[] = generatedRows('zh-cn', 6);
const dataSource = shallowRef<FileRow[]>([]);
const currentPage = shallowRef(1);
const loading = shallowRef(false);
let timer: ReturnType<typeof setTimeout> | undefined;
function fetchData(page = 1) {
  loading.value = true;
  currentPage.value = page;
  timer = setTimeout(() => {
    dataSource.value = generatedRows('zh-cn', 6).slice((page - 1) * 5, page * 5);
    loading.value = false;
  }, 300);
}
onMounted(() => fetchData());
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <Table
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="{ currentPage, pageSize: 5, total: data.length, onChange: fetchData }"
  ></Table>
</template>
