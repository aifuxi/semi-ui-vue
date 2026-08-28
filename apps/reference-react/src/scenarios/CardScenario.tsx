import React, { useState } from 'react';
import Card from '@semi-v2.102.0/card';
import CardGroup from '@semi-v2.102.0/card-group';
import Avatar from '@semi-v2.102.0/avatar';
import Button from '@semi-v2.102.0/button';
import Typography from '@semi-v2.102.0/typography';

const { Meta } = Card;
const { Text } = Typography;

export function CardScenario(): React.ReactElement {
  const [status, setStatus] = useState('等待操作');
  return (
    <div className="card-scenario" data-testid="card-reference">
      <section className="card-scenario__primary">
        <Card
          title="Semi Design"
          style={{ maxWidth: 360 }}
          headerExtraContent={<Text link>更多</Text>}
          data-parity-target="card-basic"
          aria-label="基础卡片"
        >
          Semi Design 帮助设计师与开发者打造高质量、体验一致的 Web 应用。
        </Card>

        <Card
          title={
            <Meta
              avatar={<Avatar color="blue">SD</Avatar>}
              title="Semi Doc"
              description="全面、易用、优质"
            />
          }
          cover={<div className="card-scenario__cover">Vue parity</div>}
          footer={<Text type="tertiary">固定 v2.102.0 基线</Text>}
          footerLine
          shadows="always"
          data-parity-target="card-complete"
          aria-label="完整卡片"
          actions={[
            <Button key="details" theme="borderless" onClick={() => setStatus('查看详情')}>
              查看详情
            </Button>,
            <Button key="start" theme="solid" onClick={() => setStatus('开始使用')}>
              开始使用
            </Button>,
          ]}
        >
          卡片可组合标题、封面、正文、操作组和页脚。
        </Card>
      </section>

      <section className="card-scenario__states">
        <Card
          title="无外框"
          bordered={false}
          headerLine={false}
          data-parity-target="card-borderless"
        >
          显式关闭 bordered 与 headerLine。
        </Card>
        <Card title="悬浮阴影" shadows="hover" data-parity-target="card-hover">
          Hover 后显示阴影。
        </Card>
        <Card loading data-parity-target="card-loading" aria-label="加载中的卡片">
          加载完成后的正文
        </Card>
      </section>

      <CardGroup type="grid" className="card-scenario__group" data-parity-target="card-group">
        <Card title="设计">统一语言</Card>
        <Card title="开发">可复用组件</Card>
        <Card title="交付">稳定体验</Card>
      </CardGroup>

      <output className="card-scenario__status" aria-live="polite">
        {status}
      </output>
    </div>
  );
}
