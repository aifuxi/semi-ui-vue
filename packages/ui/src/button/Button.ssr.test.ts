import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

import { Button } from './index';

describe('Button', () => {
  it('is safe to render without a DOM', async () => {
    const html = await renderToString(
      h(Button, { type: 'warning', loading: true }, { default: () => '撤销' }),
    );

    expect(html).toContain('semi-button-warning');
    expect(html).toContain('semi-button-loading');
    expect(html).toContain('data-icon="spin"');
  });
});
