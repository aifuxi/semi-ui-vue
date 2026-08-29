import React, { useEffect } from 'react';
import Notification from '@semi-v2.102.0/notification';

export interface NotificationScenarioProps {
  direction?: 'ltr' | 'rtl';
}

export function NotificationScenario({
  direction = 'ltr',
}: NotificationScenarioProps): React.ReactElement {
  useEffect(() => {
    Notification.destroyAll();
    const position = direction === 'rtl' ? 'topLeft' : 'topRight';
    Notification.info({
      className: 'notification-scenario__info',
      content: '400 个任务成功，600 个任务失败。',
      direction,
      duration: 0,
      position,
      title: '任务已完成',
    });
    const timer = window.setTimeout(() => {
      Notification.warning({
        className: 'notification-scenario__warning',
        content: '请在四天内更新访问凭证。',
        direction,
        duration: 0,
        position,
        theme: 'light',
        title: '配置即将过期',
      });
    });
    return () => {
      window.clearTimeout(timer);
      Notification.destroyAll();
    };
  }, [direction]);

  return (
    <div className="notification-scenario" data-testid="notification-reference">
      <p>通知卡片渲染在当前 viewport 的固定位置。</p>
    </div>
  );
}
