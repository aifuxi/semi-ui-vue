import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, defineComponent, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { Dropdown, DropdownItem, DropdownMenu } from './index';

async function flushDropdown(): Promise<void> {
  for (let index = 0; index < 6; index += 1) {
    await nextTick();
    await vi.runOnlyPendingTimersAsync();
  }
}

describe('Dropdown SSR', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.replaceChildren();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.replaceChildren();
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
    expect(document.body.childElementCount).toBe(0);
  });

  it('SSR markup 可无 hydration 警告接管，并在客户端把 Portal 挂入稳定容器', async () => {
    const portal = document.createElement('div');
    portal.id = 'dropdown-hydration-portal';
    document.body.appendChild(portal);
    const Host = defineComponent({
      render: () =>
        h(
          Dropdown,
          {
            getPopupContainer: () => portal,
            motion: false,
            trigger: 'custom',
            visible: true,
            wrapperId: 'dropdown-hydration',
          },
          {
            content: () => h(DropdownMenu, null, () => h(DropdownItem, null, () => 'Hydrate 项')),
            default: () => h('button', { id: 'hydrate-trigger' }, 'Hydrate'),
          },
        ),
    });
    const serverHtml = await renderToString(createSSRApp(Host));
    const container = document.createElement('div');
    container.innerHTML = serverHtml;
    document.body.appendChild(container);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const app = createSSRApp(Host);
    app.mount(container);
    await flushDropdown();
    expect(consoleError).not.toHaveBeenCalled();
    expect(portal.querySelector('.semi-dropdown-wrapper-show')?.textContent).toContain(
      'Hydrate 项',
    );
    app.unmount();
    expect(portal.querySelector('.semi-portal')).toBeNull();
  });

  it('直接 mount/unmount 不遗留 Portal', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        menu: [{ name: '清理项', node: 'item' }],
        motion: false,
        trigger: 'custom',
        visible: true,
      },
      slots: { default: '<button>清理</button>' },
    });
    await flushDropdown();
    expect(document.body.querySelector('.semi-portal')).not.toBeNull();
    wrapper.unmount();
    expect(document.body.querySelector('.semi-portal')).toBeNull();
  });
});
