import React, { useEffect, useRef, useState } from 'react';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import UserGuide, { type UserGuideStepItem } from '@semi-v2.102.0/user-guide';

export interface UserGuideScenarioProps {
  direction: 'ltr' | 'rtl';
}

const COVER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" y1="0" x2="1" y2="1"%3E%3Cstop stop-color="%234f7cff"/%3E%3Cstop offset="1" stop-color="%237d5cff"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="200" rx="8" fill="url(%23g)"/%3E%3Ccircle cx="315" cy="40" r="72" fill="white" fill-opacity=".14"/%3E%3Cpath d="M58 130h140M58 98h210M58 66h170" stroke="white" stroke-width="14" stroke-linecap="round"/%3E%3C/svg%3E';

export function UserGuideScenario({ direction }: UserGuideScenarioProps): React.ReactElement {
  const firstRef = useRef<HTMLButtonElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const thirdRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'popup' | 'modal'>('popup');
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState('步骤 1');

  useEffect(() => {
    setReady(true);
    setVisible(true);
  }, []);

  const steps: UserGuideStepItem[] = [
    {
      target: () => firstRef.current,
      cover: <img src={COVER} alt="引导封面" />,
      title: '发现协作入口',
      description: '从这里开始创建一条新的协作任务。',
      position: direction === 'rtl' ? 'left' : 'right',
    },
    {
      target: () => secondRef.current,
      title: '查看任务进度',
      description: '状态会在处理过程中持续更新。',
      spotlightPadding: 8,
      theme: 'primary',
      position: 'bottom',
    },
    {
      target: () => thirdRef.current,
      title: '完成设置',
      description: '你随时可以重新打开这份引导。',
      showArrow: false,
      position: 'top',
    },
  ];

  function open(nextMode: 'popup' | 'modal'): void {
    setVisible(false);
    setMode(nextMode);
    setCurrent(0);
    requestAnimationFrame(() => setVisible(true));
  }

  return (
    <ConfigProvider direction={direction}>
      <div className="user-guide-scenario">
        <div className="user-guide-scenario__actions">
          <button type="button" data-action="open-user-guide-popup" onClick={() => open('popup')}>
            气泡引导
          </button>
          <button type="button" data-action="open-user-guide-modal" onClick={() => open('modal')}>
            弹窗引导
          </button>
          <span role="status">{status}</span>
        </div>
        <div className="user-guide-scenario__stage" data-testid="user-guide-reference">
          <button
            ref={firstRef}
            type="button"
            className="user-guide-scenario__target user-guide-scenario__target--primary"
          >
            创建协作
          </button>
          <div
            ref={secondRef}
            className="user-guide-scenario__target user-guide-scenario__target--status"
          >
            处理中 · 68%
          </div>
          <div
            ref={thirdRef}
            className="user-guide-scenario__target user-guide-scenario__target--summary"
          >
            今日完成 12 项
          </div>
          {ready ? (
            <UserGuide
              visible={visible}
              mode={mode}
              current={current}
              mask
              steps={steps}
              onChange={(nextCurrent) => {
                setCurrent(nextCurrent);
                setStatus(`步骤 ${nextCurrent + 1}`);
              }}
              onFinish={() => {
                setStatus('已完成');
                setVisible(false);
              }}
              onSkip={() => {
                setStatus('已跳过');
                setVisible(false);
              }}
            />
          ) : null}
        </div>
      </div>
    </ConfigProvider>
  );
}
