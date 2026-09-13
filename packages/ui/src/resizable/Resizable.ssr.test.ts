import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { Resizable, ResizeGroup, ResizeHandler, ResizeItem } from './index';

describe('ResizeGroup', () => {
  it('SSR-safe import 与渲染不依赖 window、测量或事件注册', async () => {
    const Root = {
      render: () =>
        h('div', [
          h(Resizable, { defaultSize: { width: 120, height: 80 } }, () => 'Single'),
          h(ResizeGroup, { direction: 'horizontal' }, () => [
            h(ResizeItem, { defaultSize: '50%' }, () => 'A'),
            h(ResizeHandler),
            h(ResizeItem, { defaultSize: '50%' }, () => 'B'),
          ]),
        ]),
    };
    const html = await renderToString(createSSRApp(Root));
    expect(html).toContain('semi-resizable-resizable');
    expect(html).toContain('semi-resizable-resizableHandler-right');
    expect(html).toContain('semi-resizable-group');
    expect(html).toContain('semi-resizable-handler-horizontal');
  });
});
