import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import Divider from './Divider.vue';

describe('Divider', () => {
  it('is safe to import and render without a DOM', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () => h(Divider, { align: 'right', margin: '8px' }, () => '服务端标题'),
      }),
    );

    expect(html).toContain('semi-divider-with-text-right');
    expect(html).toContain('semi-divider_inner-text');
    expect(html).toContain('服务端标题');
  });
});
