import React, { useState } from 'react';
import Anchor from '@semi-v2.102.0/anchor';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import type { ParityDirection } from '@workspace/test-infra';

export function AnchorScenario({ direction }: { direction: ParityDirection }): React.ReactElement {
  const [status, setStatus] = useState('等待操作');
  const getContainer = () =>
    document.querySelector<HTMLElement>('.anchor-scenario__content') ?? window;

  return (
    <ConfigProvider direction={direction}>
      <div className="anchor-scenario" data-testid="anchor-reference">
        <div className="anchor-scenario__canvas">
          <div className="anchor-scenario__content" tabIndex={0} aria-label="锚点滚动内容">
            <section id="anchor-overview">
              <h3>概览</h3>
              <p>Anchor 用于长页面中的章节导航。</p>
            </section>
            <section id="anchor-usage">
              <h3>用法</h3>
              <p>点击链接会滚动到对应的内容区块。</p>
            </section>
            <section id="anchor-api">
              <h3>API</h3>
              <p>滚动容器、偏移量和滑轨均保持固定契约。</p>
            </section>
            <section id="anchor-disabled">
              <h3>禁用</h3>
              <p>禁用链接保留语义，但不会触发跳转。</p>
            </section>
          </div>

          <div className="anchor-scenario__navigation">
            <Anchor
              aria-label="章节导航"
              data-parity-target="anchor-default"
              getContainer={getContainer}
              maxHeight={240}
              maxWidth={220}
              onChange={(current, previous) => setStatus(`变化：${previous || '无'} → ${current}`)}
              onClick={(_event, current) => setStatus(`点击：${current}`)}
            >
              <Anchor.Link
                className="anchor-target-overview"
                href="#anchor-overview"
                title="概览"
              />
              <Anchor.Link className="anchor-target-usage" href="#anchor-usage" title="用法">
                <Anchor.Link className="anchor-target-api" href="#anchor-api" title="API 参考" />
              </Anchor.Link>
              <Anchor.Link
                className="anchor-target-disabled"
                disabled
                href="#anchor-disabled"
                title="禁用链接"
              />
            </Anchor>

            <Anchor
              aria-label="小尺寸导航"
              className="anchor-target-small"
              railTheme="tertiary"
              size="small"
            >
              <Anchor.Link href="#anchor-overview" title="小尺寸" />
              <Anchor.Link href="#anchor-api" title="三级滑轨" />
            </Anchor>
          </div>
        </div>
        <output className="anchor-scenario__status" aria-live="polite">
          {status}
        </output>
      </div>
    </ConfigProvider>
  );
}
