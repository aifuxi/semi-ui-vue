import React, { useState } from 'react';
import type { TagProps } from '@semi-v2.102.0/tag';

export default function SemiTagStub({
  children,
  className,
  closable = false,
  color = 'grey',
  shape = 'square',
  size = 'default',
  style,
  type = 'light',
  visible,
  onClose,
}: TagProps): React.ReactElement {
  const [internalVisible, setInternalVisible] = useState(true);
  const shown = visible === undefined ? internalVisible : visible;
  return (
    <div
      className={[
        'semi-tag',
        `semi-tag-${size}`,
        `semi-tag-${shape}`,
        `semi-tag-${type}`,
        `semi-tag-${color}-${type}`,
        closable ? 'semi-tag-closable' : '',
        shown ? '' : 'semi-tag-invisible',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <div className="semi-tag-content semi-tag-content-ellipsis">{children}</div>
      {closable ? (
        <div
          className="semi-tag-close"
          onClick={(event) => {
            event.stopPropagation();
            onClose?.(children, event, undefined as unknown as string);
            if (!event.defaultPrevented && visible === undefined) setInternalVisible(false);
          }}
        />
      ) : null}
    </div>
  );
}
