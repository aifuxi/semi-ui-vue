import React, { useState } from 'react';
import type { PinCodeProps } from '@semi-v2.102.0/pin-code';

export default function SemiPinCodeStub({
  autoFocus = true,
  className,
  count = 6,
  defaultValue,
  disabled,
  format = 'number',
  onChange,
  onComplete,
  size = 'default',
  style,
  value,
}: PinCodeProps): React.ReactElement {
  const [innerValue, setInnerValue] = useState(value || defaultValue || '');
  const displayValue = value === undefined ? innerValue : value;

  return (
    <div className={`semi-pincode-wrapper${className ? ` ${className}` : ''}`} style={style}>
      {Array.from({ length: count }, (_, index) => (
        <div
          className={`semi-input-wrapper semi-input-wrapper-${size}${disabled ? ' semi-input-wrapper-disabled' : ''}`}
          key={index}
        >
          <input
            autoFocus={autoFocus && index === 0}
            className={`semi-input semi-input-${size}${disabled ? ' semi-input-disabled' : ''}`}
            disabled={disabled}
            inputMode={format === 'number' ? 'numeric' : 'text'}
            value={displayValue[index] ?? ''}
            onChange={(event) => {
              const character = event.currentTarget.value.at(-1) ?? '';
              const next = displayValue.split('');
              next[index] = character;
              const nextValue = next.join('');
              if (value === undefined) setInnerValue(nextValue);
              onChange?.(nextValue);
              if (index === count - 1) onComplete?.(nextValue);
            }}
          />
        </div>
      ))}
    </div>
  );
}
