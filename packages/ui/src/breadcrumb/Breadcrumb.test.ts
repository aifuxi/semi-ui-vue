import { mount } from '@vue/test-utils';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IconHome } from '@workspace/icons';

import { ConfigProvider } from '../config-provider';
import { Text } from '../typography';

import Breadcrumb, { BreadcrumbItem, type BreadcrumbItemInfo } from './index';

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function defaultItems() {
  return [
    h(BreadcrumbItem, null, { default: () => 'Semi' }),
    h(BreadcrumbItem, null, { default: () => 'Breadcrumb' }),
    h(BreadcrumbItem, null, { default: () => 'Detail' }),
  ];
}

function mountBreadcrumb(
  props: Record<string, unknown> = {},
  items: () => ReturnType<typeof h>[] = defaultItems,
) {
  const wrapper = mount(Breadcrumb, { props, slots: { default: items } });
  mountedWrappers.push(wrapper);
  return wrapper;
}

afterEach(() => {
  for (const wrapper of mountedWrappers.splice(0)) wrapper.unmount();
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Breadcrumb', () => {
  it('保留 nav、compact 三态、class/style/data/ARIA 与 separator DOM', () => {
    const defaultWrapper = mountBreadcrumb({
      className: 'custom-breadcrumb',
      'data-owner': 'docs',
      style: { color: 'red' },
    });
    expect(defaultWrapper.attributes()).toMatchObject({
      'aria-label': 'Breadcrumb',
      'data-owner': 'docs',
    });
    expect(defaultWrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-breadcrumb-wrapper',
        'semi-breadcrumb-wrapper-compact',
        'custom-breadcrumb',
      ]),
    );
    expect((defaultWrapper.element as HTMLElement).style.color).toBe('red');
    expect(defaultWrapper.findAll('.semi-breadcrumb-separator')).toHaveLength(2);
    expect(defaultWrapper.findAll('.semi-breadcrumb-separator').map((node) => node.text())).toEqual(
      ['/', '/'],
    );

    expect(mountBreadcrumb({ compact: false }).classes()).toContain(
      'semi-breadcrumb-wrapper-loose',
    );
    expect(mountBreadcrumb({ compact: true }).classes()).toContain(
      'semi-breadcrumb-wrapper-compact',
    );
  });

  it('routes 保留字符串/对象、icon、href、activeIndex 与 item slot', () => {
    const home = h(IconHome);
    const wrapper = mount(Breadcrumb, {
      props: {
        activeIndex: 1,
        routes: [
          { href: '/home', icon: home, name: 'Home', path: '/' },
          { href: '/docs', name: 'Docs', path: '/docs' },
          'Detail',
        ],
      },
      slots: {
        item: ({ route }: { route: { name?: string } }) =>
          h('strong', { class: 'custom-route' }, route.name ?? 'icon'),
      },
    });
    mountedWrappers.push(wrapper);

    expect(wrapper.findAll('.semi-breadcrumb-item-wrap')).toHaveLength(3);
    expect(wrapper.get('.semi-icon-home').classes()).toContain('semi-breadcrumb-item-icon');
    expect(wrapper.get('a').attributes('href')).toBe('/home');
    const items = wrapper.findAll('.semi-breadcrumb-item');
    expect(items[1]!.element.tagName).toBe('SPAN');
    expect(items[1]!.classes()).toContain('semi-breadcrumb-item-active');
    expect(items[2]!.classes()).not.toContain('semi-breadcrumb-item-active');
    expect(wrapper.findAll('.custom-route')).toHaveLength(3);
  });

  it('Item 点击先发自身事件再发父事件，并保留 href/noLink/自定义 separator', async () => {
    const order: string[] = [];
    const wrapper = mountBreadcrumb(
      { onClick: (item: BreadcrumbItemInfo) => order.push(`parent:${String(item.name)}`) },
      () => [
        h(
          BreadcrumbItem,
          {
            href: '#semi',
            noLink: true,
            onClick: (item: BreadcrumbItemInfo) => order.push(`item:${String(item.name)}`),
            separator: '>',
          },
          { default: () => 'Semi' },
        ),
        h(BreadcrumbItem, null, { default: () => 'Detail' }),
      ],
    );

    const first = wrapper.findAll('.semi-breadcrumb-item')[0]!;
    expect(first.element.tagName).toBe('A');
    expect(first.attributes('href')).toBe('#semi');
    expect(first.classes()).not.toContain('semi-breadcrumb-item-link');
    expect(wrapper.findAll('.semi-breadcrumb-item-wrap')[0]!.text()).toContain('>');
    expect(wrapper.findAll('.semi-breadcrumb-separator')).toHaveLength(0);

    await first.trigger('click');
    expect(order).toEqual(['item:Semi', 'parent:Semi']);
    expect(wrapper.findAll('.semi-breadcrumb-item-wrap')[1]!.attributes('aria-current')).toBe(
      'page',
    );
  });

  it('autoCollapse 缺省/显式 true 折叠并支持 click/Enter，显式 false 保留全部项', async () => {
    const items = () =>
      ['一', '二', '三', '四', '五', '六'].map((name) =>
        h(BreadcrumbItem, { key: name }, { default: () => name }),
      );
    const collapsed = mountBreadcrumb({}, items);
    expect(collapsed.findAll('.semi-breadcrumb-item-wrap')).toHaveLength(5);
    collapsed.get('.semi-breadcrumb-collapse');
    expect(collapsed.text()).not.toContain('二');

    await collapsed.get('.semi-breadcrumb-item-more').trigger('keypress', { key: 'Space' });
    expect(collapsed.findAll('.semi-breadcrumb-item-wrap')).toHaveLength(5);
    await collapsed.get('.semi-breadcrumb-item-more').trigger('keypress', { key: 'Enter' });
    expect(collapsed.findAll('.semi-breadcrumb-item-wrap')).toHaveLength(6);

    const byClick = mountBreadcrumb({ autoCollapse: true }, items);
    await byClick.get('.semi-breadcrumb-item-more').trigger('click');
    expect(byClick.findAll('.semi-breadcrumb-item-wrap')).toHaveLength(6);
    expect(
      mountBreadcrumb({ autoCollapse: false }, items).findAll('.semi-breadcrumb-item-wrap'),
    ).toHaveLength(6);
  });

  it('renderMore/more slot 接收隐藏 Item，并抑制隐藏项 separator', () => {
    const routes = ['一', '二', '三', '四', '五', '六'];
    const renderMore = vi.fn((items: unknown[]) => h('b', { class: 'custom-more' }, items.length));
    const wrapper = mount(Breadcrumb, { props: { renderMore, routes } });
    mountedWrappers.push(wrapper);
    expect(renderMore).toHaveBeenCalledTimes(1);
    expect(renderMore.mock.calls[0]![0]).toHaveLength(2);
    expect(wrapper.get('.custom-more').text()).toBe('2');
    expect(wrapper.findAll('.semi-breadcrumb-separator')).toHaveLength(4);

    const slotted = mount(Breadcrumb, {
      props: { routes },
      slots: {
        more: ({ items }: { items: unknown[] }) => h('i', { class: 'slotted-more' }, items.length),
      },
    });
    mountedWrappers.push(slotted);
    expect(slotted.get('.slotted-more').text()).toBe('2');
  });

  it('showTooltip false/true/对象配置映射 Typography，并保留宽度与截断位置', () => {
    const disabled = mountBreadcrumb({ showTooltip: false });
    expect(disabled.getComponent(Text).props('ellipsis')).toEqual({
      pos: 'end',
      showTooltip: false,
    });

    const enabled = mountBreadcrumb({ showTooltip: true });
    expect(enabled.getComponent(Text).props('ellipsis')).toMatchObject({
      pos: 'end',
      showTooltip: { opts: { autoAdjustOverflow: true, position: 'top' } },
    });

    const configured = mountBreadcrumb({
      showTooltip: { ellipsisPos: 'middle', opts: { position: 'bottom' }, width: 90 },
    });
    expect(configured.getComponent(Text).props('ellipsis')).toMatchObject({
      pos: 'middle',
      showTooltip: { opts: { autoAdjustOverflow: true, position: 'bottom' } },
    });
    expect((configured.getComponent(Text).element as HTMLElement).style.maxWidth).toBe('90px');
  });

  it('moreType=popover 挂载到 ConfigProvider 自定义容器并展示隐藏项', async () => {
    vi.useFakeTimers();
    const popupContainer = document.createElement('div');
    document.body.append(popupContainer);
    const Host = defineComponent({
      setup: () => () =>
        h(
          ConfigProvider,
          { direction: 'rtl', getPopupContainer: () => popupContainer },
          {
            default: () =>
              h(Breadcrumb, {
                moreType: 'popover',
                routes: ['一', '二', '三', '四', '五', '六'],
              }),
          },
        ),
    });
    const wrapper = mount(Host, { attachTo: document.body });
    mountedWrappers.push(wrapper);
    wrapper.get('.semi-rtl');

    await nextTick();
    await wrapper.get('.semi-icon-more').trigger('mouseenter');
    await vi.advanceTimersByTimeAsync(100);
    await nextTick();
    await nextTick();
    expect(popupContainer.querySelector('.semi-popover-wrapper')).not.toBeNull();
    expect(popupContainer.querySelector('.semi-popover-content')?.textContent).toContain('二');
  });

  it('可无警告 hydration，并保持 collapse 与 active 静态结构', async () => {
    const Root = {
      render: () =>
        h(Breadcrumb, { routes: ['一', '二', '三', '四', '五'], 'aria-label': 'SSR breadcrumb' }),
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
    expect(host.querySelector('.semi-breadcrumb-collapse')).not.toBeNull();
    expect(host.querySelector('[aria-current="page"]')?.textContent).toContain('五');
    app.unmount();
  });
});
