import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, defineComponent, h } from 'vue';

import Typography, { Numeral, Paragraph, Text, Title } from './index';

describe('Typography', () => {
  it('四个公开组件均可 SSR-safe import/render', async () => {
    const app = createSSRApp(
      defineComponent({
        setup: () => () =>
          h(Typography, null, {
            default: () => [
              h(Title, { heading: 2 }, () => 'Title'),
              h(Text, { strong: true }, () => 'Text'),
              h(Paragraph, null, () => 'Paragraph'),
              h(Numeral, { rule: 'percentages', precision: 1 }, () => '0.125'),
            ],
          }),
      }),
    );
    const html = await renderToString(app);
    expect(html).toContain('<article class="semi-typography">');
    expect(html).toContain('12.5%');
    expect(html).not.toContain('data-v-app');
  });
});
