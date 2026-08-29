import React, { useState } from 'react';
import Progress from '@semi-v2.102.0/progress';

const gradientStroke = [
  { percent: 50, color: '#fff' },
  { percent: 52, color: 'rgba(0, 0, 0, 0)' },
];

export function ProgressScenario(): React.ReactElement {
  const [motionPercent, setMotionPercent] = useState(50);
  return (
    <div className="progress-scenario" data-testid="progress-reference">
      <button
        className="progress-scenario__motion-control"
        onClick={() => setMotionPercent(80)}
        type="button"
      >
        Animate
      </button>
      <div className="progress-scenario__line-stack">
        <Progress
          aria-label="Default progress"
          data-parity-target="progress-line-default"
          percent={motionPercent}
          showInfo
          style={{ width: '100%' }}
        />
        <Progress
          aria-label="Large progress"
          data-parity-target="progress-line-info"
          motion={false}
          orbitStroke="var(--semi-color-warning-light-default)"
          percent={80}
          showInfo
          size="large"
          stroke="var(--semi-color-warning)"
          style={{ width: '100%' }}
        />
      </div>
      <div className="progress-scenario__vertical">
        <Progress
          aria-label="Vertical progress"
          data-parity-target="progress-vertical"
          direction="vertical"
          motion={false}
          percent={65}
          showInfo
          size="large"
        />
      </div>
      <div className="progress-scenario__circles">
        <Progress
          aria-label="Circular progress"
          data-parity-target="progress-circle-default"
          motion={false}
          percent={65}
          showInfo
          type="circle"
        />
        <Progress
          aria-label="Gradient progress"
          data-parity-target="progress-circle-gradient"
          format={(percent) => `${percent}‰`}
          motion={false}
          percent={51}
          showInfo
          stroke={gradientStroke}
          strokeGradient
          strokeLinecap="square"
          strokeWidth={8}
          type="circle"
          width={96}
        />
        <Progress
          aria-label="Small progress"
          data-parity-target="progress-circle-small"
          motion={false}
          percent={30}
          showInfo
          size="small"
          type="circle"
        />
      </div>
    </div>
  );
}
