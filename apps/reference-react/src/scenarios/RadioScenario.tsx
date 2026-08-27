import React, { useState } from 'react';
import Radio from '@semi-v2.102.0/radio';

export function RadioScenario(): React.ReactElement {
  const [lastValue, setLastValue] = useState('none');
  const Group = Radio.Group;

  return (
    <div className="radio-scenario" data-testid="radio-reference">
      <section className="radio-scenario__section" aria-label="基础单选框">
        <h3>基础与状态</h3>
        <div className="radio-scenario__row">
          <Radio
            value="basic"
            aria-label="基础单选框"
            data-parity-target="radio-basic"
            onChange={(event) => setLastValue(`single:${String(event.target.checked)}`)}
          >
            Semi Design
          </Radio>
          <Radio defaultChecked aria-label="默认选中" data-parity-target="radio-checked">
            默认选中
          </Radio>
          <Radio checked disabled aria-label="选中禁用" data-parity-target="radio-disabled">
            选中禁用
          </Radio>
        </div>
        <Radio
          defaultChecked
          extra="适用于需要补充说明的单选项"
          style={{ width: 280 }}
          aria-label="带辅助文本"
          data-parity-target="radio-extra"
        >
          带辅助文本
        </Radio>
      </section>

      <section className="radio-scenario__section" aria-label="单选框组">
        <h3>组合与样式</h3>
        <Group
          options={['Semi UI', 'Semi DSM', 'Semi D2C']}
          defaultValue="Semi D2C"
          name="radio-horizontal"
          aria-label="水平单选框组"
          data-parity-target="radio-group"
          onChange={(event) => setLastValue(`group:${String(event.target.value)}`)}
        />
        <Group
          type="button"
          buttonSize="large"
          defaultValue="即时推送"
          name="radio-button"
          aria-label="按钮单选框组"
          data-parity-target="radio-button"
          options={['即时推送', '定时推送', '动态推送']}
        />
        <div className="radio-scenario__cards">
          <Group
            type="card"
            direction="vertical"
            defaultValue="card-a"
            name="radio-card"
            aria-label="卡片单选框组"
            data-parity-target="radio-card"
          >
            <Radio value="card-a" extra="卡片辅助信息" style={{ width: 240 }}>
              卡片选中
            </Radio>
            <Radio value="card-b" disabled extra="禁用辅助信息" style={{ width: 240 }}>
              卡片禁用
            </Radio>
          </Group>
          <Group
            type="pureCard"
            direction="vertical"
            defaultValue="pure-a"
            name="radio-pure-card"
            aria-label="纯卡片单选框组"
            data-parity-target="radio-pure-card"
          >
            <Radio value="pure-a" extra="无可见圆点" style={{ width: 240 }}>
              纯卡片选中
            </Radio>
            <Radio value="pure-b" extra="保留原生焦点" style={{ width: 240 }}>
              纯卡片未选
            </Radio>
          </Group>
        </div>
      </section>
      <output className="radio-scenario__status" aria-live="polite">
        {`最近变化：${lastValue}`}
      </output>
    </div>
  );
}
