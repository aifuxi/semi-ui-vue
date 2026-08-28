import React from 'react';
import type { CalendarProps } from '@semi-v2.102.0/calendar';

export default function Calendar({
  className = '',
  events = [],
  height = 600,
  mode = 'week',
  style,
  width = '100%',
  ...rest
}: CalendarProps): React.ReactElement {
  const event = events.find((item) => !item.allDay);
  const parityTarget = rest['data-parity-target'];
  return (
    <div
      className={[`semi-calendar-${mode}`, className].filter(Boolean).join(' ')}
      data-parity-target={parityTarget}
      style={{ height, width, ...style }}
    >
      <div className="semi-calendar-week-header" />
      <div className="semi-calendar-all-day-content" />
      <div className="semi-calendar-week-scroll">
        <div className="semi-calendar-time-item">08:00</div>
        <div className="semi-calendar-time-item">09:00</div>
        <div className="semi-calendar-grid">
          {event ? <div className="semi-calendar-event-day">{event.children}</div> : null}
        </div>
      </div>
    </div>
  );
}
