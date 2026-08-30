import { renderToString } from '@vue/server-renderer';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';

import IconButton from './IconButton';

describe('IconButton SSR', () => {
  it('无 browser global 时稳定输出 icon-only、图文、loading 与 attrs', async () => {
    const html = await renderToString(
      h('section', [
        h(
          IconButton,
          { 'aria-label': '收藏', class: 'ssr-icon-button', 'data-kind': 'icon-only' },
          { icon: () => h('svg', { 'data-icon': 'star' }) },
        ),
        h(
          IconButton,
          { iconPosition: 'right', noHorizontalPadding: true },
          { default: () => '展开', icon: () => h('svg', { 'data-icon': 'arrow' }) },
        ),
        h(IconButton, { loading: true, theme: 'solid', type: 'tertiary' }),
      ]),
    );
    expect(html).toContain('semi-button-with-icon-only');
    expect(html).toContain('ssr-icon-button');
    expect(html).toContain('aria-label="收藏"');
    expect(html).toContain('data-kind="icon-only"');
    expect(html).toContain('data-icon="star"');
    expect(html).toContain('semi-button-content-left');
    expect(html).toContain('padding-left:0');
    expect(html).toContain('padding-right:0');
    expect(html).toContain('semi-button-content-loading-icon');
    expect(html).not.toContain('vendor/semi-design');
  });
});
