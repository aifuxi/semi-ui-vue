import React from 'react';
import type { BackTopProps } from '@semi-v2.102.0/back-top';

export default function SemiBackTopStub({
  children,
  className = '',
  duration = 450,
  target: _target,
  visibilityHeight: _visibilityHeight,
  ...domProps
}: BackTopProps): React.ReactElement {
  void _target;
  void _visibilityHeight;
  const rootProps = { ...domProps, duration } as React.HTMLAttributes<HTMLDivElement>;
  return (
    <div {...rootProps} className={`semi-backtop ${className}`}>
      {children ?? <button className="semi-button semi-button-with-icon-only">↑</button>}
    </div>
  );
}
