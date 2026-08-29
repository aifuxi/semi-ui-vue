import { renderToString } from '@vue/server-renderer';
import { createSSRApp, defineComponent, h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';

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

  it('SSR markup 可无警告 hydration，并在客户端把 Portal 挂入稳定容器', async () => {
    const portal = document.createElement('div');
    document.body.appendChild(portal);
    const Host = defineComponent({
      render: () =>
        h(
          Popconfirm,
          {
            content: 'Hydration 内容',
            getPopupContainer: () => portal,
            motion: false,
            title: 'Hydration 标题',
            visible: true,
          },
          { default: () => h('button', { id: 'hydrate-popconfirm-trigger' }, 'Hydrate') },
        ),
    });
    const serverHtml = await renderToString(createSSRApp(Host));
    const container = document.createElement('div');
    container.innerHTML = serverHtml;
    document.body.appendChild(container);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const app = createSSRApp(Host);
    app.mount(container);
    for (let index = 0; index < 5; index += 1) await nextTick();

    expect(consoleError).not.toHaveBeenCalled();
    expect(container.querySelector('#hydrate-popconfirm-trigger')).not.toBeNull();
    expect(portal.querySelector('.semi-popconfirm')?.textContent).toContain('Hydration 内容');
    app.unmount();
    await nextTick();
    expect(portal.querySelector('.semi-portal')).toBeNull();
    portal.remove();
    container.remove();
    consoleError.mockRestore();
  });
});
