import React, { useState } from 'react';
import Checkbox from '@semi-v2.102.0/checkbox';

const horizontalOptions = ['Semi UI', 'Semi DSM', 'Semi D2C'];

export function CheckboxScenario(): React.ReactElement {
  const [lastValue, setLastValue] = useState('none');
  const Group = Checkbox.Group;

  return (
    <div className="checkbox-scenario" data-testid="checkbox-reference">
      <section className="checkbox-scenario__section" aria-label="基础复选框">
        <h3>基础复选框</h3>
        <div className="checkbox-scenario__row">
          <Checkbox
            aria-label="Checkbox 示例"
            data-parity-target="checkbox-basic"
            onChange={(event) => setLastValue(`basic:${String(event.target.checked)}`)}
          >
            Semi Design
          </Checkbox>
          <Checkbox defaultChecked aria-label="默认选中" data-parity-target="checkbox-checked">
            默认选中
          </Checkbox>
          <Checkbox disabled aria-label="禁用" data-parity-target="checkbox-disabled">
            禁用
          </Checkbox>
          <Checkbox indeterminate aria-label="部分选中" data-parity-target="checkbox-indeterminate">
            部分选中
          </Checkbox>
        </div>
        <Checkbox
          extra="Semi Design 是由抖音前端团队与 UED 团队共同设计开发并维护的设计系统"
          style={{ width: 280 }}
          aria-label="带辅助文本"
          data-parity-target="checkbox-extra"
        >
          Semi Design
        </Checkbox>
      </section>

      <section className="checkbox-scenario__section" aria-label="复选框组与卡片">
        <h3>复选框组与卡片</h3>
        <Group
          options={horizontalOptions}
          defaultValue={['Semi D2C']}
          direction="horizontal"
          aria-label="CheckboxGroup 示例"
          data-parity-target="checkbox-group-horizontal"
          onChange={(value) => setLastValue(`group:${value.join(',')}`)}
        />
        <div className="checkbox-scenario__cards">
          <Group
            type="card"
            defaultValue={['card-a']}
            direction="vertical"
            aria-label="卡片复选框组"
            data-parity-target="checkbox-card-group"
          >
            <Checkbox value="card-a" extra="卡片辅助信息" style={{ width: 240 }}>
              卡片选中
            </Checkbox>
            <Checkbox value="card-b" disabled extra="禁用辅助信息" style={{ width: 240 }}>
              卡片禁用
            </Checkbox>
          </Group>
          <Group
            type="pureCard"
            defaultValue={['pure-a']}
            direction="vertical"
            aria-label="纯卡片复选框组"
            data-parity-target="checkbox-pure-card-group"
          >
            <Checkbox value="pure-a" extra="无可见 checkbox" style={{ width: 240 }}>
              纯卡片选中
            </Checkbox>
            <Checkbox value="pure-b" extra="仍保留键盘焦点" style={{ width: 240 }}>
              纯卡片未选
            </Checkbox>
          </Group>
        </div>
      </section>
      <output className="checkbox-scenario__status" aria-live="polite">
        {`最近变化：${lastValue}`}
      </output>
    </div>
  );
}
