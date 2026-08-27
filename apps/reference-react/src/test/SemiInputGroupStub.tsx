import React from 'react';

interface InputGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  disabled?: boolean;
  label?: { text?: React.ReactNode; name?: string; required?: boolean };
  labelPosition?: string;
  size?: 'small' | 'default' | 'large';
}

export default function SemiInputGroupStub({
  children,
  className,
  disabled,
  label,
  labelPosition,
  size = 'default',
  ...rest
}: InputGroupProps): React.ReactElement {
  const content = React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
          disabled: typeof child.props.disabled === 'boolean' ? child.props.disabled : disabled,
          size,
        })
      : child,
  );
  const group = (
    <span
      {...rest}
      role="group"
      className={`semi-input-group${size !== 'default' ? ` semi-input-${size}` : ''}${className ? ` ${className}` : ''}`}
      aria-disabled={disabled}
    >
      {content}
    </span>
  );
  if (!label?.text) return group;
  return (
    <div
      className={`semi-input-group-wrapper${labelPosition ? ` semi-input-group-wrapper-with-${labelPosition}-label` : ''}`}
    >
      <label className="semi-form-field-label" htmlFor={label.name ?? 'input-group'}>
        <div className="semi-form-field-label-text">{label.text}</div>
      </label>
      {group}
    </div>
  );
}
