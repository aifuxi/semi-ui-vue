import React from 'react';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import Table, { type TableProps } from '@semi-v2.102.0/table';

export interface TableScenarioProps {
  direction: 'ltr' | 'rtl';
}

const data = [
  { key: 'gateway', name: 'API Gateway', owner: '平台组', status: '运行中' },
  { key: 'worker', name: 'Job Worker', owner: '任务组', status: '维护中' },
  { key: 'storage', name: 'Object Storage', owner: '数据组', status: '运行中' },
];

const columns = [
  { dataIndex: 'name', key: 'name', title: '资源名称', width: 220 },
  {
    dataIndex: 'status',
    key: 'status',
    title: '状态',
    width: 120,
    render: (value: unknown) => <span className="table-scenario__status">{String(value)}</span>,
  },
  { dataIndex: 'owner', key: 'owner', title: '负责人', width: 160 },
];

/** 通过相同公开 props 选择视觉 review 密度和状态，默认参考页面不变。 */
export function TableScenario({ direction }: TableScenarioProps): React.ReactElement {
  /** 与 Vue 使用同一组参数。 */
  const query = new URLSearchParams(window.location.search);
  /** Table 的三档公开密度。 */
  const size = (
    ['small', 'default', 'middle'].includes(query.get('reviewSize') ?? '')
      ? query.get('reviewSize')
      : 'middle'
  ) as 'small' | 'default' | 'middle';
  /** 额外状态只有显式 query 才启用。 */
  const state = query.get('reviewState');
  /** 与 Vue 端完全相同的结构变体名称。 */
  const variant = query.get('reviewVariant');
  /** 节点标题与固定 SectionRow 会忽略的字符串返回值分别对照。 */
  const reviewGroupNode = query.get('reviewGroupContent') === 'node';
  /** 三级树数据用于核对缩进和真实展开/折叠状态。 */
  const treeData = [
    {
      ...data[0]!,
      children: [
        {
          key: 'route',
          name: 'Route Service',
          owner: '平台组',
          status: '运行中',
          children: [
            { key: 'route-cache', name: 'Route Cache', owner: '平台组', status: '维护中' },
          ],
        },
        { key: 'auth', name: 'Auth Service', owner: '平台组', status: '运行中' },
      ],
    },
    data[1]!,
    data[2]!,
  ];
  /** 四十行与 Vue 使用相同序号和固定行高。 */
  const virtualData = Array.from(
    { length: 40 },
    /** 每项直接作为真实 Table 数据记录。 */
    (_, index) => ({
      key: `resource-${index}`,
      name: `资源 ${String(index + 1).padStart(2, '0')}`,
      owner: '平台组',
      status: index % 2 ? '维护中' : '运行中',
    }),
  );
  /** 默认三行场景保留，专项结构数据由 query 决定。 */
  const reviewData =
    variant === 'tree'
      ? treeData
      : variant === 'virtual'
        ? virtualData
        : state === 'empty'
          ? []
          : data;
  /** 所有可见结构均通过固定 Semi 公开 props 驱动。 */
  const structureProps: TableProps =
    variant === 'expanded'
      ? {
          hideExpandedColumn: false,
          defaultExpandedRowKeys: ['gateway'],
          /** 与 Vue 相同的展开标题和正文，用于观察主题继承。 */
          expandedRowRender: (record) => (
            <div>
              <strong>资源详情</strong>
              <p style={{ margin: '8px 0 0' }}>当前资源：{String(record?.name ?? '')}</p>
            </div>
          ),
        }
      : variant === 'tree'
        ? { defaultExpandedRowKeys: ['gateway', 'route'] }
        : variant === 'group'
          ? {
              groupBy: 'owner',
              defaultExpandAllGroupRows: true,
              /** 固定回调的 group 是记录键列表，不替换为业务记录。 */
              renderGroupSection: (key, group) =>
                reviewGroupNode ? (
                  <strong>{`${String(key)}（${group?.length ?? 0}）`}</strong>
                ) : (
                  `${String(key)}（${group?.length ?? 0}）`
                ),
            }
          : variant === 'virtual'
            ? { virtualized: { itemSize: 45, estimatedItemSize: 45 }, scroll: { x: 560, y: 240 } }
            : variant === 'resizable'
              ? { resizable: true }
              : {};
  /** 排序和筛选均由固定 Semi 真实实现，不能使用 CSS 类伪造。 */
  const reviewColumns =
    state === 'sort-filter'
      ? columns.map(
          /** 两端相同字段、排序方法与筛选选项。 */
          (column) =>
            column.key === 'name'
              ? {
                  ...column,
                  sorter: (a: (typeof data)[number], b: (typeof data)[number]) =>
                    a.name.localeCompare(b.name),
                }
              : column.key === 'status'
                ? {
                    ...column,
                    filters: [
                      { text: '运行中', value: '运行中' },
                      { text: '维护中', value: '维护中' },
                    ],
                    onFilter: (value: unknown, record?: (typeof data)[number]) =>
                      record?.status === value,
                  }
                : column,
        )
      : columns;
  return (
    <ConfigProvider direction={direction}>
      <div className="table-scenario" data-testid="table-reference">
        <Table
          {...structureProps}
          data-parity-target="table-basic"
          bordered
          columns={reviewColumns}
          dataSource={reviewData}
          loading={state === 'loading'}
          pagination={false}
          rowSelection={{ selectedRowKeys: ['gateway'], width: 50, disabled: state === 'disabled' }}
          scroll={structureProps.scroll ?? { x: 560 }}
          size={size}
        />
      </div>
    </ConfigProvider>
  );
}
