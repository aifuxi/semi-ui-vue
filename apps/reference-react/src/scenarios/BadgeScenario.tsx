import React, { useState } from 'react';
import Badge from '@semi-v2.102.0/badge';
import Avatar from '@semi-v2.102.0/avatar';
import ConfigProvider from '@semi-v2.102.0/config-provider';

export interface BadgeScenarioProps {
  direction: 'ltr' | 'rtl';
}

export function BadgeScenario({ direction }: BadgeScenarioProps): React.ReactElement {
  const [status, setStatus] = useState('等待操作');
  return (
    <ConfigProvider direction={direction}>
      <div className="badge-scenario" data-testid="badge-reference">
        <section className="badge-scenario__section">
          <span className="badge-scenario__label">基础 / 溢出</span>
          <div className="badge-scenario__row">
            <Badge
              count={5}
              data-parity-target="badge-root"
              onClick={() => setStatus('徽章已点击')}
            >
              <Avatar shape="square" color="blue">
                BM
              </Avatar>
            </Badge>
            <Badge dot data-parity-target="badge-dot">
              <Avatar shape="square" color="light-blue">
                YL
              </Avatar>
            </Badge>
            <Badge count={120} overflowCount={99} data-parity-target="badge-overflow">
              <Avatar shape="square" color="teal">
                ZH
              </Avatar>
            </Badge>
            <Badge count="NEW">
              <Avatar shape="square" color="green">
                WF
              </Avatar>
            </Badge>
          </div>
        </section>

        <section className="badge-scenario__section">
          <span className="badge-scenario__label">主题 / 类型</span>
          <div className="badge-scenario__row badge-scenario__row--surface">
            <Badge count={6} type="primary" theme="solid">
              <Avatar>P</Avatar>
            </Badge>
            <Badge count={6} type="danger" theme="light" data-parity-target="badge-light">
              <Avatar color="red">D</Avatar>
            </Badge>
            <Badge count={6} type="success" theme="inverted">
              <Avatar color="green">S</Avatar>
            </Badge>
            <Badge dot type="warning">
              <Avatar color="orange">W</Avatar>
            </Badge>
          </div>
        </section>

        <section className="badge-scenario__section badge-scenario__section--positions">
          <span className="badge-scenario__label">四角位置</span>
          <div className="badge-scenario__positions">
            {(['leftTop', 'leftBottom', 'rightTop', 'rightBottom'] as const).map((position) => (
              <Badge key={position} count="VIP" position={position} type="danger">
                <Avatar shape="square" color="amber">
                  A
                </Avatar>
              </Badge>
            ))}
          </div>
        </section>

        <section className="badge-scenario__section">
          <span className="badge-scenario__label">自定义 / 独立</span>
          <div className="badge-scenario__row">
            <Badge
              count={<span className="badge-scenario__custom">✓</span>}
              data-parity-target="badge-custom"
            >
              <Avatar shape="square" color="purple">
                V
              </Avatar>
            </Badge>
            <Badge count={8} type="secondary" data-parity-target="badge-standalone" />
            <span className="badge-scenario__standalone-line">
              <Badge dot type="success" />
              成功
            </span>
          </div>
        </section>
        <output className="badge-scenario__status" aria-live="polite">
          {status}
        </output>
      </div>
    </ConfigProvider>
  );
}
