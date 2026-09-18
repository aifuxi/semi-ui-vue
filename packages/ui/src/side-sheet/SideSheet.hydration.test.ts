import { describe, expect, it, vi } from 'vitest';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { SideSheet } from './index';

describe('SideSheet hydration', () => {
  it('visible hydration 无 mismatch，并在挂载后迁移到 body Portal', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const Host = {
      render: () =>
        h(SideSheet, { motion: false, title: 'Hydrate', visible: true }, () =>
          h('input', { 'data-hydrated-input': '' }),
        ),
    };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    const input = container.querySelector('input')!;
    input.value = 'Typed before hydration';
    const app = createSSRApp(Host);
    app.mount(container);
    await nextTick();
    await nextTick();
    expect(document.body.querySelector(':scope > .semi-portal [role="dialog"]')).not.toBeNull();
    expect(document.body.querySelector('.semi-portal input')).toBe(input);
    expect(input.value).toBe('Typed before hydration');
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('Hydration'));
    app.unmount();
    container.remove();
    warn.mockRestore();
  });
});
