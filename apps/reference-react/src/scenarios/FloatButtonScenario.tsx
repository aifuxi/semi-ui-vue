import React, { useState } from 'react';
import FloatButton from '@semi-v2.102.0/float-button';
import FloatButtonGroup from '@semi-v2.102.0/float-button-group';
import { IconBell, IconCustomerSupport, IconHelpCircle, IconPlus } from '@semi-v2.102.0/icons';

const inlineStyle: React.CSSProperties = {
  position: 'relative',
  right: 'auto',
  bottom: 'auto',
};

export function FloatButtonScenario(): React.ReactElement {
  const [lastAction, setLastAction] = useState('暂无');
  const groupItems = [
    { content: '客服', icon: <IconCustomerSupport />, value: 'support' },
    { badge: { count: 6 }, content: '消息', icon: <IconBell />, value: 'message' },
    { content: '帮助', icon: <IconHelpCircle />, value: 'help' },
  ];

  return (
    <div className="float-button-scenario" data-testid="float-button-reference">
      <section className="float-button-scenario__section" aria-label="尺寸、形状与状态">
        <h3>尺寸、形状与状态</h3>
        <div className="float-button-scenario__row">
          {(['small', 'default', 'large'] as const).map((size) => (
            <FloatButton
              className={`float-button-target-${size}`}
              icon={<IconPlus />}
              key={size}
              size={size}
              style={inlineStyle}
              onClick={() => setLastAction(size)}
            />
          ))}
          <FloatButton
            className="float-button-target-square"
            icon={<IconPlus />}
            shape="square"
            style={inlineStyle}
          />
          <FloatButton
            colorful
            className="float-button-target-colorful"
            icon={<IconPlus />}
            style={inlineStyle}
          />
          <FloatButton
            className="float-button-target-disabled"
            disabled
            icon={<IconPlus />}
            style={inlineStyle}
            onClick={() => setLastAction('disabled')}
          />
          <FloatButton
            badge={{ count: 120, overflowCount: 99 }}
            className="float-button-target-badge"
            icon={<IconBell />}
            style={inlineStyle}
          />
        </div>
      </section>

      <section className="float-button-scenario__section" aria-label="悬浮按钮组">
        <h3>悬浮按钮组</h3>
        <FloatButtonGroup
          className="float-button-target-group"
          items={groupItems}
          style={inlineStyle}
          onClick={(value) => setLastAction(value)}
        />
      </section>

      <output className="scenario-action-output" aria-live="polite">
        最近操作：{lastAction}
      </output>
    </div>
  );
}
