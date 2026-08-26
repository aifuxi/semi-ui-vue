import React from 'react';
import type { IconProps } from '@semi-v2.102.0/icon';

export default function SemiIconStub(props: IconProps): React.ReactElement {
  const {
    children,
    className,
    prefixCls = 'semi',
    rotate,
    size = 'default',
    spin = false,
    style,
    svg,
    type,
    ...rest
  } = props;
  const classes = [
    `${prefixCls}-icon`,
    size === 'inherit' ? null : `${prefixCls}-icon-${size}`,
    spin ? `${prefixCls}-icon-spinning` : null,
    type ? `${prefixCls}-icon-${type}` : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const rotation = Number.isSafeInteger(rotate) ? { transform: `rotate(${rotate}deg)` } : {};

  return (
    <span
      role="img"
      aria-label={type}
      className={classes}
      style={{ ...rotation, ...style }}
      {...rest}
    >
      {svg ?? children}
    </span>
  );
}
