import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import Popconfirm from './Popconfirm.vue';

describe('Popconfirm SSR', () => {
  it('只渲染 trigger，不访问 Portal 或浮层 DOM', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            Popconfirm,
            {
              content: 'SSR 内容',
              defaultVisible: true,
              title: 'SSR 标题',
            },
            { default: () => h('button', { id: 'ssr-popconfirm-trigger' }, '触发') },
          ),
      }),
    );

    expect(html).toContain('ssr-popconfirm-trigger');
    expect(html).not.toContain('semi-portal');
    expect(html).not.toContain('SSR 内容');
    expect(html).not.toContain('SSR 标题');
  });

  it('disabled SSR 直接输出 slot', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            Popconfirm,
            { disabled: true },
            { default: () => h('a', { href: '#disabled' }, '禁用触发') },
          ),
      }),
    );
    expect(html).toContain('href="#disabled"');
    expect(html).not.toContain('semi-tooltip-wrapper');
  });
});
