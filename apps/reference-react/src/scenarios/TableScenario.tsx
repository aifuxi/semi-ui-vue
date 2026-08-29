import React from 'react';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import Table from '@semi-v2.102.0/table';

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

export function TableScenario({ direction }: TableScenarioProps): React.ReactElement {
  return (
    <ConfigProvider direction={direction}>
      <div className="table-scenario" data-testid="table-reference">
        <Table
          data-parity-target="table-basic"
          bordered
          columns={columns}
          dataSource={data}
          pagination={false}
          rowSelection={{ selectedRowKeys: ['gateway'], width: 50 }}
          scroll={{ x: 560 }}
          size="middle"
        />
      </div>
    </ConfigProvider>
  );
}
