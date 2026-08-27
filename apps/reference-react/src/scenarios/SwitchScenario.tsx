import React, { useState } from 'react';
import Switch from '@semi-v2.102.0/switch';

export function SwitchScenario(): React.ReactElement {
  const [controlled, setControlled] = useState(false);
  const [lastChange, setLastChange] = useState('none');

  return (
    <div className="switch-scenario" data-testid="switch-reference">
      <section className="switch-scenario__section" aria-label="基础与尺寸">
        <h3>基础与尺寸</h3>
        <div className="switch-scenario__row">
          <Switch
            aria-label="默认关闭"
            data-parity-target="switch-default"
            onChange={(checked) => setLastChange(`default:${String(checked)}`)}
          />
          <Switch defaultChecked aria-label="默认开启" data-parity-target="switch-checked" />
          <Switch size="small" aria-label="小尺寸" data-parity-target="switch-small" />
          <Switch
            size="large"
            defaultChecked
            checkedText="开"
            uncheckedText="关"
            aria-label="大尺寸"
            data-parity-target="switch-large"
          />
        </div>
      </section>

      <section className="switch-scenario__section" aria-label="文本与状态">
        <h3>文本与状态</h3>
        <div className="switch-scenario__row">
          <Switch
            defaultChecked
            checkedText="ON"
            uncheckedText="OFF"
            aria-label="开启文本"
            data-parity-target="switch-checked-text"
          />
          <Switch
            checkedText="ON"
            uncheckedText="OFF"
            aria-label="关闭文本"
            data-parity-target="switch-unchecked-text"
          />
          <Switch disabled aria-label="禁用关闭" data-parity-target="switch-disabled" />
          <Switch
            disabled
            checked
            aria-label="禁用开启"
            data-parity-target="switch-disabled-checked"
          />
        </div>
      </section>

      <section className="switch-scenario__section" aria-label="加载与受控">
        <h3>加载与受控</h3>
        <div className="switch-scenario__row">
          <Switch loading aria-label="加载关闭" data-parity-target="switch-loading" />
          <Switch
            loading
            defaultChecked
            aria-label="加载开启"
            data-parity-target="switch-loading-checked"
          />
          <Switch
            checked={controlled}
            aria-label="受控开关"
            data-parity-target="switch-controlled"
            onChange={(checked) => {
              setControlled(checked);
              setLastChange(`controlled:${String(checked)}`);
            }}
          />
        </div>
      </section>

      <output className="switch-scenario__status" aria-live="polite">
        {`最近变化：${lastChange}`}
      </output>
    </div>
  );
}
