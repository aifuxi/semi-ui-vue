import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  imgCls?: string;
  preview?: boolean | { previewTitle?: React.ReactNode };
}

export default function Image({
  className,
  imgCls,
  preview = true,
  style,
  width,
  height,
  ...props
}: ImageProps): React.ReactElement {
  return (
    <div
      className={['semi-image', className].filter(Boolean).join(' ')}
      style={{ width, height, ...style }}
    >
      <img
        {...props}
        className={['semi-image-img', preview ? 'semi-image-img-preview' : '', imgCls]
          .filter(Boolean)
          .join(' ')}
        width={width}
        height={height}
      />
    </div>
  );
}

export function Preview({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>): React.ReactElement {
  return (
    <div className={['semi-image-preview-group', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
