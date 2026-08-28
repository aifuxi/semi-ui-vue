import React from 'react';
import type { AvatarProps } from '@semi-v2.102.0/avatar';

export default function Avatar({
  alt,
  border,
  bottomSlot,
  children,
  className,
  color = 'grey',
  shape = 'circle',
  size = 'medium',
  src,
  style,
  topSlot,
  ...rest
}: AvatarProps): React.ReactElement {
  const dataAttrs = Object.fromEntries(
    Object.entries(rest).filter(([name]) => name.startsWith('data-')),
  ) as React.HTMLAttributes<HTMLSpanElement>;
  const avatar = (
    <span
      {...dataAttrs}
      className={`semi-avatar semi-avatar-${shape} semi-avatar-${size} ${src ? 'semi-avatar-img' : `semi-avatar-${color}`} ${className ?? ''}`}
      role="listitem"
      style={border || topSlot || bottomSlot ? undefined : style}
    >
      {src ? (
        <img alt={alt} src={src} />
      ) : (
        <span className="semi-avatar-content">
          <span aria-label={alt ?? String(children ?? '')} className="semi-avatar-label" role="img">
            {children}
          </span>
        </span>
      )}
    </span>
  );
  if (!border && !topSlot && !bottomSlot) return avatar;
  return (
    <span className="semi-avatar-wrapper" style={style}>
      {border ? (
        <div style={{ position: 'relative', ...style }}>
          {avatar}
          <span className={`semi-avatar-additionalBorder semi-avatar-additionalBorder-${size}`} />
          {typeof border === 'object' && border.motion ? (
            <span className="semi-avatar-additionalBorder semi-avatar-additionalBorder-animated" />
          ) : null}
        </div>
      ) : (
        avatar
      )}
      {topSlot ? (
        <div className="semi-avatar-top_slot-wrapper">
          <div className={`semi-avatar-top_slot-content semi-avatar-top_slot-content-${size}`}>
            {topSlot.text}
          </div>
        </div>
      ) : null}
      {bottomSlot ? (
        <div className="semi-avatar-bottom_slot">
          <span className={`semi-avatar-bottom_slot-shape_${bottomSlot.shape}-${size}`}>
            {bottomSlot.text}
          </span>
        </div>
      ) : null}
    </span>
  );
}
