import React from 'react';
import type { TagInputProps } from '@semi-v2.102.0/tag-input';

export default function SemiTagInputStub({
  'aria-label': ariaLabel,
  className,
  defaultValue = [],
  disabled,
  insetLabel,
  maxTagCount,
  prefix,
  showRestTagsPopover = true,
  size = 'default',
  suffix,
  validateStatus = 'default',
  ...rest
}: TagInputProps): React.ReactElement {
  const visible = maxTagCount ? defaultValue.slice(0, maxTagCount) : defaultValue;
  const restCount = defaultValue.length - visible.length;
  const domProps = Object.fromEntries(
    Object.entries(rest).filter(([key]) => key === 'style' || key.startsWith('data-')),
  ) as React.HTMLAttributes<HTMLDivElement>;
  return (
    <div
      {...domProps}
      aria-disabled={disabled}
      aria-invalid={validateStatus === 'error'}
      aria-label={ariaLabel}
      className={[
        'semi-tagInput',
        size === 'small' ? 'semi-tagInput-small' : '',
        size === 'large' ? 'semi-tagInput-large' : '',
        disabled ? 'semi-tagInput-disabled' : '',
        validateStatus === 'warning' ? 'semi-tagInput-warning' : '',
        validateStatus === 'error' ? 'semi-tagInput-error' : '',
        prefix || insetLabel ? 'semi-tagInput-with-prefix' : '',
        suffix ? 'semi-tagInput-with-suffix' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {prefix ?? insetLabel}
      <div className="semi-tagInput-wrapper">
        {visible.map((value, index) => (
          <div className="semi-tag semi-tag-large semi-tag-content" key={`${index}-${value}`}>
            {value}
          </div>
        ))}
        {restCount > 0 ? (
          <span className="semi-tagInput-wrapper-n" data-popover={showRestTagsPopover}>
            +{restCount}
          </span>
        ) : null}
        <input aria-label="input value" disabled={disabled} />
      </div>
      {suffix}
    </div>
  );
}
