import React from 'react';
import type { ButtonProps } from '@semi-v2.102.0/button';

export default function SemiButtonStub(props: ButtonProps): React.ReactElement {
  const domProps = Object.fromEntries(
    Object.entries(props).filter(
      ([name]) =>
        name.startsWith('data-') ||
        name.startsWith('aria-') ||
        ['className', 'disabled', 'id', 'style', 'tabIndex'].includes(name),
    ),
  );
  return (
    <button {...domProps} type={props.htmlType ?? 'button'}>
      {props.children}
    </button>
  );
}
