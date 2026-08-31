import React from 'react';

export default function SemiJsonViewerStub(props: Record<string, unknown>): React.ReactElement {
  const { className, height, style, value, width, ...rest } = props;

  return (
    <div
      {...rest}
      className={['semi-json-viewer', className].filter(Boolean).join(' ')}
      style={{
        width: width as React.CSSProperties['width'],
        height: height as React.CSSProperties['height'],
        ...(style as React.CSSProperties | undefined),
      }}
    >
      <pre className="semi-json-viewer-content">{String(value ?? '')}</pre>
    </div>
  );
}
