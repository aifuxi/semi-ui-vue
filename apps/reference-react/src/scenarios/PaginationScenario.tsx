import React, { useState } from 'react';
import Pagination from '@semi-v2.102.0/pagination';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const localeMap = {
  'zh-CN': {
    code: 'zh-CN',
    Pagination: {
      pageSize: '每页条数：${pageSize}',
      total: '总页数：${total}',
      jumpTo: '跳至',
      page: '页',
    },
  },
  'en-US': {
    code: 'en-US',
    Pagination: {
      pageSize: 'Items per page: ${pageSize}',
      total: 'Total pages: ${total}',
      jumpTo: 'Jump to',
      page: ' page',
    },
  },
};

export function PaginationScenario({
  direction,
  locale,
}: {
  direction: ParityDirection;
  locale: ParityLocale;
}): React.ReactElement {
  const [status, setStatus] = useState('等待操作');
  return (
    <ConfigProvider direction={direction} locale={localeMap[locale]}>
      <div className="pagination-scenario" data-testid="pagination-reference">
        <div className="pagination-scenario__section">
          <span className="pagination-scenario__label">基础与截断</span>
          <Pagination
            defaultCurrentPage={4}
            showTotal
            total={200}
            data-parity-target="pagination-basic"
            onPageChange={(page) => setStatus(`页码：${page}`)}
          />
        </div>
        <div className="pagination-scenario__section">
          <span className="pagination-scenario__label">容量与快速跳页</span>
          <Pagination
            defaultCurrentPage={6}
            pageSizeOpts={[10, 20, 40, 100]}
            showQuickJumper
            showSizeChanger
            total={300}
            data-parity-target="pagination-complete"
            onChange={(page, size) => setStatus(`变更：${page}/${size}`)}
          />
        </div>
        <div className="pagination-scenario__section">
          <span className="pagination-scenario__label">迷你与禁用</span>
          <div className="pagination-scenario__row">
            <Pagination
              hoverShowPageSelect
              size="small"
              total={90}
              data-parity-target="pagination-small"
            />
            <Pagination disabled total={30} data-parity-target="pagination-disabled" />
          </div>
        </div>
        <output className="pagination-scenario__status" aria-live="polite">
          {status}
        </output>
      </div>
    </ConfigProvider>
  );
}
