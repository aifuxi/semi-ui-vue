import React, { useState } from 'react';
import Collapse, { type CollapseActiveKey } from '@semi-v2.102.0/collapse';

function keyList(value: CollapseActiveKey): string[] {
  return Array.isArray(value) ? value : [value];
}

export function CollapseScenario(): React.ReactElement {
  const [controlledKeys, setControlledKeys] = useState<string[]>(['controlled-1']);
  const [status, setStatus] = useState('基础面板：overview');

  return (
    <div className="collapse-scenario" data-testid="collapse-reference">
      <section className="collapse-scenario__section collapse-scenario__section--wide">
        <div className="collapse-scenario__heading">
          <div>
            <strong>交付信息</strong>
            <span>多面板 + keepDOM / lazyRender</span>
          </div>
        </div>
        <Collapse
          defaultActiveKey={['overview']}
          keepDOM
          lazyRender
          motion={false}
          data-parity-target="collapse-basic"
          onChange={(keys) => setStatus(`基础面板：${keyList(keys).join(',') || 'none'}`)}
        >
          <Collapse.Panel itemKey="overview" header="版本基线" extra="v2.102.0">
            <p>固定源码、组件行为与视觉证据同步交付。</p>
          </Collapse.Panel>
          <Collapse.Panel itemKey="quality" header="质量门禁">
            <p data-lazy-content>类型、单元、SSR、Chromium 与真实 tarball 全部通过。</p>
          </Collapse.Panel>
          <Collapse.Panel itemKey="release" header="发布状态" showArrow={false}>
            <p>独立样式入口与公开声明保持稳定。</p>
          </Collapse.Panel>
        </Collapse>
      </section>

      <div className="collapse-scenario__grid">
        <section className="collapse-scenario__section">
          <div className="collapse-scenario__heading">
            <div>
              <strong>手风琴</strong>
              <span>单项 + disabled</span>
            </div>
          </div>
          <Collapse
            accordion
            defaultActiveKey="design"
            motion={false}
            data-parity-target="collapse-accordion"
          >
            <Collapse.Panel itemKey="design" header="设计对齐">
              <p>关键样式与几何逐项相等。</p>
            </Collapse.Panel>
            <Collapse.Panel itemKey="runtime" header="运行时对齐">
              <p>受控状态与事件顺序保持一致。</p>
            </Collapse.Panel>
            <Collapse.Panel itemKey="blocked" header="暂不可用" disabled>
              <p>禁用面板不会响应点击。</p>
            </Collapse.Panel>
          </Collapse>
        </section>

        <section className="collapse-scenario__section">
          <div className="collapse-scenario__heading">
            <div>
              <strong>左侧图标</strong>
              <span>仅图标触发 + 自定义图标</span>
            </div>
          </div>
          <Collapse
            defaultActiveKey="left-1"
            expandIconPosition="left"
            clickHeaderToExpand={false}
            expandIcon={<span className="collapse-scenario__custom-icon">+</span>}
            collapseIcon={<span className="collapse-scenario__custom-icon">−</span>}
            motion={false}
            data-parity-target="collapse-left"
          >
            <Collapse.Panel itemKey="left-1" header="仅点击图标切换" extra="icon only">
              <p>标题文本保持稳定，图标热区负责切换。</p>
            </Collapse.Panel>
            <Collapse.Panel
              itemKey="left-2"
              header={<span className="collapse-scenario__node-header">VNode header</span>}
            >
              <p>节点标题不自动插入 extra 区域。</p>
            </Collapse.Panel>
          </Collapse>
        </section>

        <section className="collapse-scenario__section">
          <div className="collapse-scenario__heading">
            <div>
              <strong>受控面板</strong>
              <span>controlled activeKey</span>
            </div>
          </div>
          <Collapse
            activeKey={controlledKeys}
            motion={false}
            data-parity-target="collapse-controlled"
            onChange={(keys) => setControlledKeys(keyList(keys))}
          >
            <Collapse.Panel itemKey="controlled-1" header="受控状态一">
              <p>父级回传后更新展开状态。</p>
            </Collapse.Panel>
            <Collapse.Panel itemKey="controlled-2" header="受控状态二">
              <p>事件值仍保持 key 数组。</p>
            </Collapse.Panel>
          </Collapse>
        </section>
      </div>

      <output className="collapse-scenario__status" aria-live="polite">
        {status}
      </output>
    </div>
  );
}
