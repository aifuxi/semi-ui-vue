import React, { useEffect } from 'react';
import Toast from '@semi-v2.102.0/toast';

export interface ToastScenarioProps {
  direction?: 'ltr' | 'rtl';
}

export function ToastScenario({ direction = 'ltr' }: ToastScenarioProps): React.ReactElement {
  useEffect(() => {
    Toast.destroyAll();
    Toast.info({
      className: 'toast-scenario__info',
      content: '同步已完成',
      direction,
      duration: 0,
      motion: false,
    });
    const timer = window.setTimeout(() => {
      Toast.warning({
        className: 'toast-scenario__warning',
        content: '访问凭证即将过期',
        direction,
        duration: 0,
        motion: false,
        theme: 'light',
      });
    });
    return () => {
      window.clearTimeout(timer);
      Toast.destroyAll();
    };
  }, [direction]);

  return (
    <div className="toast-scenario" data-testid="toast-reference">
      <p>Toast 渲染在当前 viewport 顶部中央。</p>
    </div>
  );
}
