import React from 'react';
import type { ButtonProps } from '@semi-v2.102.0/button';

export default function SemiButtonStub(props: ButtonProps): React.ReactElement {
  return <button type={props.htmlType ?? 'button'}>{props.children}</button>;
}
