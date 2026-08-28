import { createSSRApp, defineComponent, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import { ConfigProvider } from '../config-provider';
import Calendar from './index';

describe('Calendar SSR', () => {
  it('服务端安全渲染 day/week/month/range、Locale 与 RTL', async () => {
    const displayValue = new Date(2023, 3, 10, 8, 32, 0);
    const app = createSSRApp(
      defineComponent({
        setup() {
          return () =>
            h(
              ConfigProvider,
              {
                direction: 'rtl',
                locale: {
                  code: 'en-US',
                  Calendar: {
                    allDay: 'All Day',
                    AM: '${time} AM',
                    PM: '${time} PM',
                    datestring: '',
                    remaining: '${remained} more',
                    close: 'Close event list',
                  },
                },
              },
              () => [
                h(Calendar, { displayValue, mode: 'day', showCurrTime: false }),
                h(Calendar, { displayValue, mode: 'week', showCurrTime: false }),
                h(Calendar, { displayValue, mode: 'month' }),
                h(Calendar, {
                  displayValue,
                  mode: 'range',
                  range: [displayValue, new Date(2023, 3, 13)],
                  showCurrTime: false,
                }),
              ],
            );
        },
      }),
    );
    const html = await renderToString(app);
    expect(html).toContain('class="semi-rtl"');
    expect(html).toContain('semi-calendar-day');
    expect(html.match(/semi-calendar-week/g)?.length).toBeGreaterThan(1);
    expect(html).toContain('semi-calendar-month');
    expect(html).toContain('All Day');
    expect(html).not.toContain('semi-portal-inner');
  });
});
