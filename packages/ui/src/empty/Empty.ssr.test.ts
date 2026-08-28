/* eslint-disable vue/one-component-per-file */

import { createSSRApp, defineComponent, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import Empty from './index';

describe('Empty SSR', () => {
  it('无 DOM 环境稳定渲染 light 图片、内容、attrs 与布局', async () => {
    const app = createSSRApp(
      defineComponent({
        render: () =>
          h(
            Empty,
            {
              image: '/light.png',
              darkModeImage: '/dark.png',
              title: '空状态',
              description: '暂无内容',
              layout: 'horizontal',
              'aria-label': '空状态区域',
              'data-probe': 'empty',
            },
            { default: () => h('button', '创建') },
          ),
      }),
    );

    const html = await renderToString(app);
    expect(html).toContain('class="semi-empty semi-empty-horizontal"');
    expect(html).toContain('aria-label="空状态区域"');
    expect(html).toContain('data-probe="empty"');
    expect(html).toContain('src="/light.png"');
    expect(html).not.toContain('/dark.png');
    expect(html).toContain('<h4');
    expect(html).toContain('semi-empty-title');
    expect(html).toContain('暂无内容');
    expect(html).toContain('<button>创建</button>');
  });

  it('无图片时使用 heading 6 并保留固定空图片 wrapper', async () => {
    const html = await renderToString(
      createSSRApp(defineComponent({ render: () => h(Empty, { title: '没有结果' }) })),
    );
    expect(html).toContain('<div class="semi-empty-image"');
    expect(html).toContain('<h6');
    expect(html).toContain('font-weight:400');
  });
});
