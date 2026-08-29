import React from 'react';

export interface SpinProps extends React.HTMLAttributes<HTMLDivElement> {
  childStyle?: React.CSSProperties;
  delay?: number;
  indicator?: React.ReactNode;
  size?: 'small' | 'middle' | 'large';
  spinning?: boolean;
  tip?: React.ReactNode;
  wrapperClassName?: string;
}

export default function Spin({
  children,
  childStyle,
  className,
  indicator,
  size = 'middle',
  spinning = true,
  tip,
  wrapperClassName,
  ...props
}: SpinProps): React.ReactElement {
  return (
    <div
      className={`semi-spin semi-spin-${size}${children ? ' semi-spin-block' : ''}${!spinning ? ' semi-spin-hidden' : ''}${wrapperClassName ? ` ${wrapperClassName}` : ''}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {spinning ? (
        <div className="semi-spin-wrapper">
          {indicator ? (
            <div className="semi-spin-animate">{indicator}</div>
          ) : (
            <svg data-icon="spin" />
          )}
          {tip ? <div>{tip}</div> : null}
        </div>
      ) : null}
      <div className="semi-spin-children" style={childStyle}>
        {children}
      </div>
    </div>
  );
}
