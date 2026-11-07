import React from 'react';
import DatePicker from '@semi-v2.102.0/date-picker';
import {
  readDatePickerReviewProps,
  readInputReviewProps,
} from '../../../../packages/test-infra/src/input-theme-review';

const selectedDate = new Date(2024, 4, 10, 0, 0, 0, 0);
const pickerDate = new Date(2024, 4, 1, 0, 0, 0, 0);

export function DatePickerScenario({
  direction,
}: {
  direction: 'ltr' | 'rtl';
}): React.ReactElement {
  /** 固定日期不变，独立检查三档输入尺寸与禁用、校验分支。 */
  const reviewProps = readInputReviewProps(['size', 'disabled', 'validateStatus']);
  /** 固定输入的其他日期面板，同一模式在 Vue 与 React 保持相同值和密度。 */
  const panelProps = readDatePickerReviewProps();
  /** 范围结束固定为次月 15 日；多选固定为同月 12 日，避免依赖系统日期。 */
  const reviewValue = panelProps.type?.endsWith('Range')
    ? [selectedDate, new Date(2024, 5, 15)]
    : panelProps.multiple
      ? [selectedDate, new Date(2024, 4, 12)]
      : selectedDate;
  return (
    <div className="date-picker-scenario" data-testid="date-picker-reference">
      <div data-parity-target="date-picker-trigger">
        <DatePicker
          {...reviewProps}
          {...panelProps}
          defaultValue={reviewValue}
          defaultPickerValue={pickerDate}
          dropdownClassName="date-picker-target-popup"
          motion={false}
          open={true}
          position={direction === 'rtl' ? 'bottomRight' : 'bottomLeft'}
          onChange={() => undefined}
          onOpenChange={() => undefined}
        />
      </div>
    </div>
  );
}
