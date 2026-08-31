import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import DragMove from './DragMove.vue';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('DragMove SSR', () => {
  it('服务端只输出唯一 slot 根节点且不访问 browser global', async () => {
    vi.stubGlobal('requestAnimationFrame', undefined);
    const html = await renderToString(
      h(
        DragMove,
        { positionStrategy: 'relative' },
        {
          default: () =>
            h('section', { 'aria-label': 'draggable', class: 'ssr-drag', style: { left: '4px' } }, [
              h('button', 'content'),
            ]),
        },
      ),
    );
    expect(html).toContain('<section');
    expect(html).toContain('class="ssr-drag"');
    expect(html).toContain('aria-label="draggable"');
    expect(html).toContain('left:4px');
    expect(html).not.toContain('position:relative');
    expect(html).not.toContain('DragMoveRenderer');
  });

  it('hydration 后初始化 Foundation、支持拖动且无 warning', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    const Host = {
      render: () =>
        h(
          DragMove,
          { positionStrategy: 'relative' },
          {
            default: () => h('div', { class: 'hydrated-drag', style: { left: '5px', top: '3px' } }),
          },
        ),
    };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    const app = createSSRApp(Host);
    app.mount(container);
    await nextTick();

    const element = container.querySelector<HTMLElement>('.hydrated-drag');
    expect(element?.style.position).toBe('relative');
    expect(element?.style.cursor).toBe('move');
    element?.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }),
    );
    document.dispatchEvent(
      new MouseEvent('mousemove', { bubbles: true, clientX: 30, clientY: 35 }),
    );
    expect(element?.style.left).toBe('25px');
    expect(element?.style.top).toBe('28px');
    expect(error).not.toHaveBeenCalled();
    app.unmount();
  });
});
