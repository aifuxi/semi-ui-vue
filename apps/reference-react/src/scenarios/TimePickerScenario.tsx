import React, { useState } from 'react';
import TimePicker from '@semi-v2.102.0/time-picker';

const stableScroll = { mode: 'normal' as const, cycled: false, motion: false };

export function TimePickerScenario(): React.ReactElement {
  const [status, setStatus] = useState('none');

  return (
    <div className="time-picker-scenario" data-testid="time-picker-reference">
      <section className="time-picker-scenario__section" aria-label="基础时间选择">
        <h3>基础、尺寸与状态</h3>
        <div className="time-picker-scenario__stack">
          <TimePicker
            defaultValue="10:24:18"
            motion={false}
            scrollItemProps={stableScroll}
            showClear={false}
            data-parity-target="time-picker-basic"
            onChange={(_date, value) => setStatus(`change:${String(value)}`)}
          />
          <div className="time-picker-scenario__row">
            <TimePicker
              size="small"
              defaultValue="08:30:00"
              motion={false}
              scrollItemProps={stableScroll}
              showClear={false}
              data-parity-target="time-picker-small"
            />
            <TimePicker
              size="large"
              defaultValue="18:45:30"
              motion={false}
              scrollItemProps={stableScroll}
              showClear={false}
              data-parity-target="time-picker-large"
            />
          </div>
          <div className="time-picker-scenario__row">
            <TimePicker
              disabled
              defaultValue="12:00:00"
              motion={false}
              showClear={false}
              data-parity-target="time-picker-disabled"
            />
            <TimePicker
              validateStatus="warning"
              defaultValue="09:15:00"
              motion={false}
              scrollItemProps={stableScroll}
              showClear={false}
              data-parity-target="time-picker-warning"
            />
          </div>
        </div>
      </section>

      <section className="time-picker-scenario__section" aria-label="范围与十二小时制">
        <h3>范围、步长与 12 小时制</h3>
        <div className="time-picker-scenario__stack">
          <TimePicker
            type="timeRange"
            defaultValue={['09:00:00', '18:00:00']}
            minuteStep={15}
            motion={false}
            scrollItemProps={stableScroll}
            showClear={false}
            data-parity-target="time-picker-range"
          />
          <TimePicker
            use12Hours
            defaultValue="PM 3:24:18"
            motion={false}
            scrollItemProps={stableScroll}
            showClear={false}
            data-parity-target="time-picker-12h"
          />
        </div>
      </section>

      <output className="time-picker-scenario__status" aria-live="polite">
        {`最近变化：${status}`}
      </output>
    </div>
  );
}
