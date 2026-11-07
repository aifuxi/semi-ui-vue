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
      stack: new URLSearchParams(window.location.search).get('toastStack') === 'true',
    });
    const timer = window.setTimeout(() => {
      Toast.warning({
        className: 'toast-scenario__warning',
        content: '访问凭证即将过期',
        direction,
        duration: 0,
        motion: false,
        stack: new URLSearchParams(window.location.search).get('toastStack') === 'true',
        theme: 'light',
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
            Toast[type]({
              className: 'toast-scenario__matrix',
              content: `${theme} / ${type} 消息内容`,
              direction: direction,
              duration: 0,
              motion: false,
              stack: new URLSearchParams(window.location.search).get('toastStack') === 'true',
              theme,
            });
          }
        }
      })();
    }
    return () => {
      cancelled = true;
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
