import React from 'react';

interface SplitTagGroupProps {
  'aria-label'?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function SemiSplitTagGroupStub({
  'aria-label': ariaLabel,
  children,
  className,
  style,
}: SplitTagGroupProps): React.ReactElement {
  const elements = React.Children.toArray(children).filter(React.isValidElement);
  return (
    <div
      aria-label={ariaLabel}
      className={['semi-tag-split', className].filter(Boolean).join(' ')}
      role="group"
      style={style}
    >
      {elements.map((child, index) =>
        React.cloneElement(child, {
          className: [
            (child.props as { className?: string }).className,
            index === 0 ? 'semi-tag-first' : '',
            index === elements.length - 1 ? 'semi-tag-last' : '',
          ]
            .filter(Boolean)
            .join(' '),
        } as React.Attributes),
      )}
    </div>
  );
}
