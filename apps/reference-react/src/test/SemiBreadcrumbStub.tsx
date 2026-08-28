import React from 'react';
import type {
  BreadcrumbItemInfo,
  BreadcrumbItemProps,
  BreadcrumbProps,
} from '@semi-v2.102.0/breadcrumb';

function BreadcrumbItemStub({
  active,
  children,
  className = '',
  href,
  icon,
  noLink,
  onClick,
  separator,
  shouldRenderSeparator = true,
}: BreadcrumbItemProps): React.ReactElement {
  const info: BreadcrumbItemInfo = { name: children };
  if (href != null) info.href = href;
  const itemClass = [
    'semi-breadcrumb-item',
    active ? 'semi-breadcrumb-item-active' : '',
    noLink ? '' : 'semi-breadcrumb-item-link',
  ]
    .filter(Boolean)
    .join(' ');
  const content = (
    <>
      {icon}
      <span className="semi-breadcrumb-item-title">{children}</span>
    </>
  );
  const item =
    active || href == null ? (
      <span className={itemClass} onClick={(event) => onClick?.(info, event)}>
        {content}
      </span>
    ) : (
      <a className={itemClass} href={href} onClick={(event) => onClick?.(info, event)}>
        {content}
      </a>
    );
  return (
    <span
      className={`semi-breadcrumb-item-wrap ${className}`}
      aria-current={active ? 'page' : undefined}
    >
      {item}
      {shouldRenderSeparator
        ? (separator ?? <span className="semi-breadcrumb-separator">/</span>)
        : null}
    </span>
  );
}

function BreadcrumbStub({
  activeIndex,
  children,
  className = '',
  compact = true,
  maxItemCount: _maxItemCount,
  moreType: _moreType,
  onClick,
  routes: _routes,
  separator = '/',
  ...props
}: BreadcrumbProps): React.ReactElement {
  void _maxItemCount;
  void _moreType;
  void _routes;
  const items = React.Children.toArray(children);
  return (
    <nav
      {...props}
      className={`semi-breadcrumb-wrapper semi-breadcrumb-wrapper-${compact ? 'compact' : 'loose'} ${className}`}
    >
      {items.map((item, index) =>
        React.isValidElement<BreadcrumbItemProps>(item)
          ? React.cloneElement(item, {
              active:
                activeIndex === undefined ? index === items.length - 1 : activeIndex === index,
              onClick: (info, event) => {
                item.props.onClick?.(info, event);
                onClick?.(info, event);
              },
              separator,
              shouldRenderSeparator: index !== items.length - 1,
            })
          : item,
      )}
    </nav>
  );
}

BreadcrumbStub.Item = BreadcrumbItemStub;

export default BreadcrumbStub;
