import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import ConfigProvider, { ConfigConsumer, type ConfigContextValue } from './index';

describe('ConfigProvider', () => {
  it('SSR-safe 渲染 LTR/RTL 与 Consumer', async () => {
    const app = createSSRApp({
      render: () =>
        h(
          ConfigProvider,
          { direction: 'rtl', timeZone: 'Asia/Shanghai' },
          {
            default: () =>
              h(ConfigConsumer, null, {
                default: (context: ConfigContextValue) =>
                  h('span', { 'data-zone': context.timeZone }, context.direction),
              }),
          },
        ),
    });
    const html = await renderToString(app);
    expect(html).toContain('class="semi-rtl"');
    expect(html).toContain('data-zone="Asia/Shanghai"');
    expect(html).toContain('>rtl</span>');
  });
});
