import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './index';

describe('Skeleton SSR', () => {
  it('SSR-safe 渲染 loading、内容态和复合 items', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h('section', [
            h(
              Skeleton,
              {
                active: true,
                'aria-label': 'loading',
                placeholder: h('div', [
                  h(Skeleton.Avatar),
                  h(Skeleton.Title),
                  h(Skeleton.Paragraph, { rows: 2 }),
                ]),
              },
              { default: () => h('strong', 'hidden') },
            ),
            h(Skeleton, { loading: false }, { default: () => h('strong', 'ready') }),
          ]),
      }),
    );
    expect(html).toContain('class="semi-skeleton semi-skeleton-active"');
    expect(html).toContain('aria-label="loading"');
    expect(html).toContain('x-semi-prop="placeholder"');
    expect(html).toContain('semi-skeleton-avatar-medium');
    expect(html).toContain('semi-skeleton-title');
    expect(html.match(/<li><\/li>/g)).toHaveLength(2);
    expect(html).toContain('<strong>ready</strong>');
    expect(html).not.toContain('hidden');
    expect(html).not.toContain('vendor/semi-design');
  });
});
