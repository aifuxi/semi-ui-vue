import { describe, expect, it, vi } from 'vitest';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { Modal } from './index';

describe('Modal hydration', () => {
  it('hidden hydration 无 mismatch', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = { render: () => h(Modal, { visible: false }) };
    const container = document.createElement('div');
    container.innerHTML = await renderToString(h(Host));
    const app = createSSRApp(Host);
    app.mount(container);

    expect(error).not.toHaveBeenCalled();
    app.unmount();
    error.mockRestore();
  });

  it('visible hydration 无 mismatch，并在挂载后迁移到 body portal', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const Host = { render: () => h(Modal, { visible: true, motion: false, title: 'Hydrate' }) };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    const app = createSSRApp(Host);
    app.mount(container);
    await nextTick();
    expect(document.body.querySelector(':scope > .semi-portal [role="dialog"]')).not.toBeNull();
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('Hydration'));
    app.unmount();
    container.remove();
    warn.mockRestore();
  });
});
