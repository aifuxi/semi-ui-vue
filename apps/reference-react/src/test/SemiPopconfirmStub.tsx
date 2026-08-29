import React, { type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export default function Popconfirm(props: Props): React.ReactElement {
  return <>{props.children}</>;
}
