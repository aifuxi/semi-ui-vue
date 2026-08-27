import React, { useState } from 'react';
import InputNumber from '@semi-v2.102.0/input-number';

export function InputNumberScenario(): React.ReactElement {
  const [lastValue, setLastValue] = useState('none');

  return (
    <div className="input-number-scenario" data-testid="input-number-reference">
      <section className="input-number-scenario__section" aria-label="数字输入框">
        <h3>数字输入框</h3>
        <div className="input-number-scenario__grid">
          <label>
            基础
            <InputNumber
              defaultValue={1}
              className="input-number-target-basic"
              data-parity-target="input-number-basic"
              aria-label="基础数字输入框"
              onChange={(value) => setLastValue(String(value))}
            />
          </label>
          <label>
            上下界
            <InputNumber
              defaultValue={1}
              min={1}
              max={10}
              step={2}
              className="input-number-target-bounds"
              data-parity-target="input-number-bounds"
              aria-label="有上下界的数字输入框"
            />
          </label>
          <label>
            精度
            <InputNumber
              defaultValue={1.234}
              precision={2}
              className="input-number-target-precision"
              data-parity-target="input-number-precision"
              aria-label="精度数字输入框"
            />
          </label>
          <label>
            内置按钮
            <InputNumber
              defaultValue={5}
              innerButtons
              suffix="小时"
              className="input-number-target-inner"
              data-parity-target="input-number-inner"
              aria-label="内置按钮数字输入框"
            />
          </label>
          <label>
            禁用
            <InputNumber
              defaultValue={2}
              disabled
              className="input-number-target-disabled"
              data-parity-target="input-number-disabled"
              aria-label="禁用数字输入框"
            />
          </label>
          <label>
            隐藏按钮
            <InputNumber
              defaultValue={8}
              hideButtons
              className="input-number-target-hidden"
              data-parity-target="input-number-hidden"
              aria-label="隐藏按钮数字输入框"
            />
          </label>
          <label>
            美元
            <InputNumber
              defaultValue={1234.5}
              currency="USD"
              localeCode="en-US"
              className="input-number-target-currency"
              data-parity-target="input-number-currency"
              aria-label="美元数字输入框"
            />
          </label>
          <label>
            科学计数
            <InputNumber
              defaultValue={123456789012345}
              scientificNotation
              className="input-number-target-scientific"
              data-parity-target="input-number-scientific"
              aria-label="科学计数数字输入框"
            />
          </label>
        </div>
      </section>
      <output className="input-number-scenario__status" aria-live="polite">
        {`最近变化：${lastValue}`}
      </output>
    </div>
  );
}
