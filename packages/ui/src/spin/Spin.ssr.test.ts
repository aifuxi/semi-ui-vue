import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import Spin from './Spin.vue';

describe('Spin SSR', () => {
  it('SSR-safe 渲染默认、hidden、block 与自定义内容', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h('section', [
            h(Spin),
            h(Spin, { spinning: false }),
            h(
              Spin,
              { indicator: h('strong', 'indicator'), tip: h('span', 'loading') },
              { default: () => h('article', 'content') },
            ),
          ]),
      }),
    );
    expect(html).toContain('class="semi-spin semi-spin-middle"');
    expect(html).toContain('id="linearGradient-semi-spin"');
    expect(html).toContain('class="semi-spin semi-spin-middle semi-spin-hidden"');
    expect(html).toContain('class="semi-spin semi-spin-middle semi-spin-block"');
    expect(html).toContain('x-semi-prop="indicator"');
    expect(html).toContain('x-semi-prop="tip"');
    expect(html).toContain('x-semi-prop="children"');
    expect(html).not.toContain('vendor/semi-design');
  });
});
