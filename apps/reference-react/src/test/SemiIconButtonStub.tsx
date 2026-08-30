import React from 'react';
import type { IconButtonProps } from '@semi-v2.102.0/icon-button';

export default function SemiIconButtonStub(props: IconButtonProps): React.ReactElement {
  const {
    children,
    colorful,
    icon,
    iconPosition = 'left',
    loading,
    size = 'default',
    theme = 'light',
    type = 'primary',
  } = props;
  const domProps = Object.fromEntries(
    Object.entries(props).filter(
      ([name]) =>
        name.startsWith('data-') ||
        name.startsWith('aria-') ||
        ['disabled', 'id', 'style', 'tabIndex'].includes(name),
    ),
  );
  const className = [
    'semi-button',
    `semi-button-${size}`,
    `semi-button-${theme}`,
    `semi-button-${type}`,
    'semi-button-with-icon',
    children === undefined || children === null ? 'semi-button-with-icon-only' : undefined,
    loading ? 'semi-button-loading' : undefined,
    colorful ? 'semi-button-colorful' : undefined,
    props.disabled ? 'semi-button-disabled' : undefined,
    props.className,
  ]
    .filter(Boolean)
    .join(' ');
  const renderedIcon =
    loading && !props.disabled ? <svg aria-hidden="true" data-icon="loading" /> : icon;

  return (
    <button {...domProps} className={className} type={props.htmlType ?? 'button'}>
      <span className="semi-button-content">
        {iconPosition === 'left' ? renderedIcon : null}
        {children}
        {iconPosition === 'right' ? renderedIcon : null}
      </span>
    </button>
  );
}
