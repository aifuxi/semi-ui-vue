import React from 'react';

import type { SpaceProps } from '@semi-v2.102.0/space';

export default function SemiSpaceStub(props: SpaceProps): React.ReactElement {
  const {
    align = 'center',
    children,
    className,
    spacing = 'tight',
    style,
    vertical = false,
    wrap = false,
    ...rest
  } = props;
  const resolvedStyle: React.CSSProperties = { ...style };
  let horizontalPreset = '';
  let verticalPreset = '';

  if (typeof spacing === 'string') {
    horizontalPreset = spacing;
    verticalPreset = spacing;
  } else if (typeof spacing === 'number') {
    resolvedStyle.columnGap = spacing;
    resolvedStyle.rowGap = spacing;
  } else {
    if (typeof spacing[0] === 'string') horizontalPreset = spacing[0];
    if (typeof spacing[0] === 'number') resolvedStyle.columnGap = spacing[0];
    if (typeof spacing[1] === 'string') verticalPreset = spacing[1];
    if (typeof spacing[1] === 'number') resolvedStyle.rowGap = spacing[1];
  }

  const classes = [
    'semi-space',
    `semi-space-align-${align}`,
    vertical ? 'semi-space-vertical' : 'semi-space-horizontal',
    wrap && !vertical ? 'semi-space-wrap' : null,
    horizontalPreset ? `semi-space-${horizontalPreset}-horizontal` : null,
    verticalPreset ? `semi-space-${verticalPreset}-vertical` : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...rest} className={classes} style={resolvedStyle} x-semi-prop="children">
      {children}
    </div>
  );
}
