import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';

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
});
