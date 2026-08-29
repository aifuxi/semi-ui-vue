import React, { useState } from 'react';
import Banner from '@semi-v2.102.0/banner';

const notices = [
  { type: 'info' as const, description: '新版本已经可用。' },
  { type: 'warning' as const, description: '当前配置将在四天后过期。' },
  { type: 'danger' as const, description: '当前接口已经停用，请尽快升级。' },
  { type: 'success' as const, description: '所有发布检查均已通过。' },
];

export function BannerScenario(): React.ReactElement {
  const [lastAction, setLastAction] = useState('暂无操作');

  return (
    <div className="banner-scenario" data-testid="banner-reference">
      <section className="banner-scenario__types" aria-label="通知类型">
        {notices.map((notice) => (
          <Banner
            key={notice.type}
            data-parity-target={`banner-${notice.type}`}
            type={notice.type}
            description={notice.description}
            onClose={() => setLastAction(`关闭 ${notice.type}`)}
          />
        ))}
      </section>
      <Banner
        data-parity-target="banner-container"
        fullMode={false}
        bordered
        type="warning"
        icon={null}
        closeIcon={null}
        title="配置尚未完成"
        description="请补充应用标识后再发布。"
      >
        <div className="banner-scenario__actions">
          <button type="button">稍后处理</button>
          <button type="button">立即配置</button>
        </div>
      </Banner>
      <p className="banner-scenario__status" role="status">
        最近操作：{lastAction}
      </p>
    </div>
  );
}
