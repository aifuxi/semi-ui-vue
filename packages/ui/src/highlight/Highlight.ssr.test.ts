/* eslint-disable vue/one-component-per-file */

import { createSSRApp, defineComponent, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import Highlight from './index';

describe('Highlight SSR', () => {
  it('无 DOM 环境稳定输出默认标签、文本和样式', async () => {
    const html = await renderToString(
      createSSRApp(
        defineComponent({
          render: () =>
            h(Highlight, {
              sourceString: 'From Semi to Any',
              searchWords: ['Semi', 'Any'],
              highlightClassName: 'keyword',
              highlightStyle: { borderRadius: '4px' },
            }),
        }),
      ),
    );

    expect(html).toContain('<mark class="semi-highlight-tag keyword"');
    expect(html).toContain('border-radius:4px');
    expect(html).toContain('From ');
    expect(html).toContain('Semi');
    expect(html).toContain('Any');
  });

  it('自定义标签并转义源文本', async () => {
    const html = await renderToString(
      createSSRApp(
        defineComponent({
          render: () =>
            h(Highlight, {
              component: 'strong',
              sourceString: '<Semi>',
              searchWords: ['Semi'],
            }),
        }),
      ),
    );

    expect(html).toContain('&lt;');
    expect(html).toContain('<strong class="semi-highlight-tag">Semi</strong>');
    expect(html).toContain('&gt;');
    expect(html).not.toContain('<Semi>');
  });
});
