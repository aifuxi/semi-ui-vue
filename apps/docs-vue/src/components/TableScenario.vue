<script setup lang="ts">
import { h } from 'vue';
import { ConfigProvider, Table, type ConfigDirection, type TableColumnProps } from '@workspace/ui';

defineProps<{ direction: ConfigDirection }>();

const data = [
  { key: 'gateway', name: 'API Gateway', owner: '平台组', status: '运行中' },
  { key: 'worker', name: 'Job Worker', owner: '任务组', status: '维护中' },
  { key: 'storage', name: 'Object Storage', owner: '数据组', status: '运行中' },
];

const columns: TableColumnProps[] = [
  { dataIndex: 'name', key: 'name', title: '资源名称', width: 220 },
  {
    dataIndex: 'status',
    key: 'status',
    title: '状态',
    width: 120,
    render: (value) => h('span', { class: 'table-scenario__status' }, String(value)),
  },
  { dataIndex: 'owner', key: 'owner', title: '负责人', width: 160 },
];
</script>

<template>
  <ConfigProvider :direction="direction">
    <div class="table-scenario" data-testid="table-vue">
      <Table
        data-parity-target="table-basic"
        bordered
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :row-selection="{ selectedRowKeys: ['gateway'], width: 50 }"
        :scroll="{ x: 560 }"
        size="middle"
      />
    </div>
  </ConfigProvider>
</template>
