import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it, rs } from '@rstest/core';

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

  it('SSR 输出数字像素尺寸与无 mask 百分比宽度', async () => {
    const top = await renderToString(h(SideSheet, { visible: true, placement: 'top' }));
    expect(top).toContain('height:448px');
    const numeric = await renderToString(h(SideSheet, { visible: true, width: 220, mask: false }));
    expect(numeric).toContain('width:220px');
    expect(numeric).toContain('width:100%');
    const percent = await renderToString(
      h(SideSheet, { visible: true, width: '50%', mask: false }),
    );
    expect(percent).toContain('width:50%');
    expect(percent).toContain('width:100%');
  });

  it('visible hydration 无 mismatch，并在挂载后迁移到 body Portal', async () => {
    const warn = rs.spyOn(console, 'warn').mockImplementation(() => undefined);
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
