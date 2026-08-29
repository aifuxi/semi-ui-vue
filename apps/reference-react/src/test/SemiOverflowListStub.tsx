import React, { type CSSProperties, type ReactElement, type ReactNode } from 'react';

interface CommonProps<Item extends Record<string, unknown>> {
  items?: Item[];
  collapseFrom?: 'start' | 'end';
  minVisibleItems?: number;
  visibleItemRenderer?: (item: Item, index: number) => ReactElement;
  style?: CSSProperties;
}

type Props<Item extends Record<string, unknown>> = CommonProps<Item> &
  (
    | { renderMode?: 'collapse'; overflowRenderer?: (items: Item[]) => ReactNode }
    | { renderMode: 'scroll'; overflowRenderer?: (items: [Item[], Item[]]) => ReactNode }
  );

export default function OverflowList<Item extends Record<string, unknown>>(
  props: Props<Item>,
): React.ReactElement {
  const items = props.items ?? [];
  const visibleItemRenderer = props.visibleItemRenderer ?? (() => null as unknown as ReactElement);
  if (props.renderMode === 'scroll') {
    const edges = props.overflowRenderer?.([[], []]);
    return (
      <div className="semi-overflow-list" style={props.style}>
        {Array.isArray(edges) ? edges[0] : null}
        <div className="semi-overflow-list-scroll-wrapper">
          {items.map((item, index) =>
            React.cloneElement(visibleItemRenderer(item, index), {
              key: String(item.key ?? index),
              'data-scrollkey': String(item.key ?? index),
            }),
          )}
        </div>
        {Array.isArray(edges) ? edges[1] : null}
      </div>
    );
  }
  const collapseFrom = props.collapseFrom ?? 'end';
  const overflow = (
    <div className="semi-overflow-list-overflow">{props.overflowRenderer?.([])}</div>
  );
  return (
    <div
      className="semi-overflow-list"
      style={{ ...props.style, maxWidth: '100%', visibility: 'hidden' }}
    >
      {collapseFrom === 'start' ? overflow : null}
      {items.map((item, index) => (
        <div className="semi-overflow-list-item" key={String(item.key ?? index)}>
          {visibleItemRenderer(item, index)}
        </div>
      ))}
      {collapseFrom === 'end' ? overflow : null}
    </div>
  );
}
