import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { Dropdown } from './index';

describe('Dropdown SSR', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();

    vi.restoreAllMocks();
  });

  it('SSR 只输出稳定 trigger ARIA，不访问 DOM 或输出 Portal', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            Dropdown,
            {
              menu: [{ name: 'SSR 项', node: 'item' }],
              trigger: 'custom',
              visible: true,
              wrapperId: 'dropdown-ssr',
            },
            { default: () => h('button', { id: 'ssr-trigger' }, 'SSR 菜单') },
          ),
      }),
    );

    expect(html).toContain('id="ssr-trigger"');
    expect(html).toContain('aria-haspopup="true"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('data-popupid="dropdown-ssr"');
    expect(html).not.toContain('semi-portal');
    expect(html).not.toContain('SSR 项');
    expect(typeof document).toBe('undefined');
  });
});
