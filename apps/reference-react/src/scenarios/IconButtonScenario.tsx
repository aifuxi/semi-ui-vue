import React, { useState } from 'react';
import IconButton from '@semi-v2.102.0/icon-button';

interface ScenarioIconProps {
  fill?: string | string[];
  kind: 'star' | 'arrow' | 'delete';
}

function ScenarioIcon({ fill, kind }: ScenarioIconProps): React.ReactElement {
  const path =
    kind === 'star'
      ? 'M8 2.2l1.75 3.55 3.92.57-2.84 2.77.67 3.91L8 11.15 4.5 13l.67-3.91L2.33 6.32l3.92-.57L8 2.2z'
      : kind === 'arrow'
        ? 'M3 8h10M9 4l4 4-4 4'
        : 'M4 5h8M6 5V3h4v2m-5 0 .6 8h4.8l.6-8';
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      data-icon={kind}
      fill={Array.isArray(fill) ? fill.join(',') : fill}
    >
      <path
        d={path}
        fill={kind === 'star' ? 'currentColor' : 'none'}
        stroke={kind === 'star' ? 'none' : 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconButtonScenario(): React.ReactElement {
  const [lastAction, setLastAction] = useState('尚未触发');

  return (
    <div className="icon-button-scenario" data-testid="icon-button-reference">
      <div className="icon-button-scenario__row">
        <IconButton
          icon={<ScenarioIcon kind="star" />}
          aria-label="收藏"
          data-parity-target="icon-button-default"
          onClick={() => setLastAction('收藏')}
        />
        <IconButton
          icon={<ScenarioIcon kind="arrow" />}
          iconPosition="right"
          noHorizontalPadding="left"
          data-parity-target="icon-button-text"
        >
          展开选项
        </IconButton>
        <IconButton
          icon={<ScenarioIcon kind="delete" />}
          size="small"
          theme="solid"
          type="secondary"
          aria-label="删除"
          data-parity-target="icon-button-small"
        />
        <IconButton
          icon={<ScenarioIcon kind="delete" />}
          disabled
          aria-label="不可删除"
          data-parity-target="icon-button-disabled"
          onClick={() => setLastAction('不可删除')}
        />
      </div>

      <div className="icon-button-scenario__row">
        <IconButton loading aria-label="正在保存" data-parity-target="icon-button-loading" />
        <IconButton
          loading
          theme="solid"
          type="tertiary"
          aria-label="AI 加载"
          data-parity-target="icon-button-ai-loading"
        />
        <IconButton
          colorful
          icon={<ScenarioIcon kind="star" />}
          theme="light"
          type="primary"
          aria-label="多彩收藏"
          data-parity-target="icon-button-colorful"
        />
      </div>

      <output className="scenario-action-output" aria-live="polite">
        最近操作：{lastAction}
      </output>
    </div>
  );
}
