import React, { useRef, useState } from 'react';
import Button from '@semi-v2.102.0/button';
import Tooltip, { type TooltipPosition } from '@semi-v2.102.0/tooltip';

const placements: Array<{ position: TooltipPosition; label: string }> = [
  { position: 'top', label: 'Top' },
  { position: 'right', label: 'Right' },
  { position: 'bottom', label: 'Bottom' },
  { position: 'left', label: 'Left' },
];

export function TooltipScenario(): React.ReactElement {
  const host = useRef<HTMLDivElement>(null);
  const [clickVisible, setClickVisible] = useState(false);
  const [lastChange, setLastChange] = useState('none');
  const getPopupContainer = (): HTMLElement => host.current ?? document.body;

  return (
    <div ref={host} className="tooltip-scenario" data-testid="tooltip-reference">
      <section className="tooltip-scenario__section" aria-label="固定方位">
        <h3>固定方位</h3>
        <div className="tooltip-scenario__placements">
          {placements.map(({ position, label }) => (
            <Tooltip
              key={position}
              className={`tooltip-target-${position}`}
              content={`${label} 提示`}
              getPopupContainer={getPopupContainer}
              motion={false}
              position={position}
              trigger="custom"
              visible
              wrapperId={`tooltip-${position}`}
            >
              <Button data-parity-target={`tooltip-trigger-${position}`}>{label}</Button>
            </Tooltip>
          ))}
        </div>
      </section>

      <section className="tooltip-scenario__section" aria-label="触发行为">
        <h3>触发行为</h3>
        <div className="tooltip-scenario__actions">
          <Tooltip
            content="Hover 提示"
            getPopupContainer={getPopupContainer}
            motion={false}
            wrapperId="tooltip-hover"
            onVisibleChange={(visible) => setLastChange(`hover:${String(visible)}`)}
          >
            <Button data-parity-target="tooltip-trigger-hover">Hover</Button>
          </Tooltip>
          <Tooltip
            visible={clickVisible}
            content="Click 提示"
            getPopupContainer={getPopupContainer}
            motion={false}
            trigger="click"
            wrapperId="tooltip-click"
            onVisibleChange={(visible) => {
              setClickVisible(visible);
              setLastChange(`click:${String(visible)}`);
            }}
          >
            <Button data-parity-target="tooltip-trigger-click">Click</Button>
          </Tooltip>
          <Tooltip
            content="禁用按钮提示"
            getPopupContainer={getPopupContainer}
            motion={false}
            wrapperClassName="tooltip-disabled-wrapper"
            wrapperId="tooltip-disabled"
          >
            <Button disabled data-parity-target="tooltip-trigger-disabled">
              Disabled
            </Button>
          </Tooltip>
        </div>
      </section>

      <output className="tooltip-scenario__status" aria-live="polite">
        {`最近变化：${lastChange}`}
      </output>
    </div>
  );
}
