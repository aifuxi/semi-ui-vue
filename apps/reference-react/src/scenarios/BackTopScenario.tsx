import React, { useRef, useState } from 'react';
import BackTop from '@semi-v2.102.0/back-top';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import type { ParityDirection } from '@workspace/test-infra';

export function BackTopScenario({ direction }: { direction: ParityDirection }): React.ReactElement {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('等待操作');
  const getTarget = () => scrollTarget.current;

  return (
    <ConfigProvider direction={direction}>
      <div className="back-top-scenario" data-testid="back-top-reference">
        <div
          ref={scrollTarget}
          className="back-top-scenario__scroll"
          tabIndex={0}
          aria-label="BackTop 滚动容器"
        >
          <div className="back-top-scenario__content">
            <strong>向下滚动查看默认回顶按钮</strong>
            <span>Element target / visibilityHeight 80</span>
          </div>
        </div>

        <BackTop
          data-parity-target="back-top-default"
          duration={1}
          target={getTarget}
          visibilityHeight={80}
          onClick={() => setStatus('点击：默认回顶')}
        />
        <BackTop
          className="back-top-target-custom"
          data-parity-target="back-top-custom"
          duration={1}
          style={{ bottom: 118, right: 100 }}
          target={getTarget}
          visibilityHeight={-1}
          onClick={() => setStatus('点击：自定义回顶')}
        >
          <span className="back-top-scenario__custom">TOP</span>
        </BackTop>

        <output className="back-top-scenario__status" aria-live="polite">
          {status}
        </output>
      </div>
    </ConfigProvider>
  );
}
