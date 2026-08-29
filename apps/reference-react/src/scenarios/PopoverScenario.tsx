import React, { useRef } from 'react';
import Button from '@semi-v2.102.0/button';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import Popover from '@semi-v2.102.0/popover';

import type { ParityDirection } from '@workspace/test-infra';

function PopoverCard({ detail, title }: { detail: string; title: string }): React.ReactElement {
  return (
    <div className="popover-scenario__card">
      <strong>{title}</strong>
      <span>{detail}</span>
    </div>
  );
}

export function PopoverScenario({ direction }: { direction: ParityDirection }): React.ReactElement {
  const host = useRef<HTMLDivElement>(null);
  const getPopupContainer = () => host.current ?? document.body;

  return (
    <ConfigProvider direction={direction}>
      <div ref={host} className="popover-scenario" data-testid="popover-reference">
        <div className="popover-scenario__triggers">
          <div className="popover-scenario__scroll-host" data-testid="popover-scroll-host">
            <div className="popover-scenario__scroll-content">
              <Popover
                className="popover-target-bottom"
                content={<PopoverCard title="Bottom card" detail="Complex content" />}
                getPopupContainer={getPopupContainer}
                motion={false}
                position="bottom"
                trigger="custom"
                visible
              >
                <Button data-parity-target="popover-trigger-bottom">Bottom</Button>
              </Popover>
            </div>
          </div>
          <Popover
            arrowStyle={{ backgroundColor: 'rgb(0, 100, 250)', borderColor: 'rgb(0, 100, 250)' }}
            className="popover-target-right"
            content={<PopoverCard title="Right card" detail="Arrow and custom color" />}
            getPopupContainer={getPopupContainer}
            motion={false}
            position="right"
            showArrow
            style={{ backgroundColor: 'rgb(0, 100, 250)', color: 'rgb(255, 255, 255)' }}
            trigger="custom"
            visible
          >
            <Button data-parity-target="popover-trigger-right">Right</Button>
          </Popover>
          <Popover
            className="popover-target-click"
            content={
              <div className="popover-scenario__card">
                <strong>Click card</strong>
                <span>Escape and focus guard</span>
                <button className="popover-scenario__inside-action">Action</button>
              </div>
            }
            getPopupContainer={getPopupContainer}
            motion={false}
            trigger="click"
          >
            <Button data-parity-target="popover-trigger-click">Click</Button>
          </Popover>
          <Popover
            className="popover-target-hover"
            content={<PopoverCard title="Hover card" detail="Tooltip role" />}
            getPopupContainer={getPopupContainer}
            motion={false}
          >
            <Button data-parity-target="popover-trigger-hover">Hover</Button>
          </Popover>
        </div>
      </div>
    </ConfigProvider>
  );
}
