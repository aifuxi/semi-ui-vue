import React, { useState } from 'react';
import type { InputNumberProps } from '@semi-v2.102.0/input-number';

export default function SemiInputNumberStub({
  className,
  currency,
  defaultValue,
  disabled,
  hideButtons,
  innerButtons,
  localeCode = 'zh-CN',
  max = Infinity,
  min = -Infinity,
  onChange,
  precision,
  scientificNotation,
  step = 1,
  suffix,
  ...rest
}: InputNumberProps): React.ReactElement {
  const [number, setNumber] = useState(Number(defaultValue ?? 0));
  let display = precision === undefined ? String(number) : number.toFixed(precision);
  if (currency) {
    display = new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: typeof currency === 'string' ? currency : 'CNY',
    }).format(number);
  } else if (scientificNotation && String(Math.abs(number)).replace('.', '').length >= 15) {
    display = number
      .toExponential(14)
      .replace(/(\.\d*?)0+e/, '$1e')
      .replace(/\.e/, 'e');
  }
  const dataAttrs = Object.fromEntries(
    Object.entries(rest).filter(([name]) => name.startsWith('data-')),
  );
  const buttons = (
    <div
      className={`semi-input-number-suffix-btns${innerButtons ? ' semi-input-number-suffix-btns-inner' : ''}`}
    >
      <span
        className="semi-input-number-button semi-input-number-button-up"
        onMouseDown={() => {
          const value = Math.min(max, number + step);
          setNumber(value);
          onChange?.(value);
        }}
      />
      <span className="semi-input-number-button semi-input-number-button-down" />
    </div>
  );

  return (
    <div
      className={`semi-input-number semi-input-number-size-default${className ? ` ${className}` : ''}`}
    >
      <div
        className={`semi-input-wrapper semi-input-wrapper-default${disabled ? ' semi-input-wrapper-disabled' : ''}`}
      >
        <input
          {...dataAttrs}
          className="semi-input semi-input-default"
          role="spinbutton"
          aria-disabled={disabled}
          aria-valuemax={max === Infinity ? undefined : max}
          aria-valuemin={min === -Infinity ? undefined : min}
          disabled={disabled}
          step={step}
          value={display}
          readOnly
        />
        {innerButtons ? <div className="semi-input-suffix">{suffix}</div> : null}
      </div>
      {!hideButtons && !innerButtons ? buttons : null}
    </div>
  );
}
