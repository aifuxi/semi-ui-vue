import React, { useState } from 'react';
import type { BannerProps } from '@semi-v2.102.0/banner';

export default function Banner({
  children,
  className,
  closeIcon,
  description,
  fullMode = true,
  icon,
  title,
  type = 'info',
  onClose,
  ...props
}: BannerProps): React.ReactElement | null {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      className={`semi-banner semi-banner-${type} ${fullMode ? 'semi-banner-full' : 'semi-banner-in-container'}${className ? ` ${className}` : ''}`}
      role="alert"
      {...props}
    >
      {icon === undefined ? <span className="semi-banner-icon" /> : icon}
      {title}
      {description}
      {children}
      {closeIcon !== null ? (
        <button
          aria-label="Close"
          onClick={(event) => {
            onClose?.(event);
            setVisible(false);
          }}
        />
      ) : null}
    </div>
  );
}
