import React, { useState } from 'react';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import Slider from '@semi-v2.102.0/slider';

const MARKS = { 0: '0', 20: '20°C', 50: '50°C', 80: '80°C', 100: '100' };

export interface SliderScenarioProps {
  direction: 'ltr' | 'rtl';
}

export function SliderScenario({ direction }: SliderScenarioProps): React.ReactElement {
  const [status, setStatus] = useState('none');

  return (
    <ConfigProvider direction={direction}>
      <div className="slider-scenario" data-testid="slider-reference">
        <section className="slider-scenario__section" aria-label="基础滑动选择器">
          <h3>基础与范围</h3>
          <div className="slider-scenario__stack">
            <Slider
              aria-label="基础值"
              defaultValue={30}
              data-parity-target="slider-basic"
              onChange={(value) => setStatus(`basic:${String(value)}`)}
            />
            <Slider
              aria-label="范围值"
              range
              defaultValue={[20, 70]}
              data-parity-target="slider-range"
              onChange={(value) => setStatus(`range:${String(value)}`)}
            />
            <Slider
              aria-label="禁用值"
              disabled
              defaultValue={55}
              data-parity-target="slider-disabled"
            />
          </div>
        </section>

        <section className="slider-scenario__section" aria-label="刻度与纵向">
          <h3>刻度与纵向</h3>
          <div className="slider-scenario__row">
            <div className="slider-scenario__marks">
              <Slider
                aria-label="温度范围"
                range
                step={10}
                marks={MARKS}
                defaultValue={[20, 60]}
                handleDot={[
                  { color: 'var(--semi-color-primary)', size: '6px' },
                  { color: 'var(--semi-color-danger)', size: '6px' },
                ]}
                data-parity-target="slider-marks"
                onChange={(value) => setStatus(`marks:${String(value)}`)}
              />
            </div>
            <div className="slider-scenario__vertical">
              <Slider
                aria-label="纵向值"
                vertical
                defaultValue={40}
                data-parity-target="slider-vertical"
                onChange={(value) => setStatus(`vertical:${String(value)}`)}
              />
            </div>
          </div>
        </section>

        <output className="slider-scenario__status" aria-live="polite">
          {`最近变化：${status}`}
        </output>
      </div>
    </ConfigProvider>
  );
}
