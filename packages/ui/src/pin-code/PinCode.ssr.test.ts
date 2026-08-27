import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import PinCode from './PinCode.vue';

describe('PinCode SSR', () => {
  it('渲染固定 Input DOM、数量、值与禁用状态且不访问浏览器全局', async () => {
    const html = await renderToString(
      createSSRApp(() =>
        h(PinCode, {
          autoFocus: true,
          count: 4,
          defaultValue: '1234',
          disabled: true,
        }),
      ),
    );

    expect(html).toContain('semi-pincode-wrapper');
    expect(html.match(/<input/g)).toHaveLength(4);
    expect(html).toContain('value="1"');
    expect(html).toContain('value="4"');
    expect(html.match(/ disabled/g)).toHaveLength(4);
    expect(html).not.toContain('autofocus');
  });
});
