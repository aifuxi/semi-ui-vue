import React from 'react';
import Navigation from '@semi-v2.102.0/navigation';

const items = [
  { itemKey: 'home', text: '首页' },
  {
    itemKey: 'workspace',
    text: '工作台',
    items: [
      { itemKey: 'projects', text: '项目' },
      { itemKey: 'members', text: '成员' },
    ],
  },
  { itemKey: 'settings', text: '设置', disabled: true },
];

export function NavigationScenario(): React.ReactElement {
  return (
    <div className="navigation-scenario" data-testid="navigation-reference">
      <Navigation
        bodyStyle={{ height: 224 }}
        data-parity-target="navigation-root"
        defaultOpenKeys={['workspace']}
        defaultSelectedKeys={['projects']}
        footer={{ collapseButton: true }}
        header={{ text: 'Semi Console' }}
        items={items}
      />
    </div>
  );
}
