// @vitest-environment node

import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { BackTop } from './index';

describe('BackTop SSR', () => {
  it('保持初始隐藏且不会解析 target 或浏览器全局', async () => {
    const target = vi.fn(() => {
      throw new Error('SSR 不应解析 target');
    });
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(BackTop, { target, visibilityHeight: -1 }, { default: () => h('span', '自定义回顶') }),
      }),
    );

    expect(html).toBe('<!---->');
    expect(target).not.toHaveBeenCalled();
  });
});
