import React, { forwardRef, useImperativeHandle } from 'react';

interface FixedSizeListProps {
  children: React.ComponentType<{
    index: number;
    data: Record<string, unknown>;
    style: React.CSSProperties;
  }>;
  className?: string;
  height: number;
  itemCount: number;
  itemData: Record<string, unknown>;
  itemSize: number;
  style?: React.CSSProperties;
  width: string | number;
}

export const FixedSizeList = forwardRef<{ scrollToItem(): void }, FixedSizeListProps>(
  function FixedSizeList(
    { children: Row, className, height, itemCount, itemData, itemSize, style, width },
    ref,
  ) {
    useImperativeHandle(ref, () => ({ scrollToItem: () => undefined }), []);
    return (
      <div
        className={className}
        style={{ ...style, height, width, overflow: 'auto', position: 'relative' }}
      >
        <div style={{ height: itemCount * itemSize, position: 'relative' }}>
          {Array.from({ length: itemCount }, (_, index) => (
            <Row
              key={index}
              index={index}
              data={itemData}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: index * itemSize,
                height: itemSize,
              }}
            />
          ))}
        </div>
      </div>
    );
  },
);

// The pinned Table Adapter imports VariableSizeList even when virtualization is
// disabled. The parity scene does not virtualize, so the deterministic fixed
// implementation is sufficient while preserving the upstream module shape.
export const VariableSizeList = FixedSizeList;
