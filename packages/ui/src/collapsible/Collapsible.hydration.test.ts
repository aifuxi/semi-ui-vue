import { describe, expect, it, vi } from 'vitest';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Collapsible from './index';

describe('Collapsible hydration', () => {
  it('hydration 后无警告并在无 ResizeObserver 环境继续响应开关', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = {
      data: () => ({ open: false }),
      render(this: { open: boolean }) {
        return h(
          Collapsible,
          { isOpen: this.open, motion: false },
          { default: () => h('p', 'hydrated') },
        );
      },
    };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    vi.stubGlobal('ResizeObserver', undefined);
    const app = createSSRApp(Host);
    const vm = app.mount(container) as unknown as { open: boolean };
    vm.open = true;
    await nextTick();
    expect(container.textContent).toContain('hydrated');
    expect(error).not.toHaveBeenCalled();
    app.unmount();
    error.mockRestore();
    vi.unstubAllGlobals();
  });
});
