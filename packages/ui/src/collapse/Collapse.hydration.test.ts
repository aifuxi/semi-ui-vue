import { describe, expect, it, vi } from 'vitest';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { Collapse, CollapsePanel } from './index';

describe('Collapse hydration', () => {
  it('hydration 无警告并在无 ResizeObserver 环境继续响应受控状态', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = {
      data: () => ({ activeKey: [] as string[] }),
      render(this: { activeKey: string[] }) {
        return h(Collapse, { activeKey: this.activeKey, motion: false }, () =>
          h(CollapsePanel, { header: 'Hydrated', itemKey: '1' }, () => 'Hydrated body'),
        );
      },
    };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    vi.stubGlobal('ResizeObserver', undefined);
    const app = createSSRApp(Host);
    const vm = app.mount(container) as unknown as { activeKey: string[] };
    vm.activeKey = ['1'];
    await nextTick();
    expect(container.querySelector('.semi-collapse-header')?.getAttribute('aria-expanded')).toBe(
      'true',
    );
    expect(container.textContent).toContain('Hydrated body');
    expect(error).not.toHaveBeenCalled();
    app.unmount();
    error.mockRestore();
    vi.unstubAllGlobals();
  });
});
