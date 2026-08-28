import React from 'react';
import Descriptions from '@semi-v2.102.0/descriptions';

const profileData = [
  { key: <strong>项目名称</strong>, value: 'Semi UI Vue' },
  { key: '当前版本', value: () => 'v2.102.0' },
  { key: '维护状态', value: '持续对齐' },
];

const plainData = [
  { key: '负责人', value: 'Chen' },
  { key: '工作区', value: 'semi-ui-vue' },
];

const horizontalData = [
  { key: '项目', value: '组件复刻', span: 2 },
  { key: '状态', value: 'Ready' },
  { key: '隐藏项', value: '不可见', hidden: true, span: 3 },
  { key: '基线', value: '本地 vendor' },
  { key: '提交', value: '待验收' },
];

export function DescriptionsScenario(): React.ReactElement {
  return (
    <div className="descriptions-scenario" data-testid="descriptions-reference">
      <section className="descriptions-scenario__section">
        <h3>基础与节点内容</h3>
        <Descriptions data={profileData} data-parity-target="descriptions-default" />
      </section>

      <section className="descriptions-scenario__section descriptions-scenario__section--plain">
        <h3>Plain</h3>
        <Descriptions align="plain" data={plainData} data-parity-target="descriptions-plain" />
      </section>

      <section className="descriptions-scenario__section descriptions-scenario__section--double">
        <h3>双行尺寸</h3>
        <div className="descriptions-scenario__sizes" data-parity-target="descriptions-double">
          <Descriptions row size="small" data={profileData.slice(0, 2)} />
          <Descriptions row data={profileData.slice(0, 2)} />
          <Descriptions row size="large" data={profileData.slice(0, 2)} />
        </div>
      </section>

      <section className="descriptions-scenario__section descriptions-scenario__section--wide">
        <h3>横向 span 与 hidden</h3>
        <Descriptions
          align="left"
          column={3}
          data={horizontalData}
          layout="horizontal"
          data-parity-target="descriptions-horizontal"
        />
      </section>

      <section className="descriptions-scenario__section descriptions-scenario__section--wide">
        <h3>Item API</h3>
        <Descriptions data-parity-target="descriptions-item">
          <Descriptions.Item itemKey="适配方式">Vue slots</Descriptions.Item>
          <Descriptions.Item
            itemKey={<strong>样式契约</strong>}
            keyStyle={{ color: 'var(--semi-color-primary)' }}
          >
            .semi-* / --semi-*
          </Descriptions.Item>
          <Descriptions.Item hidden itemKey="隐藏">
            不可见
          </Descriptions.Item>
        </Descriptions>
      </section>
    </div>
  );
}
