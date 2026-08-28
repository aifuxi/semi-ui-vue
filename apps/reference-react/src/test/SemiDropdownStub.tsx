import React, { type ComponentType, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

const Passthrough: ComponentType<Props> = ({ children }) => <>{children}</>;
const Dropdown = Object.assign(Passthrough, {
  Divider: () => <div className="semi-dropdown-divider" />,
  Item: ({ children }: Props) => <li className="semi-dropdown-item">{children}</li>,
  Menu: ({ children }: Props) => <ul className="semi-dropdown-menu">{children}</ul>,
  Title: ({ children }: Props) => <div className="semi-dropdown-title">{children}</div>,
});

export default Dropdown;
