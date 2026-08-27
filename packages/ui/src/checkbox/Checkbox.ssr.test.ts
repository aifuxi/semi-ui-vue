import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import Checkbox, { CheckboxGroup } from './index';

describe('Checkbox SSR', () => {
  it('渲染单项/组 DOM、ARIA、options 与 slot，且不创建客户端副作用', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h('div', [
            h(Checkbox, { checked: true, extra: '说明', ariaLabel: '同意' }, () => '协议'),
            h(CheckboxGroup, { defaultValue: ['a'], options: ['a', 'b'] }),
          ]),
      }),
    );
    expect(html).toContain('semi-checkbox-checked');
    expect(html).toContain('semi-checkbox-extra');
    expect(html).toContain('aria-label="同意"');
    expect(html).toContain('role="list"');
    expect(html.match(/role="listitem"/g)).toHaveLength(2);
  });
});
