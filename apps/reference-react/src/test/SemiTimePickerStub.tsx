import React from 'react';
import type { TimePickerProps } from '@semi-v2.102.0/time-picker';

export default function SemiTimePickerStub({
  className,
  defaultValue,
  disabled = false,
  size = 'default',
  type = 'time',
  use12Hours = false,
  validateStatus = 'default',
  ...rest
}: TimePickerProps): React.ReactElement {
  const domProps = Object.fromEntries(
    Object.entries(rest).filter(([key]) => key === 'style' || key.startsWith('data-')),
  ) as React.HTMLAttributes<HTMLDivElement>;
  const inputValue = Array.isArray(defaultValue) ? defaultValue.join(' ~ ') : defaultValue;
  return (
    <div
      {...domProps}
      aria-disabled={disabled}
      className={['semi-timepicker', className].filter(Boolean).join(' ')}
      data-type={type}
      data-use-12-hours={use12Hours}
    >
      <span className="semi-timepicker-header">
        <div className="semi-timepicker-input-wrap">
          <div
            className={[
              'semi-timepicker-input',
              'semi-input-wrapper',
              `semi-input-wrapper-${size}`,
              disabled ? 'semi-input-wrapper-disabled' : '',
              validateStatus === 'warning' ? 'semi-input-wrapper-warning' : '',
              validateStatus === 'error' ? 'semi-input-wrapper-error' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <input
              className={`semi-input semi-input-${size}`}
              disabled={disabled}
              value={String(inputValue ?? '')}
              readOnly
            />
          </div>
        </div>
      </span>
    </div>
  );
}
