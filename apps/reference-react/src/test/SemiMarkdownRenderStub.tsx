import React from 'react';

export default function SemiMarkdownRenderStub({
  className,
  ...properties
}: {
  className?: string;
  raw?: string;
  [key: string]: unknown;
}): React.ReactElement {
  const dataAttributes = Object.fromEntries(
    Object.entries(properties).filter(([name]) => name.startsWith('data-')),
  );
  return (
    <div
      className={['semi-markdownRender', className].filter(Boolean).join(' ')}
      {...dataAttributes}
    />
  );
}
