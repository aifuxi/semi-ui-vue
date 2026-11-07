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
  /** 两端通过同一只读查询展示公开模式，默认仍为原来的垂直导航。 */
  const reviewMode =
    new URLSearchParams(window.location.search).get('navigationMode') === 'horizontal'
      ? 'horizontal'
      : 'vertical';
  return (
    <div
      className="navigation-scenario"
      data-testid="navigation-reference"
      style={reviewMode === 'horizontal' ? { width: '100%' } : {}}
    >
      <Navigation
        mode={reviewMode}
        bodyStyle={reviewMode === 'horizontal' ? {} : { height: 224 }}
        style={reviewMode === 'horizontal' ? { width: '100%' } : {}}
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
