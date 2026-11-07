import React, { useState } from 'react';
import Tabs from '@semi-v2.102.0/tabs';

const TabPane = Tabs.TabPane;

const labels = ['文档', '快速起步', '帮助'];

function panes(prefix = ''): React.ReactElement[] {
  return labels.map((label, index) => (
    <TabPane
      closable={prefix === 'behavior' && index === 2}
      disabled={prefix === 'behavior' && index === 1}
      itemKey={`${prefix}${index + 1}`}
      key={`${prefix}${index + 1}`}
      tab={label}
    >
      {label}内容
    </TabPane>
  ));
}

export function TabsScenario(): React.ReactElement {
  /** 审查入口通过真实公开 size prop 补齐三档排版，缺省仍使用原场景的 large。 */
  const requestedSize = new URLSearchParams(window.location.search).get('tabsSize');
  /** 固定 Semi 只接受这三档尺寸；未知查询值保留默认场景。 */
  const reviewSize =
    requestedSize === 'small' || requestedSize === 'medium' ? requestedSize : 'large';
  const [status, setStatus] = useState('等待操作');
  return (
    <div className="tabs-scenario" data-testid="tabs-reference">
      <div className="tabs-scenario__section">
        <span className="tabs-scenario__label">Line / 文档首例</span>
        <Tabs
          size={reviewSize}
          data-parity-target="tabs-line"
          onChange={(key) => setStatus(`Line：${key}`)}
        >
          {panes('line')}
        </Tabs>
      </div>
      <div className="tabs-scenario__types">
        {(['card', 'button', 'slash'] as const).map((type) => (
          <div className="tabs-scenario__section" key={type}>
            <span className="tabs-scenario__label">{type}</span>
            <Tabs size={reviewSize} data-parity-target={`tabs-${type}`} type={type}>
              {panes(type)}
            </Tabs>
          </div>
        ))}
      </div>
      <div className="tabs-scenario__section tabs-scenario__left">
        <span className="tabs-scenario__label">Left / disabled / closable</span>
        <Tabs
          size={reviewSize}
          data-parity-target="tabs-left"
          defaultActiveKey="behavior1"
          onChange={(key) => setStatus(`Left：${key}`)}
          onTabClose={(key) => setStatus(`关闭：${key}`)}
          tabBarExtraContent={<span className="tabs-scenario__extra">操作</span>}
          tabPosition="left"
          type="card"
        >
          {panes('behavior')}
        </Tabs>
      </div>
      <div className="tabs-scenario__types">
        <div className="tabs-scenario__section">
          <span className="tabs-scenario__label">More</span>
          <Tabs size={reviewSize} data-parity-target="tabs-more" more={2} type="card">
            {Array.from({ length: 6 }, (_, index) => (
              <TabPane itemKey={`more${index + 1}`} key={index} tab={`Tab-${index + 1}`}>
                More content {index + 1}
              </TabPane>
            ))}
          </Tabs>
        </div>
        <div className="tabs-scenario__section tabs-scenario__collapsed">
          <span className="tabs-scenario__label">Collapsible</span>
          <Tabs size={reviewSize} collapsible data-parity-target="tabs-collapsible" type="card">
            {Array.from({ length: 7 }, (_, index) => (
              <TabPane itemKey={`scroll${index + 1}`} key={index} tab={`Long Tab ${index + 1}`}>
                Scroll content {index + 1}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
      <output className="tabs-scenario__status" aria-live="polite">
        {status}
      </output>
    </div>
  );
}
