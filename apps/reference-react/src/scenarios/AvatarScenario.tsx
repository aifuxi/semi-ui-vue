import React, { useState } from 'react';
import Avatar from '@semi-v2.102.0/avatar';
import AvatarGroup from '@semi-v2.102.0/avatar-group';

const avatarImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"%3E%3Crect width="96" height="96" rx="48" fill="%236B5CE7"/%3E%3Ccircle cx="48" cy="37" r="17" fill="white"/%3E%3Cpath d="M18 88c3-20 14-30 30-30s27 10 30 30" fill="white"/%3E%3C/svg%3E';

export function AvatarScenario(): React.ReactElement {
  const [status, setStatus] = useState('等待操作');
  const hoverMask = <span className="avatar-scenario__mask">编辑</span>;
  return (
    <div className="avatar-scenario" data-testid="avatar-reference">
      <section className="avatar-scenario__section avatar-scenario__section--wide">
        <span className="avatar-scenario__label">尺寸</span>
        <div className="avatar-scenario__row avatar-scenario__row--baseline">
          <Avatar size="extra-extra-small" alt="User">
            U
          </Avatar>
          <Avatar size="extra-small" alt="User">
            U
          </Avatar>
          <Avatar size="small" alt="User">
            U
          </Avatar>
          <Avatar size="default" alt="User">
            U
          </Avatar>
          <Avatar data-parity-target="avatar-default" alt="User">
            U
          </Avatar>
          <Avatar size="large" alt="User">
            U
          </Avatar>
          <Avatar size="extra-large" alt="User">
            U
          </Avatar>
        </div>
      </section>
      <section className="avatar-scenario__section">
        <span className="avatar-scenario__label">颜色 / 形状 / 图片</span>
        <div className="avatar-scenario__row">
          <Avatar color="red" alt="Red">
            R
          </Avatar>
          <Avatar color="light-blue" alt="Blue">
            B
          </Avatar>
          <Avatar data-parity-target="avatar-square" shape="square" color="amber" alt="Square">
            S
          </Avatar>
          <Avatar data-parity-target="avatar-image" src={avatarImage} alt="Profile" />
          <Avatar
            data-parity-target="avatar-hover"
            hoverMask={hoverMask}
            color="purple"
            alt="Hover"
            onClick={() => setStatus('头像已点击')}
          >
            H
          </Avatar>
        </div>
      </section>
      <section className="avatar-scenario__section">
        <span className="avatar-scenario__label">头像组</span>
        <div data-parity-target="avatar-group">
          <AvatarGroup maxCount={3}>
            <Avatar color="red" alt="Alice">
              A
            </Avatar>
            <Avatar color="orange" alt="Bob">
              B
            </Avatar>
            <Avatar color="green" alt="Carol">
              C
            </Avatar>
            <Avatar color="blue" alt="David">
              D
            </Avatar>
            <Avatar color="purple" alt="Eve">
              E
            </Avatar>
          </AvatarGroup>
        </div>
      </section>
      <section className="avatar-scenario__section">
        <span className="avatar-scenario__label">顶部 / 底部 / 边框</span>
        <div className="avatar-scenario__row avatar-scenario__row--decorated">
          <Avatar
            data-parity-target="avatar-decoration"
            size="large"
            color="amber"
            border={{ color: '#fe2c55' }}
            topSlot={{ text: '直播', gradientStart: '#ff1764', gradientEnd: '#ed3494' }}
            bottomSlot={{ shape: 'circle', bgColor: '#fe2c55', text: '+' }}
            alt="Live"
          >
            T
          </Avatar>
          <Avatar
            size="large"
            color="cyan"
            bottomSlot={{ shape: 'square', bgColor: '#0095ee', text: '在线' }}
            alt="Online"
          >
            O
          </Avatar>
        </div>
      </section>
      <output className="avatar-scenario__status" aria-live="polite">
        {status}
      </output>
    </div>
  );
}
