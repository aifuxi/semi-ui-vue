import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Calendar from './index';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('Calendar hydration', () => {
  it('月视图使用配置 locale 生成稳定日期标签', async () => {
    let environment = 'server';
    const format = vi.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(function (
      this: Date,
      locales?: Intl.LocalesArgument,
    ) {
      return locales
        ? `${this.getFullYear()}/${this.getMonth() + 1}/${this.getDate()}`
        : environment;
    });
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = {
      render: () => h(Calendar, { displayValue: new Date(2024, 7, 15), mode: 'month' }),
    };
    const container = document.createElement('div');
    container.innerHTML = await renderToString(h(Host));

    environment = 'client';
    const app = createSSRApp(Host);
    app.mount(container);

    expect(format.mock.calls.every(([locale]) => locale === 'zh-CN')).toBe(true);
    expect(error).not.toHaveBeenCalled();
    app.unmount();
  });

  it('跨周事件输出稳定百分比样式', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = {
      render: () =>
        h(Calendar, {
          displayValue: new Date(2019, 6, 23),
          events: [
            {
              key: 'range',
              start: new Date(2019, 6, 25, 8),
              end: new Date(2019, 6, 27, 16),
              content: '跨周事件',
            },
            {
              key: 'daily',
              start: new Date(2019, 6, 23, 8),
              end: new Date(2019, 6, 23, 9),
              content: '日程事件',
            },
          ],
          mode: 'week',
          showCurrTime: false,
        }),
    };
    const container = document.createElement('div');
    const html = await renderToString(h(Host));
    container.innerHTML = html;

    const app = createSSRApp(Host);
    app.mount(container);

    expect(html).toContain('left:57.1%');
    expect(html).toContain('left:0%');
    expect(html).not.toContain('57.099999');
    expect(html).not.toContain('NaN');
    expect(error).not.toHaveBeenCalled();
    app.unmount();
  });
});
