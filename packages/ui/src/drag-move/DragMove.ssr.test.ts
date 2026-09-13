import { afterEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';

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
});
