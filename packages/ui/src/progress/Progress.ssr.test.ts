import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import Progress from './Progress.vue';

describe('Progress SSR', () => {
  it('SSR-safe 渲染 line/circle、ARIA 与 VNode format', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h('section', [
            h(Progress, { 'aria-label': 'line', motion: false, percent: 40, showInfo: true }),
            h(Progress, {
              format: (percent: number) => h('strong', `${percent} complete`),
              motion: false,
              percent: 70,
              showInfo: true,
              type: 'circle',
            }),
          ]),
      }),
    );
    expect(html).toContain('class="semi-progress semi-progress-horizontal"');
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="40"');
    expect(html).toContain('class="semi-progress-circle"');
    expect(html).toContain('<strong>70 complete</strong>');
    expect(html).not.toContain('vendor/semi-design');
  });
});
