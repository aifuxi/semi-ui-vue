import { mount } from '@vue/test-utils';
import { createSSRApp, h, nextTick, shallowRef } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  LAYOUT_RESPONSIVE_MAP,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSider,
} from './index';

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: originalMatchMedia,
  });
  vi.restoreAllMocks();
});

describe('Layout', () => {
  it('公开根组件、静态子组件与具名 Vue 子组件', () => {
    expect(Layout.Header).toBe(LayoutHeader);
    expect(Layout.Footer).toBe(LayoutFooter);
    expect(Layout.Content).toBe(LayoutContent);
    expect(Layout.Sider).toBe(LayoutSider);
  });

  it('渲染固定语义标签、class、style 与原生属性', () => {
    const wrapper = mount(Layout, {
      attrs: {
        'aria-label': '应用布局',
        class: 'custom-layout',
        'data-layout': 'root',
        role: 'presentation',
        style: { color: 'red' },
      },
      slots: {
        default: () => [
          h(LayoutHeader, { 'aria-label': '页头', class: 'custom-header' }, () => 'Header'),
          h(LayoutContent, { id: 'content' }, () => 'Content'),
          h(LayoutFooter, null, () => 'Footer'),
        ],
      },
    });

    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['semi-layout', 'custom-layout']));
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': '应用布局',
      'data-layout': 'root',
      role: 'presentation',
      style: 'color: red;',
    });
    expect(wrapper.get('header.custom-header').attributes('aria-label')).toBe('页头');
    expect(wrapper.get('main#content').classes()).toContain('semi-layout-content');
    expect(wrapper.get('footer').classes()).toContain('semi-layout-footer');
  });

  it('允许 Layout 与分区覆盖 tagName 和 prefixCls', () => {
    const wrapper = mount(Layout, {
      props: { prefixCls: 'demo-layout', tagName: 'article' },
      slots: {
        default: () => h(LayoutHeader, { prefixCls: 'demo-layout', tagName: 'div' }, () => 'H'),
      },
    });

    expect(wrapper.element.tagName).toBe('ARTICLE');
    expect(wrapper.classes()).toContain('demo-layout');
    expect(wrapper.get('div').classes()).toContain('demo-layout-header');
  });

  it('通过 hasSider 或直接 Sider 子节点切换横向布局 class', async () => {
    const visible = shallowRef(true);
    const wrapper = mount({
      setup: () => () =>
        h(Layout, null, {
          default: () => (visible.value ? [h(LayoutSider, null, () => 'Sider')] : []),
        }),
    });

    expect(wrapper.get('.semi-layout').classes()).toContain('semi-layout-has-sider');
    visible.value = false;
    await nextTick();
    expect(wrapper.get('.semi-layout').classes()).not.toContain('semi-layout-has-sider');

    await wrapper.setProps({});
    const forced = mount(Layout, { props: { hasSider: true } });
    expect(forced.classes()).toContain('semi-layout-has-sider');
  });

  it('Sider 保留固定 DOM、data 属性与 aria-label 过滤规则', () => {
    const wrapper = mount(LayoutSider, {
      attrs: {
        'aria-label': '主导航',
        class: 'custom-sider',
        'data-state': 'ready',
        id: 'ignored-id',
        role: 'navigation',
        style: { width: '120px' },
      },
      slots: { default: () => 'Sider content' },
    });

    expect(wrapper.element.tagName).toBe('ASIDE');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-layout-sider', 'custom-sider']),
    );
    expect(wrapper.attributes('aria-label')).toBe('主导航');
    expect(wrapper.attributes('data-state')).toBe('ready');
    expect(wrapper.attributes('id')).toBeUndefined();
    expect(wrapper.attributes('role')).toBeUndefined();
    expect(wrapper.attributes('style')).toBe('width: 120px;');
    expect(wrapper.get('.semi-layout-sider-children').text()).toBe('Sider content');
  });

  it('按固定顺序注册断点、立即回调并在卸载时移除监听', () => {
    const listeners = new Map<string, (event: MediaQueryListEvent) => void>();
    const removeEventListener = vi.fn();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: query === LAYOUT_RESPONSIVE_MAP.md,
        media: query,
        onchange: null,
        addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
          listeners.set(query, listener);
        },
        removeEventListener,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const wrapper = mount(LayoutSider, { props: { breakpoint: ['md', 'xs'] } });
    expect(wrapper.emitted('breakpoint')).toEqual([
      ['xs', false],
      ['md', true],
    ]);

    listeners.get(LAYOUT_RESPONSIVE_MAP.xs)?.({ matches: true } as MediaQueryListEvent);
    expect(wrapper.emitted('breakpoint')?.at(-1)).toEqual(['xs', true]);
    wrapper.unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(2);
  });

  it('在缺少 matchMedia 的环境中保持可挂载', () => {
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: undefined });
    const wrapper = mount(LayoutSider, { props: { breakpoint: ['md'] } });
    expect(wrapper.emitted('breakpoint')).toBeUndefined();
  });

  it('SSR 直接识别 Sider，并可无警告 hydration', async () => {
    const Root = {
      render: () =>
        h(
          Layout,
          { 'aria-label': 'SSR layout' },
          {
            default: () => [
              h(LayoutSider, null, () => 'Sider'),
              h(LayoutContent, null, () => 'Main'),
            ],
          },
        ),
    };
    const html = await renderToString(createSSRApp(Root));

    expect(html).toContain('semi-layout-has-sider');
    expect(html).toContain('<aside class="semi-layout-sider">');
    expect(html).toContain('<main class="semi-layout-content">');
    expect(html).toContain('Main');

    const container = document.createElement('div');
    container.innerHTML = html;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const app = createSSRApp(Root);
    app.mount(container);
    await nextTick();
    expect(consoleError).not.toHaveBeenCalled();
    app.unmount();
  });
});
