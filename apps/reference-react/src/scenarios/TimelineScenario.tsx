import React, { useState } from 'react';
import Timeline from '@semi-v2.102.0/timeline';

const centerData = [
  { content: '需求确认', time: '09:00', type: 'success' as const },
  { content: '开发完成', time: '11:30', type: 'ongoing' as const, position: 'right' as const },
  { content: '发布验证', time: '14:00', extra: '等待审批', color: '#b35c00' },
];

export function TimelineScenario(): React.ReactElement {
  const [lastAction, setLastAction] = useState('暂无操作');

  return (
    <div className="timeline-scenario" data-testid="timeline-reference">
      <Timeline
        aria-label="处理进度"
        data-parity-target="timeline-basic"
        className="timeline-scenario__column"
      >
        <Timeline.Item
          data-parity-target="timeline-success"
          type="success"
          time="08:30"
          onClick={() => setLastAction('创建服务现场')}
        >
          创建服务现场
        </Timeline.Item>
        <Timeline.Item type="warning" time="09:15" extra="网络抖动">
          初步排查
        </Timeline.Item>
        <Timeline.Item type="error" time="10:20">
          发现异常
        </Timeline.Item>
        <Timeline.Item type="ongoing" time="11:00">
          正在修复
        </Timeline.Item>
      </Timeline>
      <Timeline
        aria-label="发布过程"
        className="timeline-scenario__column"
        data-parity-target="timeline-center"
        mode="center"
        dataSource={centerData}
      />
      <p className="timeline-scenario__status" role="status">
        最近操作：{lastAction}
      </p>
    </div>
  );
}
