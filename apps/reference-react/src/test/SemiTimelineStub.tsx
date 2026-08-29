import React, { Children, cloneElement, isValidElement, type ReactElement } from 'react';
import type { TimelineData, TimelineItemProps, TimelineProps } from '@semi-v2.102.0/timeline';

function TimelineItem({
  children,
  className,
  color,
  dot,
  extra,
  time = '',
  type = 'default',
  ...props
}: TimelineItemProps): React.ReactElement {
  return (
    <li className={`semi-timeline-item${className ? ` ${className}` : ''}`} {...props}>
      <div className="semi-timeline-item-tail" aria-hidden />
      <div
        className={`semi-timeline-item-head${dot ? ' semi-timeline-item-head-custom' : ''} semi-timeline-item-head-${type}`}
        style={color ? { backgroundColor: color } : undefined}
        aria-hidden
      >
        {dot}
      </div>
      <div className="semi-timeline-item-content">
        {children}
        {extra ? <div className="semi-timeline-item-content-extra">{extra}</div> : null}
        {time ? <div className="semi-timeline-item-content-time">{time}</div> : null}
      </div>
    </li>
  );
}

function TimelineBase({
  children,
  className,
  dataSource,
  mode = 'left',
  ...props
}: TimelineProps): React.ReactElement {
  const source = dataSource?.length
    ? dataSource.map(({ content, ...itemProps }: TimelineData, index) => (
        <TimelineItem key={`timeline-item-${index}`} {...itemProps}>
          {content}
        </TimelineItem>
      ))
    : children;
  const items = Children.map(source, (child, index) => {
    if (!isValidElement(child)) return child;
    const item = child as ReactElement<TimelineItemProps>;
    const position =
      mode === 'alternate'
        ? item.props.position || (index % 2 === 0 ? 'left' : 'right')
        : mode === 'center'
          ? item.props.position || 'left'
          : mode;
    return cloneElement(item, {
      className: `${item.props.className || ''} semi-timeline-item-${position}`.trim(),
    });
  });
  return (
    <ul
      className={`semi-timeline semi-timeline-${mode}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {items}
    </ul>
  );
}

const Timeline = Object.assign(TimelineBase, { Item: TimelineItem });
export default Timeline;
