<script setup lang="ts">
import { h } from 'vue';
import { ConfigProvider, type ConfigDirection } from '@aifuxi/semi-ui-vue/config-provider';
import {
  Table,
  type TableColumnProps,
  type TableProps,
  type TableSize,
} from '@aifuxi/semi-ui-vue/table';

defineProps<{ direction: ConfigDirection }>();

/** Review query 仅选择真实公开 props，不改变默认场景。 */
const reviewQuery = new URLSearchParams(window.location.search);
/** 三档表格密度需要分别观察文字与行高。 */
const reviewSize = (
  ['small', 'default', 'middle'].includes(reviewQuery.get('reviewSize') ?? '')
    ? reviewQuery.get('reviewSize')
    : 'middle'
) as TableSize;
/** loading/empty/disabled 与排序筛选分别覆盖表格可见状态分支。 */
const reviewState = reviewQuery.get('reviewState');
/** 结构变体仍复用真实 Table，不使用样式或手工 DOM 模拟。 */
const reviewVariant = reviewQuery.get('reviewVariant');
/** group 的节点标题与字符串返回值分开观察，二者在固定基线中语义不同。 */
const reviewGroupNode = reviewQuery.get('reviewGroupContent') === 'node';

const data = [
  { key: 'gateway', name: 'API Gateway', owner: '平台组', status: '运行中' },
  { key: 'worker', name: 'Job Worker', owner: '任务组', status: '维护中' },
  { key: 'storage', name: 'Object Storage', owner: '数据组', status: '运行中' },
];
/** 树表同时包含父、子、孙三级，核对缩进、展开图标与正文基线。 */
const treeData = [
  {
    ...data[0]!,
    children: [
      {
        key: 'route',
        name: 'Route Service',
        owner: '平台组',
        status: '运行中',
        children: [{ key: 'route-cache', name: 'Route Cache', owner: '平台组', status: '维护中' }],
      },
      { key: 'auth', name: 'Auth Service', owner: '平台组', status: '运行中' },
    ],
  },
  data[1]!,
  data[2]!,
];
/** 四十行足以实际滚动到中部/底部，避免仅验证虚拟列表首屏。 */
const virtualData = Array.from(
  { length: 40 },
  /** 短标签与普通表格相同，数字序号用于确认窗口切换。 */
  (_, index) => ({
    key: `resource-${index}`,
    name: `资源 ${String(index + 1).padStart(2, '0')}`,
    owner: '平台组',
    status: index % 2 ? '维护中' : '运行中',
  }),
);
/** 结构专项的真实数据源，缺省继续使用原始三行。 */
const reviewData =
  reviewVariant === 'tree'
    ? treeData
    : reviewVariant === 'virtual'
      ? virtualData
      : reviewState === 'empty'
        ? []
        : data;
/** 用公开 props 开启结构分支；未开启的 props 保持缺省。 */
const structureProps: TableProps =
  reviewVariant === 'expanded'
    ? {
        hideExpandedColumn: false,
        defaultExpandedRowKeys: ['gateway'],
        /** 展开内容含标题/正文，直接观察主题排版继承。 */
        expandedRowRender: (record) =>
          h('div', [
            h('strong', '资源详情'),
            h('p', { style: { margin: '8px 0 0' } }, `当前资源：${String(record?.name ?? '')}`),
          ]),
      }
    : reviewVariant === 'tree'
      ? { defaultExpandedRowKeys: ['gateway', 'route'] }
      : reviewVariant === 'group'
        ? {
            groupBy: 'owner',
            defaultExpandAllGroupRows: true,
            /** 固定回调接收分组 key 和记录键，内容长度与 React 一致。 */
            renderGroupSection: (key, group) =>
              reviewGroupNode
                ? h('strong', `${String(key)}（${group?.length ?? 0}）`)
                : `${String(key)}（${group?.length ?? 0}）`,
          }
        : reviewVariant === 'virtual'
          ? { virtualized: { itemSize: 45, estimatedItemSize: 45 }, scroll: { x: 560, y: 240 } }
          : reviewVariant === 'resizable'
            ? { resizable: true }
            : {};

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
/** 仅专项场景显示真实排序与筛选控件，默认字段结构保持不变。 */
const reviewColumns: TableColumnProps[] =
  reviewState === 'sort-filter'
    ? columns.map(
        /** 名称列按字符串排序，状态列提供两个实际筛选选项。 */
        (column) =>
          column.key === 'name'
            ? { ...column, sorter: (a, b) => String(a.name).localeCompare(String(b.name)) }
            : column.key === 'status'
              ? {
                  ...column,
                  filters: [
                    { text: '运行中', value: '运行中' },
                    { text: '维护中', value: '维护中' },
                  ],
                  onFilter: (value, record) => record?.status === value,
                }
              : column,
      )
    : columns;
</script>

<template>
  <ConfigProvider :direction="direction">
    <div class="table-scenario" data-testid="table-vue">
      <Table
        v-bind="structureProps"
        data-parity-target="table-basic"
        bordered
        :columns="reviewColumns"
        :data-source="reviewData"
        :loading="reviewState === 'loading'"
        :pagination="false"
        :row-selection="{
          selectedRowKeys: ['gateway'],
          width: 50,
          disabled: reviewState === 'disabled',
        }"
        :scroll="structureProps.scroll ?? { x: 560 }"
        :size="reviewSize"
      />
    </div>
  </ConfigProvider>
</template>
