import React, { useState } from 'react';
import type { SwitchProps } from '@semi-v2.102.0/switch';

export default function Switch({
  checked,
  defaultChecked = false,
  disabled = false,
  loading = false,
  size = 'default',
  checkedText,
  uncheckedText,
  className,
  style,
  id,
  onChange,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: SwitchProps): React.ReactElement {
  const [innerChecked, setInnerChecked] = useState(defaultChecked);
  const currentChecked = checked ?? innerChecked;
  const classes = [
    'semi-switch',
    className,
    currentChecked ? 'semi-switch-checked' : null,
    disabled ? 'semi-switch-disabled' : null,
    size === 'large' ? 'semi-switch-large' : null,
    size === 'small' ? 'semi-switch-small' : null,
    loading ? 'semi-switch-loading' : null,
  ]
    .filter(Boolean)
    .join(' ');
  const dataAttrs = Object.fromEntries(
    Object.entries(rest).filter(([name]) => name.startsWith('data-')),
  );

  return (
    <div
      {...dataAttrs}
      className={classes}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {loading ? (
        <div
          className={`semi-switch-loading-spin semi-spin semi-spin-${size === 'default' ? 'middle' : size}`}
        >
          <div className="semi-spin-wrapper">
            <svg data-icon="spin" aria-hidden="true" />
          </div>
          <div className="semi-spin-children" x-semi-prop="children" />
        </div>
      ) : (
        <div className="semi-switch-knob" aria-hidden="true" />
      )}
      {size !== 'small' && currentChecked && checkedText ? (
        <div className="semi-switch-checked-text" x-semi-prop="checkedText">
          {checkedText}
        </div>
      ) : null}
      {size !== 'small' && !currentChecked && uncheckedText ? (
        <div className="semi-switch-unchecked-text" x-semi-prop="uncheckedText">
          {uncheckedText}
        </div>
      ) : null}
      <input
        type="checkbox"
        className="semi-switch-native-control"
        disabled={disabled || loading}
        checked={currentChecked}
        id={id}
        role="switch"
        aria-checked={currentChecked}
        aria-label={rest['aria-label']}
        aria-labelledby={rest['aria-labelledby']}
        aria-describedby={rest['aria-describedby']}
        aria-invalid={rest['aria-invalid']}
        aria-errormessage={rest['aria-errormessage']}
        aria-disabled={disabled}
        onChange={(event) => {
          if (checked === undefined) setInnerChecked(event.target.checked);
          onChange?.(event.target.checked, event);
        }}
      />
    </div>
  );
}
