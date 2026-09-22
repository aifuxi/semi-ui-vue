import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { Modal } from './index';

describe('Modal SSR', () => {
  it('hidden import/render 不访问 DOM，visible 输出稳定 dialog 语义', async () => {
    const hidden = await renderToString(h(Modal, { visible: false }));
    expect(hidden).not.toContain('teleport start');
    expect(hidden).not.toContain('role="dialog"');

    const visible = await renderToString(
      h(Modal, { visible: true, motion: false, title: 'SSR' }, () => 'Body'),
    );
    expect(visible).toContain('semi-portal');
    expect(visible).toContain('role="dialog"');
    expect(visible).toContain('aria-modal="true"');
    expect(visible).toContain('SSR');
    expect(visible).toContain('Body');
  });
});
