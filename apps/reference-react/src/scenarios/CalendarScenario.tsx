import React, { useState } from 'react';
import Calendar from '@semi-v2.102.0/calendar';
import ConfigProvider from '@semi-v2.102.0/config-provider';
import { enUS, zhCN } from 'date-fns/locale';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const displayValue = new Date(2023, 3, 10, 8, 32, 0);
const eventStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  border: '1px solid var(--semi-color-primary)',
  borderRadius: 3,
  background: 'var(--semi-color-primary-light-default)',
  height: '100%',
  overflow: 'hidden',
  padding: '2px 4px',
};
const events = [
  {
    key: 'review',
    start: new Date(2023, 3, 10, 9),
    end: new Date(2023, 3, 10, 10, 30),
    children: <div style={eventStyle}>09:00 Review</div>,
  },
  {
    key: 'sync',
    start: new Date(2023, 3, 10, 13),
    end: new Date(2023, 3, 10, 14),
    children: <div style={eventStyle}>13:00 Sync</div>,
  },
  {
    key: 'release',
    allDay: true,
    start: new Date(2023, 3, 10),
    children: <div style={eventStyle}>Release day</div>,
  },
  {
    key: 'milestone',
    allDay: true,
    start: new Date(2023, 3, 10),
    children: <div style={eventStyle}>Milestone</div>,
  },
];

const localeMap = {
  'zh-CN': {
    code: 'zh-CN',
    dateFnsLocale: zhCN,
    Calendar: {
      allDay: '全天',
      AM: '上午${time}时',
      PM: '下午${time}时',
      datestring: '日',
      remaining: '还有${remained}项',
    },
  },
  'en-US': {
    code: 'en-US',
    dateFnsLocale: enUS,
    Calendar: {
      allDay: 'All Day',
      AM: '${time} AM',
      PM: '${time} PM',
      datestring: '',
      remaining: '${remained} more',
    },
  },
};

export function CalendarScenario({
  direction,
  locale,
}: {
  direction: ParityDirection;
  locale: ParityLocale;
}): React.ReactElement {
  const [mode, setMode] = useState<'day' | 'week' | 'month' | 'range'>('week');
  const [status, setStatus] = useState('等待操作');
  return (
    <ConfigProvider direction={direction} locale={localeMap[locale]}>
      <div className="calendar-scenario" data-testid="calendar-reference">
        <div className="calendar-scenario__toolbar" role="group" aria-label="Calendar mode">
          {(['day', 'week', 'month', 'range'] as const).map((item) => (
            <button
              key={item}
              type="button"
              data-mode={item}
              aria-pressed={mode === item}
              onClick={() => setMode(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <Calendar
          data-parity-target="calendar-root"
          mode={mode}
          displayValue={displayValue}
          range={[displayValue, new Date(2023, 3, 14)]}
          events={events}
          height={340}
          width="100%"
          markWeekend
          minEventHeight={28}
          scrollTop={300}
          showCurrTime={false}
          onClick={(_event, date) => setStatus(`日期：${date.toISOString()}`)}
          onMoreClick={(_event, date, remaining) =>
            setStatus(`更多：${date.getDate()}/${remaining}`)
          }
          onClose={() => setStatus('卡片已关闭')}
        />
        <output className="calendar-scenario__status" aria-live="polite">
          {status}
        </output>
      </div>
    </ConfigProvider>
  );
}
