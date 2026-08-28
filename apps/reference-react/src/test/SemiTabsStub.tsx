import React, { useState } from 'react';
import type { TabPaneProps, TabsProps } from '@semi-v2.102.0/tabs';

function TabPaneStub({ children }: TabPaneProps): React.ReactElement {
  return <>{children}</>;
}

function TabsStub({
  children,
  defaultActiveKey,
  onChange,
  tabPosition = 'top',
  type = 'line',
  ...rest
}: TabsProps): React.ReactElement {
  const panes = React.Children.toArray(children).filter(React.isValidElement<TabPaneProps>);
  const [active, setActive] = useState(
    defaultActiveKey ?? panes.find((pane) => !pane.props.disabled)?.props.itemKey ?? '',
  );
  const dataAttrs = Object.fromEntries(
    Object.entries(rest).filter(([name]) => name.startsWith('data-')),
  ) as React.HTMLAttributes<HTMLDivElement>;
  return (
    <div className={`semi-tabs semi-tabs-${tabPosition}`} {...dataAttrs}>
      <div
        className={`semi-tabs-bar semi-tabs-bar-${type} semi-tabs-bar-${tabPosition}`}
        role="tablist"
      >
        {panes.map((pane) => (
          <div
            aria-selected={active === pane.props.itemKey}
            className={`semi-tabs-tab semi-tabs-tab-${type}${active === pane.props.itemKey ? ' semi-tabs-tab-active' : ''}`}
            key={pane.props.itemKey}
            onClick={() => {
              setActive(pane.props.itemKey);
              onChange?.(pane.props.itemKey);
            }}
            role="tab"
          >
            {pane.props.tab}
          </div>
        ))}
      </div>
      <div className={`semi-tabs-content semi-tabs-content-${tabPosition}`}>
        {panes.map((pane) => (
          <div
            className={`semi-tabs-pane ${active === pane.props.itemKey ? 'semi-tabs-pane-active' : 'semi-tabs-pane-inactive'}`}
            key={pane.props.itemKey}
            role="tabpanel"
          >
            {pane.props.children}
          </div>
        ))}
      </div>
    </div>
  );
}

TabsStub.TabPane = TabPaneStub;
TabsStub.TabItem = () => null;

export { TabPaneStub as TabPane };
export default TabsStub;
