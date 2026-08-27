import React from 'react';
import type { TooltipProps } from '@semi-v2.102.0/tooltip';

export default function Tooltip({
  children,
  role = 'tooltip',
  visible = false,
  wrapperClassName,
  wrapperId,
}: TooltipProps): React.ReactElement {
  const child = React.isValidElement(children) ? children : <span>{children}</span>;
  const aria =
    role === 'dialog'
      ? {
          'aria-controls': wrapperId,
          'aria-expanded': String(visible),
          'aria-haspopup': 'dialog',
        }
      : { 'aria-describedby': wrapperId };
  const decorated = React.cloneElement(child, {
    ...aria,
    'data-popupid': wrapperId,
    tabIndex: child.props.tabIndex ?? 0,
  });

  return child.props.disabled ? (
    <span className={wrapperClassName} style={{ cursor: 'not-allowed' }}>
      {decorated}
    </span>
  ) : (
    decorated
  );
}
