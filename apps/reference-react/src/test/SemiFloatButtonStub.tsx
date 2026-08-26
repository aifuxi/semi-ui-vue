import React from 'react';

import type { FloatButtonBadgeProps, FloatButtonProps } from '@semi-v2.102.0/float-button';
import type {
  FloatButtonGroupItem,
  FloatButtonGroupProps,
} from '@semi-v2.102.0/float-button-group';

function Badge({ children, badge }: { children: React.ReactNode; badge: FloatButtonBadgeProps }) {
  const {
    className,
    count,
    countClassName,
    countStyle,
    dot = false,
    overflowCount,
    position = 'rightTop',
    style,
    theme = 'solid',
    type = 'primary',
  } = badge;
  const custom = Boolean(count) && typeof count !== 'number' && typeof count !== 'string';
  const showBadge = count !== null && count !== undefined;
  const displayedCount =
    typeof count === 'number' && overflowCount && overflowCount < count
      ? `${overflowCount}+`
      : count;
  const countClasses = [
    countClassName,
    !custom ? `semi-badge-${type}` : null,
    !custom ? `semi-badge-${theme}` : null,
    `semi-badge-${position}`,
    dot ? 'semi-badge-dot' : null,
    !dot && !custom && showBadge ? 'semi-badge-count' : null,
    custom ? 'semi-badge-custom' : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={['semi-badge', className].filter(Boolean).join(' ')}>
      {children}
      <span className={countClasses} style={style || countStyle} x-semi-prop="count">
        {dot ? null : displayedCount}
      </span>
    </span>
  );
}

export default function SemiFloatButtonStub({
  badge,
  className,
  colorful = false,
  disabled = false,
  icon,
  onClick,
  shape = 'round',
  size = 'default',
  style,
  ...rest
}: FloatButtonProps): React.ReactElement {
  const body = (
    <div
      className={[
        'semi-floatButton-body',
        `semi-floatButton-${shape}`,
        colorful ? 'semi-floatButton-colorful' : null,
        disabled ? 'semi-floatButton-disabled' : null,
        `semi-floatButton-${size}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon}
    </div>
  );

  return (
    <div
      {...rest}
      className={[
        'semi-floatButton',
        className,
        `semi-floatButton-${size}`,
        `semi-floatButton-${shape}`,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      onClick={(event) => {
        if (!disabled) onClick?.(event);
      }}
    >
      {badge ? <Badge badge={badge}>{body}</Badge> : body}
    </div>
  );
}

export function SemiFloatButtonGroupStub({
  className,
  disabled = false,
  items,
  onClick,
  style,
  ...rest
}: FloatButtonGroupProps): React.ReactElement {
  const renderItem = (item: FloatButtonGroupItem, index: number) => {
    const body = (
      <div className="semi-floatButtonGroup-item" data-value={item.value}>
        {item.icon}
        {item.content}
      </div>
    );
    return item.badge ? (
      <Badge badge={item.badge} key={index}>
        {body}
      </Badge>
    ) : (
      React.cloneElement(body, { key: index })
    );
  };

  return (
    <div
      {...rest}
      className={[
        'semi-floatButtonGroup',
        className,
        disabled ? 'semi-floatButtonGroup-disabled' : null,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      onClick={(event) => onClick?.((event.target as HTMLElement).dataset.value as string, event)}
    >
      {items.map(renderItem)}
    </div>
  );
}
