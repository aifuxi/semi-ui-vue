import React from 'react';
import Highlight from '@semi-v2.102.0/highlight';

export function HighlightScenario(): React.ReactElement {
  return (
    <div className="highlight-scenario" data-testid="highlight-reference">
      <section className="highlight-scenario__item">
        <span className="highlight-scenario__label">基础与默认主题</span>
        <p className="highlight-scenario__text" data-parity-target="highlight-basic">
          <Highlight
            sourceString="从 Semi Design 到 Any Design，快速定义你的设计系统"
            searchWords={['Semi Design', '设计系统']}
          />
        </p>
      </section>

      <section className="highlight-scenario__item">
        <span className="highlight-scenario__label">统一 class 与 style</span>
        <p className="highlight-scenario__text" data-parity-target="highlight-custom">
          <Highlight
            component="span"
            sourceString="Semi connects design and code"
            searchWords={['Semi', 'design', 'code']}
            highlightClassName="highlight-scenario__custom"
            highlightStyle={{
              backgroundColor: 'rgba(var(--semi-teal-5), 1)',
              borderRadius: 4,
              color: 'rgba(var(--semi-white), 1)',
              padding: '3px 5px',
            }}
          />
        </p>
      </section>

      <section className="highlight-scenario__item">
        <span className="highlight-scenario__label">大小写与正则</span>
        <p className="highlight-scenario__text" data-parity-target="highlight-regex">
          <Highlight
            sourceString="Semi semi · Design   System"
            searchWords={['semi', 'Design\\s+System']}
            caseSensitive
            autoEscape={false}
          />
        </p>
      </section>

      <section className="highlight-scenario__item">
        <span className="highlight-scenario__label">重叠词与自定义标签</span>
        <p className="highlight-scenario__text" data-parity-target="highlight-overlap">
          <Highlight
            component="strong"
            sourceString="design system for design teams"
            searchWords={['design', 'design system', 'system']}
            highlightClassName="highlight-scenario__strong"
          />
        </p>
      </section>
    </div>
  );
}
