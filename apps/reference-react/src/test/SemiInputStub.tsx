import React, { useState } from 'react';

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'prefix' | 'size'
> {
  addonAfter?: React.ReactNode;
  addonBefore?: React.ReactNode;
  borderless?: boolean;
  mode?: 'password';
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: (event: React.MouseEvent<HTMLDivElement>) => void;
  prefix?: React.ReactNode;
  readonly?: boolean;
  showClear?: boolean;
  size?: 'small' | 'default' | 'large';
  suffix?: React.ReactNode;
  validateStatus?: 'default' | 'warning' | 'error' | 'success';
}

export default function SemiInputStub({
  addonAfter,
  addonBefore,
  className,
  defaultValue,
  disabled,
  mode,
  onChange,
  onClear,
  prefix,
  readonly,
  showClear,
  size = 'default',
  suffix,
  validateStatus,
  value: controlledValue,
  ...rest
}: InputProps): React.ReactElement {
  const [value, setValue] = useState(String(controlledValue ?? defaultValue ?? ''));
  const actualValue = controlledValue === undefined ? value : String(controlledValue);
  return (
    <div
      className={`semi-input-wrapper semi-input-wrapper-${size}${disabled ? ' semi-input-wrapper-disabled' : ''}${validateStatus ? ` semi-input-wrapper-${validateStatus}` : ''}${className ? ` ${className}` : ''}`}
    >
      {addonBefore ? <div className="semi-input-prepend">{addonBefore}</div> : null}
      {prefix ? <div className="semi-input-prefix">{prefix}</div> : null}
      <input
        {...rest}
        className={`semi-input semi-input-${size}`}
        disabled={disabled}
        readOnly={readonly}
        type={mode === 'password' ? 'password' : rest.type}
        value={actualValue}
        onChange={(event) => {
          if (controlledValue === undefined) setValue(event.target.value);
          onChange?.(event.target.value, event);
        }}
      />
      {showClear && actualValue ? (
        <div
          className="semi-input-clearbtn"
          onMouseDown={(event) => {
            if (controlledValue === undefined) setValue('');
            onClear?.(event);
          }}
        />
      ) : null}
      {suffix ? <div className="semi-input-suffix">{suffix}</div> : null}
      {mode === 'password' ? <div className="semi-input-modebtn" role="button" /> : null}
      {addonAfter ? <div className="semi-input-append">{addonAfter}</div> : null}
    </div>
  );
}
