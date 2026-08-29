import React, { type CSSProperties, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  className?: string;
  content?: ReactNode;
  style?: CSSProperties;
}

export default function Popover(props: Props): React.ReactElement {
  return <span className="semi-popover-trigger">{props.children}</span>;
}
