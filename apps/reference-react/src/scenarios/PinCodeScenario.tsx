import React, { useState } from 'react';
import PinCode from '@semi-v2.102.0/pin-code';

export function PinCodeScenario(): React.ReactElement {
  const [lastValue, setLastValue] = useState('none');

  return (
    <div className="pin-code-scenario" data-testid="pin-code-reference">
      <section className="pin-code-scenario__section" aria-label="验证码输入">
        <h3>验证码输入</h3>
        <div className="pin-code-scenario__grid">
          <label>
            小尺寸
            <PinCode
              className="pin-code-target-small"
              size="small"
              defaultValue="123456"
              onChange={setLastValue}
            />
          </label>
          <label>
            默认尺寸
            <PinCode
              className="pin-code-target-default"
              defaultValue="123456"
              onChange={setLastValue}
            />
          </label>
          <label>
            大尺寸
            <PinCode
              className="pin-code-target-large"
              size="large"
              defaultValue="123456"
              onChange={setLastValue}
            />
          </label>
          <label>
            四位混合码
            <PinCode
              autoFocus={false}
              className="pin-code-target-mixed"
              count={4}
              format="mixed"
              defaultValue="A1b2"
              onChange={setLastValue}
            />
          </label>
          <label>
            禁用
            <PinCode
              autoFocus={false}
              className="pin-code-target-disabled"
              defaultValue="654321"
              disabled
            />
          </label>
          <label>
            空值
            <PinCode autoFocus={false} className="pin-code-target-empty" onChange={setLastValue} />
          </label>
        </div>
      </section>
      <output className="pin-code-scenario__status" aria-live="polite">
        {`最近变化：${lastValue}`}
      </output>
    </div>
  );
}
