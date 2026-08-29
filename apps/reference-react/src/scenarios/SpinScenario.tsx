import React from 'react';
import Spin from '@semi-v2.102.0/spin';

function CustomIndicator(): React.ReactElement {
  return <span className="spin-scenario__custom-indicator">↻</span>;
}

export function SpinScenario(): React.ReactElement {
  return (
    <div className="spin-scenario" data-testid="spin-reference">
      <div className="spin-scenario__sizes">
        <Spin size="small" data-parity-target="spin-small" />
        <Spin data-parity-target="spin-middle" />
        <Spin size="large" data-parity-target="spin-large" />
        <Spin
          indicator={<CustomIndicator />}
          data-parity-target="spin-custom"
          wrapperClassName="spin-scenario__custom"
        />
      </div>

      <Spin
        data-parity-target="spin-block"
        tip={<span className="spin-scenario__tip">Loading profile</span>}
      >
        <article className="spin-scenario__content">
          <strong>Profile</strong>
          <span>Content is being refreshed.</span>
        </article>
      </Spin>

      <Spin spinning={false} data-parity-target="spin-hidden">
        <p className="spin-scenario__ready">Content ready</p>
      </Spin>
    </div>
  );
}
