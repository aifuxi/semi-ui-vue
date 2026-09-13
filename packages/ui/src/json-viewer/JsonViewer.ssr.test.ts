import { renderToString } from '@vue/server-renderer';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import JsonViewer from './JsonViewer.vue';

describe('JsonViewer SSR', () => {
  it('只输出静态容器与搜索触发器，不创建 Worker 或访问 DOM', async () => {
    const WorkerConstructor = vi.fn();
    vi.stubGlobal('Worker', WorkerConstructor);
    const html = await renderToString(
      h(JsonViewer, {
        value: '{"ssr":true}',
        width: 360,
        height: 120,
        className: 'ssr-viewer',
      }),
    );
    expect(html).toContain('ssr-viewer');
    expect(html).toContain('semi-json-viewer semi-json-viewer-background');
    expect(html).toContain('width:360px');
    expect(html).toContain('semi-json-viewer-search-bar-trigger');
    expect(WorkerConstructor).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('showSearch=false 时不渲染搜索入口且仍保持 editor SSR shell', async () => {
    const html = await renderToString(
      h(JsonViewer, { value: '{}', showSearch: false, width: '100%', height: '80px' }),
    );
    expect(html).toContain('semi-json-viewer-background');
    expect(html).not.toContain('semi-json-viewer-search-bar-trigger');
  });
});
