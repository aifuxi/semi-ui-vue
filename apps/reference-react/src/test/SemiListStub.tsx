import React, { createContext, useContext, type CSSProperties, type ReactNode } from 'react';

interface Grid {
  gutter?: number;
  span?: number;
}

interface ListProps<T = unknown> {
  bordered?: boolean;
  children?: ReactNode;
  className?: string;
  dataSource?: T[];
  footer?: ReactNode;
  grid?: Grid;
  header?: ReactNode;
  layout?: 'vertical' | 'horizontal';
  renderItem?: (item: T, index: number) => ReactNode;
  size?: 'small' | 'default' | 'large';
  split?: boolean;
  style?: CSSProperties;
}

interface ItemProps {
  children?: ReactNode;
  extra?: ReactNode;
  header?: ReactNode;
  main?: ReactNode;
}

const GridContext = createContext<Grid | undefined>(undefined);

function Item({ children, extra, header, main }: ItemProps): React.ReactElement {
  const grid = useContext(GridContext);
  const item = (
    <li className="semi-list-item">
      {header || main ? (
        <div className="semi-list-item-body semi-list-item-body-flex-start">
          {header ? <div className="semi-list-item-body-header">{header}</div> : null}
          {main ? <div className="semi-list-item-body-main">{main}</div> : null}
        </div>
      ) : null}
      {children}
      {extra ? <div className="semi-list-item-extra">{extra}</div> : null}
    </li>
  );
  return grid ? <div className={`semi-col semi-col-${grid.span}`}>{item}</div> : item;
}

function ListBase<T>({
  bordered = false,
  children,
  className,
  dataSource,
  footer,
  grid,
  header,
  layout = 'vertical',
  renderItem,
  size = 'default',
  split = true,
  style,
}: ListProps<T>): React.ReactElement {
  const classes = [
    'semi-list',
    `semi-list-${size}`,
    layout === 'horizontal' ? 'semi-list-flex' : '',
    grid ? 'semi-list-grid' : '',
    split ? 'semi-list-split' : '',
    bordered ? 'semi-list-bordered' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const items = dataSource?.length && renderItem ? dataSource.map(renderItem) : null;
  const content = grid ? (
    <div
      className="semi-row-flex"
      style={{ marginLeft: -((grid.gutter ?? 0) / 2), marginRight: -((grid.gutter ?? 0) / 2) }}
    >
      {items}
      {children}
    </div>
  ) : (
    <ul className="semi-list-items">
      {items}
      {children}
    </ul>
  );
  return (
    <div className={classes} style={style}>
      {header ? (
        <div className="semi-list-header" x-semi-prop="header">
          {header}
        </div>
      ) : null}
      <GridContext.Provider value={grid}>
        <div className="semi-spin semi-spin-large semi-spin-block semi-spin-hidden">
          <div className="semi-spin-children" x-semi-prop="children">
            {content}
          </div>
        </div>
      </GridContext.Provider>
      {footer ? (
        <div className="semi-list-footer" x-semi-prop="footer">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

const List = Object.assign(ListBase, { Item });
export default List;
