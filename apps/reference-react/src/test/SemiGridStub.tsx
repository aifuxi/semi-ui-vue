import React from 'react';

import type { ColProps, GridGutter, RowProps } from '@semi-v2.102.0/grid';

const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

function gutterPair(gutter: RowProps['gutter']): [number, number] {
  const normalized = Array.isArray(gutter) ? gutter : [gutter ?? 0, 0];
  const resolve = (value: GridGutter | undefined): number => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    for (const screen of [...breakpoints].reverse()) {
      if (value[screen] !== undefined) return value[screen] ?? 0;
    }
    return 0;
  };
  return [resolve(normalized[0]), resolve(normalized[1])];
}

export const RowContext = React.createContext<[number, number] | null>(null);

export function Row(props: RowProps): React.ReactElement {
  const {
    align,
    children,
    className,
    gutter = 0,
    justify,
    prefixCls = 'semi',
    style,
    type,
    ...rest
  } = props;
  const gutters = gutterPair(gutter);
  const prefix = `${prefixCls}-row`;
  const classes = [
    type === 'flex' ? `${prefix}-flex` : prefix,
    type && justify ? `${prefix}-${type}-${justify}` : null,
    type && align ? `${prefix}-${type}-${align}` : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <RowContext.Provider value={gutters}>
      <div
        {...rest}
        className={classes}
        style={{
          ...(gutters[0] > 0 ? { marginLeft: gutters[0] / -2, marginRight: gutters[0] / -2 } : {}),
          ...(gutters[1] > 0 ? { marginBottom: gutters[1] / -2, marginTop: gutters[1] / -2 } : {}),
          ...style,
        }}
        x-semi-prop="children"
      >
        {children}
      </div>
    </RowContext.Provider>
  );
}

export function Col(props: ColProps): React.ReactElement {
  const {
    children,
    className,
    offset,
    order,
    prefixCls = 'semi',
    pull,
    push,
    span,
    style,
    ...rest
  } = props;
  const gutters = React.useContext(RowContext);
  if (!gutters) throw new Error('please make sure <Col> inside <Row>');
  const prefix = `${prefixCls}-col`;
  const classes: Array<string | null> = [
    prefix,
    span !== undefined ? `${prefix}-${span}` : null,
    order ? `${prefix}-order-${order}` : null,
    offset ? `${prefix}-offset-${offset}` : null,
    push ? `${prefix}-push-${push}` : null,
    pull ? `${prefix}-pull-${pull}` : null,
    className ?? null,
  ];
  for (const screen of breakpoints) {
    const value = props[screen];
    const size = typeof value === 'number' ? { span: value } : (value ?? {});
    for (const key of ['span', 'order', 'offset', 'push', 'pull'] as const) {
      if (size[key] === undefined) continue;
      classes.push(
        key === 'span'
          ? `${prefix}-${screen}-${size[key]}`
          : `${prefix}-${screen}-${key}-${size[key]}`,
      );
    }
    delete rest[screen];
  }
  return (
    <div
      {...rest}
      className={classes.filter(Boolean).join(' ')}
      style={{
        ...(gutters[0] > 0 ? { paddingLeft: gutters[0] / 2, paddingRight: gutters[0] / 2 } : {}),
        ...(gutters[1] > 0 ? { paddingBottom: gutters[1] / 2, paddingTop: gutters[1] / 2 } : {}),
        ...style,
      }}
      x-semi-prop="children"
    >
      {children}
    </div>
  );
}
