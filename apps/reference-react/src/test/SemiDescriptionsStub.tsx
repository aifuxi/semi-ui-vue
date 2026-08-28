import React, { createContext, useContext, type CSSProperties, type ReactNode } from 'react';

interface DataItem {
  key?: ReactNode;
  value?: ReactNode | (() => ReactNode);
  hidden?: boolean;
  span?: number;
  keyStyle?: CSSProperties;
}

interface ItemProps extends DataItem {
  children?: ReactNode | (() => ReactNode);
  className?: string;
  itemKey?: ReactNode;
  style?: CSSProperties;
  [key: `data-${string}`]: unknown;
}

interface DescriptionsProps {
  align?: 'center' | 'justify' | 'left' | 'plain';
  children?: ReactNode;
  className?: string;
  column?: number;
  data?: DataItem[];
  layout?: 'horizontal' | 'vertical';
  row?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: CSSProperties;
  [key: `data-${string}`]: unknown;
}

const Context = createContext({
  align: 'center' as NonNullable<DescriptionsProps['align']>,
  layout: 'vertical' as NonNullable<DescriptionsProps['layout']>,
});

function dataAttrs(props: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(props).filter(([name]) => name.startsWith('data-')));
}

function Item(props: ItemProps): React.ReactElement | null {
  const { align, layout } = useContext(Context);
  const { children, className, hidden, itemKey, keyStyle, span, style, ...rest } = props;
  if (hidden) return null;
  const value = typeof children === 'function' ? children() : children;
  const plain = (
    <td className="semi-descriptions-item" colSpan={span || 1}>
      <span className="semi-descriptions-key" style={keyStyle}>
        {itemKey}:
      </span>
      <span className="semi-descriptions-value">{value}</span>
    </td>
  );
  const aligned = (
    <>
      <th className="semi-descriptions-item semi-descriptions-item-th">
        <span className="semi-descriptions-key" style={keyStyle}>
          {itemKey}
        </span>
      </th>
      <td
        className="semi-descriptions-item semi-descriptions-item-td"
        colSpan={span ? span * 2 - 1 : 1}
      >
        <span className="semi-descriptions-value">{value}</span>
      </td>
    </>
  );
  if (layout === 'horizontal') return <>{align === 'plain' ? plain : aligned}</>;
  return (
    <tr className={className} style={style} {...dataAttrs(rest)}>
      {align === 'plain' ? plain : aligned}
    </tr>
  );
}

function rows(items: ItemProps[], column: number): ItemProps[][] {
  const result: ItemProps[][] = [];
  let current: ItemProps[] = [];
  let total = 0;
  for (const item of items.filter((entry) => !entry.hidden)) {
    const clone = { ...item };
    current.push(clone);
    total += clone.span || 1;
    if (total >= column) {
      result.push(current);
      current = [];
      total = 0;
    }
  }
  if (current.length > 0) {
    const last = current[current.length - 1]!;
    if (Number.isNaN(Number(last.span))) last.span = column - total + 1;
    result.push(current);
  }
  return result;
}

function DescriptionsBase({
  align = 'center',
  children,
  className,
  column = 3,
  data = [],
  layout = 'vertical',
  row = false,
  size = 'medium',
  style,
  ...rest
}: DescriptionsProps): React.ReactElement {
  const classes = [
    'semi-descriptions',
    !row ? `semi-descriptions-${align}` : undefined,
    row ? 'semi-descriptions-double' : undefined,
    row ? `semi-descriptions-double-${size}` : undefined,
    `semi-descriptions-${layout}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const items: ItemProps[] = data.length
    ? data.map((item) => ({ ...item, itemKey: item.key, children: item.value }))
    : React.Children.toArray(children).flatMap((child) =>
        React.isValidElement<ItemProps>(child)
          ? [{ ...child.props, children: child.props.children }]
          : [],
      );
  return (
    <div className={classes} style={style} {...dataAttrs(rest)}>
      <table>
        <tbody>
          <Context.Provider value={{ align, layout }}>
            {layout === 'horizontal'
              ? rows(items, column).map((group, rowIndex) => (
                  <tr key={rowIndex}>
                    {group.map((item, index) => (
                      <Item {...item} key={index} />
                    ))}
                  </tr>
                ))
              : data.length
                ? items.map((item, index) => <Item {...item} key={index} />)
                : children}
          </Context.Provider>
        </tbody>
      </table>
    </div>
  );
}

const Descriptions = Object.assign(DescriptionsBase, { Item });
export default Descriptions;
