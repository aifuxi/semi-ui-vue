import React from 'react';

type DivProps = React.HTMLAttributes<HTMLDivElement> & { defaultSize?: string | number | object };

export function Resizable({
  children,
  className,
  defaultSize,
  style,
  minWidth: _minWidth,
  maxWidth: _maxWidth,
  onChange: _onChange,
  onResizeEnd: _onResizeEnd,
  ...rest
}: DivProps & {
  minWidth?: string | number;
  maxWidth?: string | number;
  onChange?: unknown;
  onResizeEnd?: unknown;
}) {
  void _minWidth;
  void _maxWidth;
  void _onChange;
  void _onResizeEnd;
  const size = typeof defaultSize === 'object' ? defaultSize : {};
  return (
    <div
      className={`${className ?? ''} semi-resizable-resizable`}
      style={{ ...style, ...size }}
      {...rest}
    >
      {children}
      <div>
        <div className="semi-resizable-resizableHandler semi-resizable-resizableHandler-right" />
      </div>
    </div>
  );
}

export function ResizeGroup({ children, className, style, ...rest }: DivProps) {
  return (
    <div className={`${className ?? ''} semi-resizable-group`} style={style} {...rest}>
      {children}
    </div>
  );
}

export function ResizeItem({
  children,
  className,
  style,
  defaultSize: _defaultSize,
  min: _min,
  max: _max,
  onChange: _onChange,
  onResizeEnd: _onResizeEnd,
}: DivProps & {
  min?: string;
  max?: string;
  onChange?: unknown;
  onResizeEnd?: unknown;
}) {
  void _defaultSize;
  void _min;
  void _max;
  void _onChange;
  void _onResizeEnd;
  return (
    <div className={`${className ?? ''} semi-resizable-item`} style={style}>
      {children}
    </div>
  );
}

export function ResizeHandler({ children, className, style, ...rest }: DivProps) {
  return (
    <div className={`${className ?? ''} semi-resizable-handler`} style={style} {...rest}>
      {children}
    </div>
  );
}
