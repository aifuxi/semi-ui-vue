import React, { forwardRef, useImperativeHandle } from 'react';

interface FixedSizeListProps {
  children: React.ComponentType<{
    index: number;
    data: Record<string, unknown>;
    style: React.CSSProperties;
  }>;
  height: number;
  itemCount: number;
  itemData: Record<string, unknown>;
  itemSize: number;
  style?: React.CSSProperties;
  width: string | number;
}

export const FixedSizeList = forwardRef<{ scrollToItem(): void }, FixedSizeListProps>(
  function FixedSizeList(
    { children: Row, height, itemCount, itemData, itemSize, style, width },
    ref,
  ) {
    useImperativeHandle(ref, () => ({ scrollToItem: () => undefined }), []);
    return (
      <div style={{ ...style, height, width, overflow: 'auto', position: 'relative' }}>
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
