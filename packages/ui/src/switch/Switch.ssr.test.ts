import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import Switch from './index';

describe('Switch', () => {
  it('SSR-safe 渲染受控、loading、文本和 ARIA，不访问浏览器全局', async () => {
    const app = createSSRApp({
      render: () =>
        h(Switch, {
          checked: true,
          loading: true,
          size: 'large',
          checkedText: '开',
          ariaLabel: 'SSR switch',
        }),
    });
    const html = await renderToString(app);
    expect(html).toContain('semi-switch-checked');
    expect(html).toContain('semi-switch-loading');
    expect(html).toContain('semi-spin-large');
    expect(html).toContain('aria-label="SSR switch"');
    expect(html).toContain('aria-checked="true"');
    expect(html).toContain('开');
  });
});
