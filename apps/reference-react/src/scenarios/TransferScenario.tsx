import React from 'react';
import Transfer from '@semi-v2.102.0/transfer';
import { readInputReviewProps } from '../../../../packages/test-infra/src/input-theme-review';

const data = [
  { key: 'design', label: 'Design', value: 'design' },
  { key: 'engineering', label: 'Engineering', value: 'engineering' },
  { key: 'product', label: 'Product', value: 'product' },
  { key: 'operations', label: 'Operations', value: 'operations' },
  { key: 'finance', label: 'Finance', value: 'finance', disabled: true },
  { key: 'support', label: 'Support', value: 'support' },
];

export function TransferScenario(): React.ReactElement {
  /** 验证源面板禁用和加载样式，不改变原来的选中数据。 */
  const reviewProps = readInputReviewProps(['disabled', 'loading']);
  return (
    <div className="transfer-scenario" data-testid="transfer-reference">
      <Transfer
        {...reviewProps}
        data-parity-target="transfer-root"
        dataSource={data}
        defaultValue={['design', 'product']}
        style={{ width: 568, height: 360 }}
      />
    </div>
  );
}
