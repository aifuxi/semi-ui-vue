import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it, vi } from 'vitest';

import { SideSheet } from './index';

describe('SideSheet SSR', () => {
  it('hidden/visible render 不访问 DOM，并输出稳定 dialog 语义', async () => {
    const hidden = await renderToString(h(SideSheet, { visible: false }));
    expect(hidden).toContain('teleport start');
    expect(hidden).not.toContain('role="dialog"');

    const visible = await renderToString(
      h(SideSheet, { motion: false, title: 'SSR', visible: true }, () => 'Body'),
    );
    expect(visible).toContain('semi-portal');
    expect(visible).toContain('role="dialog"');
    expect(visible).toContain('role="heading"');
    expect(visible).toContain('SSR');
    expect(visible).toContain('Body');
  });

  it('visible hydration 无 mismatch，并在挂载后迁移到 body Portal', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const Host = {
      render: () => h(SideSheet, { motion: false, title: 'Hydrate', visible: true }, () => 'Body'),
    };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    const app = createSSRApp(Host);
    app.mount(container);
    await nextTick();
    await nextTick();
    expect(document.body.querySelector(':scope > .semi-portal [role="dialog"]')).not.toBeNull();
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('Hydration'));
    app.unmount();
    container.remove();
    warn.mockRestore();
  });
});
