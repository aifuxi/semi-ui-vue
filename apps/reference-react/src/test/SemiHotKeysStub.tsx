import React from 'react';
import type { HotKeysProps } from '@semi-v2.102.0/hot-keys';

const Keys = {
  Alt: 'alt',
  ArrowDown: 'arrowdown',
  Control: 'control',
  Enter: 'enter',
  K: 'k',
  Meta: 'meta',
  R: 'r',
  Shift: 'shift',
} as const;

function HotKeysBase({ className, content, hotKeys = [], render, style, ...props }: HotKeysProps) {
  const dataAttrs = Object.fromEntries(
    Object.entries(props).filter(([name]) => name.startsWith('data-')),
  );
  if (render === null || (typeof render === 'function' && render() === null)) return null;
  return (
    <div
      {...dataAttrs}
      className={['semi-hotKeys', className].filter(Boolean).join(' ')}
      style={style}
    >
      {render !== undefined
        ? typeof render === 'function'
          ? render()
          : render
        : (content ?? hotKeys).map((key, index) => (
            <span key={index}>
              {index > 0 ? <span className="semi-hotKeys-split">+</span> : null}
              <span className="semi-hotKeys-content">{key}</span>
            </span>
          ))}
    </div>
  );
}

const HotKeys = Object.assign(HotKeysBase, { Keys });

export default HotKeys;
