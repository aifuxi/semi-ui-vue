import React from 'react';
import type { DividerProps } from '@semi-v2.102.0/divider';

export default function SemiDividerStub(props: DividerProps): React.ReactElement {
  const {
    align = 'center',
    children,
    className,
    dashed = false,
    layout = 'horizontal',
    margin,
    style,
    ...rest
  } = props;
  const hasContent = Boolean(children) && layout === 'horizontal';
  const classes = [
    'semi-divider',
    `semi-divider-${layout}`,
    dashed ? 'semi-divider-dashed' : null,
    hasContent ? 'semi-divider-with-text' : null,
    hasContent ? `semi-divider-with-text-${align}` : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const marginStyle =
    margin === undefined
      ? {}
      : layout === 'vertical'
        ? { marginLeft: margin, marginRight: margin }
        : { marginTop: margin, marginBottom: margin };

  return (
    <div {...rest} className={classes} style={{ ...marginStyle, ...style }}>
      {hasContent && typeof children === 'string' ? (
        <span className="semi-divider_inner-text" x-semi-prop="children">
          {children}
        </span>
      ) : hasContent ? (
        children
      ) : null}
    </div>
  );
}
