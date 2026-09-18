import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';

import DefaultMarkdownRender, { MarkdownRender } from './index';

describe('MarkdownRender SSR', () => {
  it('公开入口保持 default 与 named 导出一致', () => {
    expect(DefaultMarkdownRender).toBe(MarkdownRender);
  });

  it('SSR-safe import 并仅输出等待挂载求值的根容器', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(MarkdownRender, {
            raw: '# 不应在服务端求值',
            className: 'ssr-markdown',
            'data-ssr': 'safe',
          }),
      }),
    );

    expect(html).toContain('class="semi-markdownRender ssr-markdown"');
    expect(html).toContain('data-ssr="safe"');
    expect(html).not.toContain('<h1');
    expect(html).not.toContain('不应在服务端求值');
    expect(html).not.toContain('vendor/semi-design');
  });
});
