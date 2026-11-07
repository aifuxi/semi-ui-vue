import React, { useState } from 'react';
import Progress from '@semi-v2.102.0/progress';

const gradientStroke = [
  { percent: 50, color: '#fff' },
  { percent: 52, color: 'rgba(0, 0, 0, 0)' },
];

/** 专项 query 使用相同公开 props 覆盖三档尺寸及零/满边界。 */
export function ProgressScenario(): React.ReactElement {
  /** React/Vue 使用相同参数语义，不修改渲染后的组件样式。 */
  const query = new URLSearchParams(window.location.search);
  /** 固定 Semi 的三档尺寸。 */
  const size = (
    ['small', 'default', 'large'].includes(query.get('reviewSize') ?? '')
      ? query.get('reviewSize')
      : undefined
  ) as 'small' | 'default' | 'large' | undefined;
  /** 仅补充 0/100 的空值与完成边界。 */
  const percent =
    query.get('reviewPercent') === '0' ? 0 : query.get('reviewPercent') === '100' ? 100 : undefined;
  /** 原有公开交互继续覆盖动画后的状态。 */
  const [motionPercent, setMotionPercent] = useState(50);
  return (
    <div className="progress-scenario" data-testid="progress-reference">
      <button
        className="progress-scenario__motion-control"
        // 使用真实进度动画切换到 80%。
        onClick={() => setMotionPercent(80)}
        type="button"
      >
        Animate
      </button>
      <div className="progress-scenario__line-stack">
        <Progress
          aria-label="Default progress"
          data-parity-target="progress-line-default"
          percent={percent ?? motionPercent}
          size={size ?? 'default'}
          showInfo
          style={{ width: '100%' }}
        />
        <Progress
          aria-label="Large progress"
          data-parity-target="progress-line-info"
          motion={false}
          orbitStroke="var(--semi-color-warning-light-default)"
          percent={percent ?? 80}
          showInfo
          size={size ?? 'large'}
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
          percent={percent ?? 65}
          showInfo
          size={size ?? 'large'}
        />
      </div>
      <div className="progress-scenario__circles">
        <Progress
          aria-label="Circular progress"
          data-parity-target="progress-circle-default"
          motion={false}
          percent={percent ?? 65}
          size={size ?? 'default'}
          showInfo
          type="circle"
        />
        <Progress
          aria-label="Gradient progress"
          data-parity-target="progress-circle-gradient"
          // 自定义文本继续验证字号和单位对齐。
          format={(percent) => `${percent}‰`}
          motion={false}
          percent={percent ?? 51}
          size={size ?? 'default'}
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
          percent={percent ?? 30}
          showInfo
          size={size ?? 'small'}
          type="circle"
        />
      </div>
    </div>
  );
}
