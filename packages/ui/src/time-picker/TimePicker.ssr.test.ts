// @vitest-environment node

import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import TimePicker from './index';

describe('TimePicker SSR', () => {
  it('输出默认、range、disabled、readOnly 与 slot 输入 DOM，不创建 Portal', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h('div', [
            h(TimePicker, { ariaLabel: 'time', defaultValue: '10:24:18' }),
            h(TimePicker, {
              defaultValue: ['10:00:00', '11:00:00'],
              disabled: true,
              inputReadOnly: true,
              type: 'timeRange',
            }),
            h(TimePicker, {}, { trigger: () => h('button', { type: 'button' }, 'Custom time') }),
          ]),
      }),
    );
    expect(html).toContain('class="semi-timepicker');
    expect(html).toContain('value="10:24:18"');
    expect(html).toContain('aria-label="time"');
    expect(html).toContain('disabled');
    expect(html).toContain('readonly');
    expect(html).toContain('Custom time');
    expect(html).not.toContain('semi-portal');
    expect(html).not.toContain('vendor/semi-design');
  });
});
