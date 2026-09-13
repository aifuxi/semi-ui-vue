/* eslint-disable vue/one-component-per-file -- test hosts cover ConfigProvider and reactive href contracts. */

import { mount } from '@vue/test-utils';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, defineComponent, h, nextTick, shallowRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfigProvider } from '../config-provider';
import { Text } from '../typography';

import Anchor, { AnchorLink } from './index';

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function mountAnchor(
  props: Record<string, unknown> = {},
  links: () => ReturnType<typeof h>[] = () => [
    h(AnchorLink, { href: '#welcome', title: 'Welcome' }),
    h(AnchorLink, { href: '#api', title: 'API' }),
  ],
) {
  const wrapper = mount(Anchor, { props, slots: { default: links } });
  mountedWrappers.push(wrapper);
  return wrapper;
}

afterEach(() => {
  for (const wrapper of mountedWrappers.splice(0)) wrapper.unmount();
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Anchor', () => {
  it('保留 navigation、滑轨、列表、层级、尺寸、主题、ARIA 与样式契约', async () => {
    const wrapper = mountAnchor(
      {
        className: 'custom-anchor',
        maxHeight: 50,
        maxWidth: 100,
        railTheme: 'tertiary',
        size: 'small',
        style: { color: 'red' },
      },
      () => [
        h(
          AnchorLink,
          { className: 'parent-link', href: '#parent', title: 'Parent' },
          { default: () => h(AnchorLink, { href: '#child', title: 'Child' }) },
        ),
      ],
    );
    await nextTick();

    expect(wrapper.attributes()).toMatchObject({
      role: 'navigation',
      'aria-label': 'Side navigation',
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-anchor', 'semi-anchor-size-small', 'custom-anchor']),
    );
    expect((wrapper.element as HTMLElement).style).toMatchObject({
      color: 'red',
      maxHeight: '50px',
      maxWidth: '100px',
    });
    expect(wrapper.get('.semi-anchor-slide').classes()).toContain('semi-anchor-slide-tertiary');
    expect(wrapper.get('.semi-anchor-slide').attributes('aria-hidden')).toBe('true');
    expect(wrapper.get('.semi-anchor-link-wrapper').attributes('role')).toBe('list');
    expect(wrapper.findAll('[role="listitem"]')).toHaveLength(2);
    expect(
      (wrapper.findAll('.semi-anchor-link-title')[0]!.element as HTMLElement).style.paddingLeft,
    ).toBe('8px');
    expect(
      (wrapper.findAll('.semi-anchor-link-title')[1]!.element as HTMLElement).style.paddingLeft,
    ).toBe('16px');
  });

  it('点击链接先发 change 再发 click，同一链接不重复 change，禁用链接无动作', async () => {
    const order: string[] = [];
    const wrapper = mountAnchor(
      {
        onChange: (current: string, previous: string) =>
          order.push(`change:${previous}->${current}`),
        onClick: (_event: Event, current: string) => order.push(`click:${current}`),
      },
      () => [
        h(AnchorLink, { href: '#enabled', title: 'Enabled' }),
        h(AnchorLink, { disabled: true, href: '#disabled', title: 'Disabled' }),
      ],
    );
    const links = wrapper.findAll('.semi-anchor-link-title');

    await links[0]!.trigger('click');
    await nextTick();
    expect(order).toEqual(['change:->#enabled', 'click:#enabled']);
    expect(links[0]!.classes()).toContain('semi-anchor-link-title-active');
    expect(links[0]!.attributes('aria-details')).toBe('active');
    expect(wrapper.get('.semi-anchor-slide-bar').classes()).toContain(
      'semi-anchor-slide-bar-active',
    );

    await links[0]!.trigger('keypress', { key: 'Enter' });
    expect(order).toEqual(['change:->#enabled', 'click:#enabled', 'click:#enabled']);

    await links[1]!.trigger('click');
    expect(order).toEqual(['change:->#enabled', 'click:#enabled', 'click:#enabled']);
    expect(links[1]!.attributes()).toMatchObject({ 'aria-disabled': 'true', tabindex: '0' });
    expect(links[1]!.classes()).toContain('semi-anchor-link-title-disabled');
  });

  it('autoCollapse 缺省/显式 false 保留子级，显式 true 只展开激活链', async () => {
    const nested = () => [
      h(
        AnchorLink,
        { href: '#parent', title: 'Parent' },
        { default: () => h(AnchorLink, { href: '#child', title: 'Child' }) },
      ),
      h(AnchorLink, { href: '#other', title: 'Other' }),
    ];
    expect(mountAnchor({}, nested).findAll('.semi-anchor-link-title')).toHaveLength(3);
    expect(
      mountAnchor({ autoCollapse: false }, nested).findAll('.semi-anchor-link-title'),
    ).toHaveLength(3);

    const collapsed = mountAnchor({ autoCollapse: true }, nested);
    expect(collapsed.findAll('.semi-anchor-link-title')).toHaveLength(2);
    await collapsed.findAll('.semi-anchor-link-title')[0]!.trigger('click');
    await nextTick();
    expect(collapsed.findAll('.semi-anchor-link-title')).toHaveLength(3);
    await collapsed.findAll('.semi-anchor-link-title')[1]!.trigger('click');
    await nextTick();
    expect(collapsed.findAll('.semi-anchor-link-title')).toHaveLength(3);
  });

  it('showTooltip 缺省/false/true 与对象配置保留 Typography 和 position 映射', () => {
    expect(mountAnchor().findComponent(Text).exists()).toBe(false);
    expect(mountAnchor({ showTooltip: false }).findComponent(Text).exists()).toBe(false);

    const enabled = mountAnchor({ position: 'right', showTooltip: true });
    const enabledText = enabled.getComponent(Text);
    expect(enabledText.classes()).toContain('semi-anchor-link-tooltip');
    expect(enabledText.props('ellipsis')).toEqual({
      showTooltip: { type: 'tooltip', opts: { position: 'right' } },
    });

    const configured = mountAnchor({
      position: 'bottomLeft',
      showTooltip: { type: 'popover', opts: { className: 'custom-tip', position: 'top' } },
    });
    expect(configured.getComponent(Text).props('ellipsis')).toEqual({
      showTooltip: {
        type: 'popover',
        opts: { className: 'custom-tip', position: 'bottomLeft' },
      },
    });
  });

  it('ConfigProvider RTL 改用 paddingRight，并保持 Anchor 实例隔离', async () => {
    const Host = defineComponent({
      setup: () => () =>
        h(
          ConfigProvider,
          { direction: 'rtl' },
          {
            default: () =>
              h(
                Anchor,
                {},
                {
                  default: () => h(AnchorLink, { href: '#rtl', title: 'RTL' }),
                },
              ),
          },
        ),
    });
    const wrapper = mount(Host);
    mountedWrappers.push(wrapper);
    const title = wrapper.get('.semi-anchor-link-title');
    expect((title.element as HTMLElement).style.paddingRight).toBe('8px');
    expect((title.element as HTMLElement).style.paddingLeft).toBe('');
    await title.trigger('click');
    expect(title.classes()).toContain('semi-anchor-link-title-active');
  });

  it('href 响应式更新后移除旧注册并以新值发出事件', async () => {
    const href = shallowRef('#old');
    const clicks: string[] = [];
    const Host = defineComponent({
      setup: () => () =>
        h(
          Anchor,
          { onClick: (_event: Event, current: string) => clicks.push(current) },
          { default: () => h(AnchorLink, { href: href.value, title: href.value }) },
        ),
    });
    const wrapper = mount(Host);
    mountedWrappers.push(wrapper);
    href.value = '#new';
    await nextTick();
    await wrapper.get('.semi-anchor-link-title').trigger('click');
    expect(clicks).toEqual(['#new']);
    expect(wrapper.get('.semi-anchor-link-title').attributes('title')).toBe('#new');
  });

  it('scroll 按 Element 容器几何激活链接，卸载清理监听、timer 与 ResizeObserver', async () => {
    vi.useFakeTimers();
    const container = document.createElement('div');
    const first = document.createElement('section');
    const second = document.createElement('section');
    first.id = 'first';
    second.id = 'second';
    document.body.append(container, first, second);
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({ top: 20 } as DOMRect);
    vi.spyOn(first, 'getBoundingClientRect').mockReturnValue({ top: 10 } as DOMRect);
    vi.spyOn(second, 'getBoundingClientRect').mockReturnValue({ top: 80 } as DOMRect);
    const add = vi.spyOn(container, 'addEventListener');
    const remove = vi.spyOn(container, 'removeEventListener');
    const disconnect = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        disconnect = disconnect;
      },
    );
    const changes: string[] = [];
    const wrapper = mountAnchor(
      { getContainer: () => container, onChange: (current: string) => changes.push(current) },
      () => [
        h(AnchorLink, { href: '#first', title: 'First' }),
        h(AnchorLink, { href: '#second', title: 'Second' }),
      ],
    );
    await nextTick();
    expect(add.mock.calls.filter(([event]) => event === 'scroll')).toHaveLength(2);

    container.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(101);
    await nextTick();
    expect(changes).toEqual(['#first']);
    expect(wrapper.findAll('.semi-anchor-link-title')[0]!.classes()).toContain(
      'semi-anchor-link-title-active',
    );

    wrapper.unmount();
    expect(remove.mock.calls.filter(([event]) => event === 'scroll')).toHaveLength(2);
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('defaultAnchor 在挂载时激活但不发出 change/click', async () => {
    const change = vi.fn();
    const click = vi.fn();
    const wrapper = mountAnchor({ defaultAnchor: '#api', onChange: change, onClick: click });
    await nextTick();
    await nextTick();
    expect(wrapper.findAll('.semi-anchor-link-title')[1]!.classes()).toContain(
      'semi-anchor-link-title-active',
    );
    expect(change).not.toHaveBeenCalled();
    expect(click).not.toHaveBeenCalled();
  });

  it('可无警告 hydration，并在客户端挂载运行时监听', async () => {
    const Root = {
      render: () =>
        h(
          Anchor,
          { 'aria-label': 'SSR anchor' },
          { default: () => h(AnchorLink, { href: '#hydrated', title: 'Hydrated' }) },
        ),
    };
    const host = document.createElement('div');
    host.innerHTML = await renderToString(createSSRApp(Root));
    document.body.append(host);
    const warnings: string[] = [];
    const app = createSSRApp(Root);
    app.config.warnHandler = (message) => warnings.push(message);

    app.mount(host);
    await nextTick();

    expect(warnings).toEqual([]);
    expect(host.querySelector('.semi-anchor')?.id).toMatch(/^semi-anchor-\d+$/);
    expect(host.querySelector('.semi-anchor-link-title')?.textContent).toBe('Hydrated');
    app.unmount();
  });
});
