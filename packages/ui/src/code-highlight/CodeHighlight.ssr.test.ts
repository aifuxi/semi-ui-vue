import { renderToString } from '@vue/server-renderer';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';

import CodeHighlight from './CodeHighlight.vue';

describe('CodeHighlight SSR', () => {
  it('无 browser global 时输出安全文本、固定结构与 attrs，不执行 Prism DOM 高亮', async () => {
    const html = await renderToString(
      h(CodeHighlight, {
        class: 'ssr-code',
        code: '<button onclick="unsafe()">Run</button>',
        language: 'markup',
        style: { width: '320px' },
        'data-kind': 'ssr',
      }),
    );

    expect(html).toContain('semi-codeHighlight');
    expect(html).toContain('semi-codeHighlight-defaultTheme');
    expect(html).toContain('semi-light-scrollbar');
    expect(html).toContain('ssr-code');
    expect(html).toContain('data-kind="ssr"');
    expect(html).toContain('width:320px');
    expect(html).toContain('<pre><code>');
    expect(html).toContain('&lt;button onclick=&quot;unsafe()&quot;&gt;Run&lt;/button&gt;');
    expect(html).not.toContain('token tag');
    expect(html).not.toContain('line-numbers-rows');
    expect(html).not.toContain('vendor/semi-design');
  });
});
