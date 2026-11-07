import React, { useState } from 'react';
import Steps from '@semi-v2.102.0/steps';

const Step = Steps.Step;

export function StepsScenario(): React.ReactElement {
  const [status, setStatus] = useState('等待操作');
  // 查询仅扩展视觉复核尺寸，保留默认场景原有大小。
  const small = new URLSearchParams(window.location.search).get('stepsSize') === 'small';
  return (
    <div className="steps-scenario" data-testid="steps-reference">
      <div className="steps-scenario__section">
        <span className="steps-scenario__label">Fill</span>
        <Steps
          size={small ? 'small' : 'default'}
          aria-label="Fill progress"
          current={1}
          data-parity-target="steps-fill"
          onChange={(index) => setStatus(`Fill：${index}`)}
        >
          <Step title="Finished" description="This is a description" />
          <Step title="In Progress" description="This is a description" />
          <Step title="Waiting" description="This is a description" />
        </Steps>
      </div>
      <div className="steps-scenario__section">
        <span className="steps-scenario__label">Basic small</span>
        <Steps
          current={1}
          data-parity-target="steps-basic"
          onChange={(index) => setStatus(`Basic：${index}`)}
          size="small"
          type="basic"
        >
          <Step title="Finished" description="This is a description" />
          <Step title="In Progress" description="This is a description" />
          <Step status="warning" title="Waiting" description="This is a description" />
        </Steps>
      </div>
      <div className="steps-scenario__section steps-scenario__vertical">
        <span className="steps-scenario__label">Basic vertical error</span>
        <Steps
          current={1}
          data-parity-target="steps-vertical"
          size={small ? 'small' : 'default'}
          direction="vertical"
          status="error"
          style={{ width: 300 }}
          type="basic"
        >
          <Step title="Finished" description="This is a description" />
          <Step title="Error" description="This is a description" />
          <Step title="Waiting" description="This is a description" />
        </Steps>
      </div>
      <div className="steps-scenario__section">
        <span className="steps-scenario__label">Nav</span>
        <Steps
          current={1}
          data-parity-target="steps-nav"
          size={small ? 'small' : 'default'}
          onChange={(index) => setStatus(`Nav：${index}`)}
          type="nav"
        >
          <Step title="Register account" />
          <Step title="Product usage" />
          <Step title="Try features" />
        </Steps>
      </div>
      <output className="steps-scenario__status" aria-live="polite">
        {status}
      </output>
    </div>
  );
}
