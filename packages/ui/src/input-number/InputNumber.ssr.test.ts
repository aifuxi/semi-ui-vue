import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import InputNumber from './InputNumber.vue';

describe('InputNumber SSR', () => {
  it('服务端渲染 spinbutton 且不访问浏览器全局', async () => {
    const html = await renderToString(createSSRApp(() => h(InputNumber, { defaultValue: 1 })));

    expect(html).toContain('semi-input-number');
    expect(html).toContain('role="spinbutton"');
    expect(html).toContain('value="1"');
  });
});
