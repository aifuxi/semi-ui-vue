import { mount } from '@vue/test-utils';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it, vi } from 'vitest';

import TabPane from './TabPane.vue';
import Tabs from './Tabs.vue';

function renderTabs(props: Record<string, unknown> = {}) {
  return renderToString(
    createSSRApp({
      render: () =>
        h(Tabs, props, () => [
          h(TabPane, { itemKey: 'a', tab: 'A' }, () => 'Panel A'),
          h(TabPane, { itemKey: 'b', tab: 'B' }, () => 'Panel B'),
        ]),
    }),
  );
}

describe('Tabs SSR', () => {
  it('根/子路径组件在无 browser globals 时稳定输出完整 ARIA DOM', async () => {
    const html = await renderTabs({ defaultActiveKey: 'b', type: 'card' });
    expect(html).toContain('semi-tabs-bar-card');
    expect(html).toContain('id="semiTabb"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('id="semiTabPanelb"');
    expect(html).toContain('Panel A');
    expect(html).toContain('Panel B');
    expect(html).not.toContain('vendor/semi-design');
  });

  it('keepDOM=false、lazyRender、left 与 collapsible 不在 SSR 创建 Observer/Portal', async () => {
    vi.stubGlobal('ResizeObserver', undefined);
    const html = await renderTabs({
      collapsible: 'auto',
      keepDOM: false,
      lazyRender: true,
      tabPosition: 'left',
    });
    expect(html).toContain('semi-tabs-left');
    expect(html).toContain('aria-orientation="vertical"');
    expect(html).toContain('Panel A');
    expect(html).not.toContain('Panel B');
    expect(html).not.toContain('semi-portal');
    vi.unstubAllGlobals();
  });

  it('SSR markup 可 hydration 且无 mismatch warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const wrapper = mount(Tabs, {
      attachTo: document.body,
      props: { defaultActiveKey: 'a' },
      slots: {
        default: () => [
          h(TabPane, { itemKey: 'a', tab: 'A' }, () => 'Panel A'),
          h(TabPane, { itemKey: 'b', tab: 'B' }, () => 'Panel B'),
        ],
      },
    });
    expect(wrapper.get('[role="tab"]').attributes('aria-selected')).toBe('true');
    expect(warn.mock.calls.flat().join(' ')).not.toContain('Hydration');
    wrapper.unmount();
  });
});
