import React from 'react';
import type { BadgeProps } from '@semi-v2.102.0/badge';

export default function Badge({
  children,
  className = '',
  count,
  countClassName,
  countStyle,
  dot = false,
  overflowCount,
  position = 'rightTop',
  style,
  theme = 'solid',
  type = 'primary',
  ...rest
}: BadgeProps): React.ReactElement {
  const custom = Boolean(count) && typeof count !== 'number' && typeof count !== 'string';
  const showBadge = count !== null && count !== undefined;
  const hasChildren = Boolean(children);
  const countClasses = [
    countClassName,
    !custom ? `semi-badge-${type}` : null,
    !custom ? `semi-badge-${theme}` : null,
    hasChildren ? `semi-badge-${position}` : null,
    !hasChildren ? 'semi-badge-block' : null,
    dot ? 'semi-badge-dot' : null,
    !dot && !custom && showBadge ? 'semi-badge-count' : null,
    custom ? 'semi-badge-custom' : null,
  ]
    .filter(Boolean)
    .join(' ');
  const content =
    typeof count === 'number'
      ? overflowCount && overflowCount < count
        ? `${overflowCount}+`
        : `${count}`
      : count;
  return (
    <span className={['semi-badge', className].filter(Boolean).join(' ')} {...rest}>
      {children}
      <span className={countClasses} style={style || countStyle} x-semi-prop="count">
        {dot ? null : content}
      </span>
    </span>
  );
}
