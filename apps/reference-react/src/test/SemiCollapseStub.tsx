import React, { createContext, useContext } from 'react';

type ActiveKey = string | string[];
interface ContextValue {
  active: Set<string>;
  clickHeaderToExpand: boolean;
  collapseIcon?: React.ReactNode;
  expandIcon?: React.ReactNode;
  expandIconPosition: 'left' | 'right';
  keepDOM: boolean;
}
const Context = createContext<ContextValue>({
  active: new Set(),
  clickHeaderToExpand: true,
  expandIconPosition: 'right',
  keepDOM: false,
});

export interface CollapseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  activeKey?: ActiveKey;
  accordion?: boolean;
  clickHeaderToExpand?: boolean;
  collapseIcon?: React.ReactNode;
  defaultActiveKey?: ActiveKey;
  expandIcon?: React.ReactNode;
  expandIconPosition?: 'left' | 'right';
  keepDOM?: boolean;
  lazyRender?: boolean;
  motion?: boolean;
  onChange?: (activeKey: ActiveKey, event: React.MouseEvent) => void;
}

export interface CollapsePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  extra?: React.ReactNode;
  header?: React.ReactNode;
  itemKey: string;
  showArrow?: boolean;
}

function CollapsePanel({
  children,
  className,
  disabled = false,
  extra,
  header,
  itemKey,
  showArrow = true,
  ...rest
}: CollapsePanelProps): React.ReactElement {
  const context = useContext(Context);
  const active = context.active.has(itemKey);
  const icon = active ? (context.collapseIcon ?? '⌃') : (context.expandIcon ?? '⌄');
  return (
    <div
      className={`semi-collapse-item${active ? ' semi-collapse-item-active' : ''}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      <div
        role="button"
        tabIndex={0}
        className={`semi-collapse-header${disabled ? ' semi-collapse-header-disabled' : ''}${context.expandIconPosition === 'left' ? ' semi-collapse-header-iconLeft' : ''}`}
        aria-disabled={disabled}
        aria-expanded={active}
      >
        {showArrow && context.expandIconPosition === 'left' ? (
          <span className="semi-collapse-header-icon">{icon}</span>
        ) : null}
        {typeof header === 'string' ? <span>{header}</span> : header}
        {typeof header === 'string' ? (
          <span className="semi-collapse-header-right">
            <span>{extra}</span>
            {showArrow && context.expandIconPosition === 'right' ? (
              <span className="semi-collapse-header-icon">{icon}</span>
            ) : null}
          </span>
        ) : showArrow && context.expandIconPosition === 'right' ? (
          <span className="semi-collapse-header-icon">{icon}</span>
        ) : null}
      </div>
      {(active || context.keepDOM) && children ? (
        <div className="semi-collapsible-wrapper">
          <div className="semi-collapse-content" aria-hidden={!active}>
            <div className="semi-collapse-content-wrapper">{children}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type CollapseComponent = React.FC<CollapseProps> & { Panel: typeof CollapsePanel };

const Collapse = (({
  activeKey,
  accordion = false,
  children,
  className,
  clickHeaderToExpand = true,
  collapseIcon,
  defaultActiveKey = '',
  expandIcon,
  expandIconPosition = 'right',
  keepDOM = false,
  onChange,
  ...rest
}: CollapseProps) => {
  void onChange;
  const raw = activeKey || defaultActiveKey;
  const keys = raw ? (Array.isArray(raw) ? raw : [raw]) : [];
  const active = new Set(accordion ? keys.slice(0, 1) : keys);
  return (
    <div className={`semi-collapse${className ? ` ${className}` : ''}`} {...rest}>
      <Context.Provider
        value={{
          active,
          clickHeaderToExpand,
          collapseIcon,
          expandIcon,
          expandIconPosition,
          keepDOM,
        }}
      >
        {children}
      </Context.Provider>
    </div>
  );
}) as CollapseComponent;

Collapse.Panel = CollapsePanel;
export default Collapse;
