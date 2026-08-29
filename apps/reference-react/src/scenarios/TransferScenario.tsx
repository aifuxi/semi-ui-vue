import React from 'react';
import Transfer from '@semi-v2.102.0/transfer';

const data = [
  { key: 'design', label: 'Design', value: 'design' },
  { key: 'engineering', label: 'Engineering', value: 'engineering' },
  { key: 'product', label: 'Product', value: 'product' },
  { key: 'operations', label: 'Operations', value: 'operations' },
  { key: 'finance', label: 'Finance', value: 'finance', disabled: true },
  { key: 'support', label: 'Support', value: 'support' },
];

export function TransferScenario(): React.ReactElement {
  return (
    <div className="transfer-scenario" data-testid="transfer-reference">
      <Transfer
        data-parity-target="transfer-root"
        dataSource={data}
        defaultValue={['design', 'product']}
        style={{ width: 568, height: 360 }}
      />
    </div>
  );
}
