/* eslint-disable vue/one-component-per-file */

import { createSSRApp, defineComponent, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import Image, { ImagePreview } from './index';

describe('Image SSR', () => {
  it('Image 无 DOM 环境输出稳定 loading、原生 attrs 与 preview 三态', async () => {
    const html = await renderToString(
      createSSRApp(
        defineComponent({
          render: () =>
            h('main', [
              h(Image, { 'aria-label': '默认预览', src: '/one.png', width: 80 }),
              h(Image, { preview: false, src: '/two.png', width: 80 }),
              h(Image, { preview: true, src: '/three.png', width: 80 }),
            ]),
        }),
      ),
    );
    expect(html.match(/class="semi-image"/g)).toHaveLength(3);
    expect(html).toContain('aria-label="默认预览"');
    expect(html).toContain('class="semi-skeleton-image"');
    expect(html).not.toContain('semi-image-preview"');
  });

  it('ImagePreview SSR 只渲染 group，不创建 Portal 或客户端副作用', async () => {
    const html = await renderToString(
      createSSRApp(
        defineComponent({
          render: () =>
            h(
              ImagePreview,
              { defaultVisible: true, lazyLoad: true },
              { default: () => [h(Image, { src: '/one.png' }), h(Image, { src: '/two.png' })] },
            ),
        }),
      ),
    );
    expect(html).toContain('semi-image-preview-group');
    expect(html.match(/class="semi-image"/g)).toHaveLength(2);
    expect(html).toContain('data-src="/one.png"');
    expect(html).not.toContain('class="semi-portal');
  });
});
