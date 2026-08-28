import React, { useState } from 'react';
import Collapsible from '@semi-v2.102.0/collapsible';

export function CollapsibleScenario(): React.ReactElement {
  const [basicOpen, setBasicOpen] = useState(true);
  const [lazyOpen, setLazyOpen] = useState(false);
  const [adaptiveRows, setAdaptiveRows] = useState(2);
  const [status, setStatus] = useState('基础面板：展开');

  const toggleBasic = () => {
    setBasicOpen((open) => {
      setStatus(`基础面板：${open ? '收起' : '展开'}`);
      return !open;
    });
  };

  return (
    <div className="collapsible-scenario" data-testid="collapsible-reference">
      <section className="collapsible-scenario__section collapsible-scenario__section--wide">
        <div className="collapsible-scenario__heading">
          <div>
            <strong>产品交付说明</strong>
            <span>默认动效与 fade</span>
          </div>
          <button type="button" data-action="toggle-basic" onClick={toggleBasic}>
            {basicOpen ? '收起' : '展开'}
          </button>
        </div>
        <Collapsible
          id="collapsible-basic-content"
          isOpen={basicOpen}
          fade
          data-parity-target="collapsible-basic"
          onMotionEnd={() => setStatus('基础面板：动效结束')}
        >
          <div className="collapsible-scenario__content collapsible-scenario__content--hero">
            <strong>从设计到交付</strong>
            <p>统一结构、行为与视觉证据，让每次展开都保持确定。</p>
            <span>v2.102.0 fixed source</span>
          </div>
        </Collapsible>
      </section>

      <div className="collapsible-scenario__grid">
        <section className="collapsible-scenario__section">
          <div className="collapsible-scenario__heading">
            <div>
              <strong>保留摘要</strong>
              <span>collapseHeight 72</span>
            </div>
          </div>
          <Collapsible collapseHeight={72} data-parity-target="collapsible-preview">
            <div className="collapsible-scenario__content">
              <p>第一行保留在折叠窗口内。</p>
              <p>第二行展示被裁剪的内容。</p>
              <p>第三行仍保留在 DOM 中。</p>
            </div>
          </Collapsible>
        </section>

        <section className="collapsible-scenario__section">
          <div className="collapsible-scenario__heading">
            <div>
              <strong>自适应高度</strong>
              <span>动态重测 {adaptiveRows}</span>
            </div>
            <button
              type="button"
              data-action="add-row"
              onClick={() => setAdaptiveRows((rows) => rows + 1)}
            >
              增加
            </button>
          </div>
          <Collapsible
            collapseHeight={140}
            collapseHeightAdaptive
            reCalcKey={adaptiveRows}
            data-parity-target="collapsible-adaptive"
          >
            <div className="collapsible-scenario__content collapsible-scenario__content--compact">
              {Array.from({ length: adaptiveRows }, (_, index) => (
                <p key={index}>动态内容 {index + 1}</p>
              ))}
            </div>
          </Collapsible>
        </section>

        <section className="collapsible-scenario__section">
          <div className="collapsible-scenario__heading">
            <div>
              <strong>懒渲染保留</strong>
              <span>keepDOM + lazyRender</span>
            </div>
            <button
              type="button"
              data-action="toggle-lazy"
              onClick={() => setLazyOpen((open) => !open)}
            >
              {lazyOpen ? '关闭' : '首次打开'}
            </button>
          </div>
          <Collapsible
            isOpen={lazyOpen}
            keepDOM
            lazyRender
            motion={false}
            data-parity-target="collapsible-lazy"
          >
            <div className="collapsible-scenario__content">
              <p data-lazy-content>已创建并保留的内容</p>
            </div>
          </Collapsible>
        </section>
      </div>

      <output className="collapsible-scenario__status" aria-live="polite">
        {status}
      </output>
    </div>
  );
}
