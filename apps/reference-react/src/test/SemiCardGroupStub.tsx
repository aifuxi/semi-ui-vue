import React from 'react';
import type { CardGroupProps } from '@semi-v2.102.0/card-group';

export default function CardGroup({
  children,
  className = '',
  spacing = 16,
  type,
  ...rest
}: CardGroupProps): React.ReactElement {
  const grid = type === 'grid';
  const [columnGap, rowGap] = Array.isArray(spacing) ? spacing : [spacing, spacing];
  return (
    <div
      className={[
        'semi-space semi-space-align-center semi-space-horizontal semi-space-wrap semi-card-group',
        grid ? 'semi-card-group-grid' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ columnGap: grid ? 0 : columnGap, rowGap: grid ? 0 : rowGap }}
      {...rest}
    >
      {children}
    </div>
  );
}
