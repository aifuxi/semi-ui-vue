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
    let cancelled = false;
    // 逐帧添加，避免 React 同一批更新覆盖命令式列表的前一项。
    // 独立查询展开全部语义类型与主题，默认验收场景保持原样。
    if (new URLSearchParams(window.location.search).get('messageState') === 'matrix') {
      void (async () => {
        for (const theme of ['normal', 'light'] as const) {
          for (const type of ['info', 'success', 'warning', 'error'] as const) {
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            if (cancelled) return;
            Notification[type]({
              className: 'notification-scenario__matrix',
              content: `${theme} / ${type} 消息内容`,
              direction: direction,
              duration: 0,
              position,
              title: `${theme} / ${type}`,
              theme,
            });
          }
        }
      })();
    }
    return () => {
      cancelled = true;
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
