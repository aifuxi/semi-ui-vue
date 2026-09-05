<script setup lang="ts">
import { h, shallowRef, computed, onMounted, onBeforeUnmount } from 'vue';
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/table.css';
import '@aifuxi/semi-theme-default/avatar.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import { IconTickCircle, IconClear, IconComment } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/tag.css';

const figmaIcon = '/demos/one.svg';
type Row = Record<string, unknown>;
function makeData(total: number): Row[] {
  return Array.from({ length: total }, (_, index) => ({
    key: String(index),
    name: `${index % 2 ? 'Semi D2C' : 'Semi Design'} design${index}.fig`,
    nameIconSrc: figmaIcon,
    size: (index * 1000) % 199,
    owner: index % 2 ? 'Hao Xuan' : 'Jiang Pengzhi',
    status: index % 3 === 0 ? 'success' : index % 3 === 1 ? 'pending' : 'wait',
    updateTime: new Date(Date.UTC(2020, 1, 2) + ((index * 1000) % 199) * 86400000)
      .toISOString()
      .slice(0, 10),
    avatarBg: index % 2 ? 'red' : 'grey',
  }));
}
const baseColumns: TableColumnProps[] = [
  {
    title: 'Title',
    dataIndex: 'name',
    width: 400,
    render: (text, record) =>
      h('span', { style: { display: 'inline-flex', alignItems: 'center' } }, [
        h(Avatar, {
          size: 'small',
          shape: 'square',
          src: String(record.nameIconSrc),
          style: { marginRight: '12px' },
        }),
        String(text),
      ]),
  },
  { title: 'Size', dataIndex: 'size', width: 150, render: (text) => `${text} KB` },
  {
    title: 'Owner',
    dataIndex: 'owner',
    width: 200,
    render: (text, record) =>
      h('span', [
        h(
          Avatar,
          {
            size: 'small',
            color: record.avatarBg as 'red' | 'grey',
            style: { marginRight: '4px' },
          },
          () => String(text).slice(0, 1),
        ),
        String(text),
      ]),
  },
  { title: 'Updated', dataIndex: 'updateTime', width: 200 },
];
const statusColumn: TableColumnProps = {
  title: 'Delivery status',
  dataIndex: 'status',
  render: (text) => {
    const key = String(text);
    const color = key === 'success' ? 'green' : key === 'pending' ? 'pink' : 'cyan';
    const icon = key === 'success' ? IconTickCircle : key === 'pending' ? IconClear : IconComment;
    const label =
      key === 'success' ? 'Delivered' : key === 'pending' ? 'Delayed' : 'Pending review';
    return h(
      Tag,
      { shape: 'circle', color, prefixIcon: h(icon), style: { userSelect: 'text' } },
      () => label,
    );
  },
};

const allData = makeData(46);
const data = shallowRef<Row[]>([]);
const loading = shallowRef(false);
const currentPage = shallowRef(1);
const pageSize = 5;
const columns = [...baseColumns.slice(0, 2), statusColumn, ...baseColumns.slice(2)];
const currentStart = computed(() => (currentPage.value - 1) * pageSize + 1);
const currentEnd = computed(() => Math.min(currentPage.value * pageSize, allData.length));
let timer: ReturnType<typeof setTimeout> | undefined;
function loadPage(page: number) {
  clearTimeout(timer);
  loading.value = true;
  currentPage.value = page;
  timer = setTimeout(() => {
    data.value = allData.slice((page - 1) * pageSize, page * pageSize);
    loading.value = false;
  }, 500);
}
onMounted(() => loadPage(1));
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div>
    <!-- The response already contains one page; a separate Pagination avoids slicing it twice. -->
    <Table :columns="columns" :data-source="data" :loading="loading" :pagination="false"></Table>
    <div class="semi-table-pagination-outer">
      <span class="semi-table-pagination-info"
        >Showing {{ currentStart }} to {{ currentEnd }} of {{ allData.length }}</span
      >
      <span class="semi-table-pagination-wrapper">
        <Pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="allData.length"
          @page-change="loadPage"
        />
      </span>
    </div>
  </div>
</template>
