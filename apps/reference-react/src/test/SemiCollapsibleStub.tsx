import React, { type CSSProperties, type ReactNode } from 'react';

export interface SemiCollapsibleStubProps {
  children?: ReactNode;
  className?: string;
  collapseHeight?: number;
  collapseHeightAdaptive?: boolean;
  fade?: boolean;
  id?: string;
  isOpen?: boolean;
  keepDOM?: boolean;
  lazyRender?: boolean;
  motion?: boolean;
  onMotionEnd?: () => void;
  reCalcKey?: number | string;
  style?: CSSProperties;
  [key: `data-${string}`]: string | number | boolean | undefined;
}

export default function SemiCollapsibleStub({
  children,
  className,
  collapseHeight = 0,
  id,
  isOpen = false,
  keepDOM = false,
  lazyRender = false,
  style,
  ...props
}: SemiCollapsibleStubProps) {
  const shouldRender = keepDOM ? !lazyRender || isOpen : collapseHeight !== 0 || isOpen;
  const dataProps = Object.fromEntries(
    Object.entries(props).filter(([name]) => name.startsWith('data-')),
  );
  return (
    <div
      {...dataProps}
      className={`semi-collapsible-wrapper${className ? ` ${className}` : ''}`}
      style={{
        overflow: 'hidden',
        height: isOpen ? 0 : collapseHeight,
        opacity: 1,
        transitionDuration: '0ms',
        ...style,
      }}
    >
      <div id={id} x-semi-prop="children" style={{ overflow: 'hidden' }}>
        {shouldRender ? children : null}
      </div>
    </div>
  );
}
