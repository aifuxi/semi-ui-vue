import React, { useState } from 'react';
import Button from '@semi-v2.102.0/button';
import { buttonReview } from '../../../../packages/test-infra/src/root-theme-review';

const BUTTON_TYPES = [
  { type: 'primary', label: '主要按钮' },
  { type: 'secondary', label: '次要按钮' },
  { type: 'tertiary', label: '第三按钮' },
  { type: 'warning', label: '警告按钮' },
  { type: 'danger', label: '危险按钮' },
] as const;

export function ButtonTypesScenario(): React.ReactElement {
  /** 与 Vue 使用相同查询，但始终渲染固定 vendor Button。 */
  const review = buttonReview(window.location.search);
  const [lastAction, setLastAction] = useState('尚未触发');

  return (
    <div className="button-types-scenario" data-testid="button-types-reference">
      <div className="button-types-scenario__row">
        {BUTTON_TYPES.map((item) => (
          <Button
            key={item.type}
            type={item.type}
            {...review}
            data-parity-target={`button-${item.type}`}
            onClick={() => setLastAction(item.label)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <output className="scenario-action-output" aria-live="polite">
        最近操作：{lastAction}
      </output>
    </div>
  );
}
