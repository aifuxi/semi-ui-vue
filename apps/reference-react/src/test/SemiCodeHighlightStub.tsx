import React from 'react';
import type { CodeHighlightProps } from '@semi-v2.102.0/code-highlight';

export default function CodeHighlight({
  className,
  code,
  defaultTheme = true,
  style,
  ...props
}: CodeHighlightProps): React.ReactElement {
  const dataAttrs = Object.fromEntries(
    Object.entries(props).filter(([name]) => name.startsWith('data-')),
  );
  return (
    <div
      {...dataAttrs}
      className={[
        className,
        'semi-codeHighlight',
        'semi-light-scrollbar',
        defaultTheme ? 'semi-codeHighlight-defaultTheme' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
