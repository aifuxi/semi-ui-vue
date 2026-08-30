import React from 'react';

interface NavigationItem {
  disabled?: boolean;
  itemKey: string | number;
  items?: NavigationItem[];
  text?: React.ReactNode;
}

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  bodyStyle?: React.CSSProperties;
  defaultOpenKeys?: Array<string | number>;
  defaultSelectedKeys?: Array<string | number>;
  footer?: { collapseButton?: boolean };
  header?: { text?: React.ReactNode };
  items?: NavigationItem[];
}

function renderItems(items: NavigationItem[], selected: Array<string | number>): React.ReactNode {
  return items.map((item) => (
    <li
      aria-disabled={item.disabled || undefined}
      className={selected.includes(item.itemKey) ? 'semi-navigation-item-selected' : undefined}
      key={item.itemKey}
      role="menuitem"
    >
      {item.text}
      {item.items ? <ul>{renderItems(item.items, selected)}</ul> : null}
    </li>
  ));
}

export default function Navigation({
  bodyStyle,
  defaultSelectedKeys = [],
  footer,
  header,
  items = [],
  ...props
}: NavigationProps): React.ReactElement {
  return (
    <div className="semi-navigation semi-navigation-vertical" {...props}>
      {header?.text ? <div className="semi-navigation-header">{header.text}</div> : null}
      <ul aria-orientation="vertical" role="menu" style={bodyStyle}>
        {renderItems(items, defaultSelectedKeys)}
      </ul>
      {footer?.collapseButton ? (
        <div className="semi-navigation-collapse-btn">收起侧边栏</div>
      ) : null}
    </div>
  );
}
