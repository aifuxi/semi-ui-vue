// @vitest-environment node

import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import Rating from './index';

describe('Rating SSR', () => {
  it('输出默认、半星、disabled、字符与 ARIA，且不创建 Tooltip Portal', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h('div', [
            h(Rating, { defaultValue: 3, 'aria-label': 'star' }),
            h(Rating, { allowHalf: true, defaultValue: 2.5 }),
            h(Rating, { character: 'S', defaultValue: 1, disabled: true }),
            h(Rating, { defaultValue: 2, tooltips: ['bad', 'normal', 'good'] }),
          ]),
      }),
    );
    expect(html).toContain('Rating: 3 of 5 stars,');
    expect(html.match(/semi-rating-star-full/g)?.length).toBeGreaterThanOrEqual(6);
    expect(html).toContain('semi-rating-star-half');
    expect(html).toContain('semi-rating-disabled');
    expect(html).toContain('x-semi-prop="character"');
    expect(html).toContain('role="radio"');
    expect(html).not.toContain('semi-portal');
  });
});
