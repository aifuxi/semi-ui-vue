import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import { ConfigProvider } from '../config-provider';
import { Dropdown } from '../dropdown';
import { Nav, NavItem, SubNav, type NavigationWrapperData } from './index';

const items = [
  { itemKey: 'home', text: '首页' },
  { itemKey: 'manage', text: '管理', items: [{ itemKey: 'users', text: '用户' }] },
  { itemKey: 'settings', text: '设置' },
];

describe('Navigation', () => {
  it('从 items 输出固定 DOM/class/ARIA 且不修改输入', () => {
    const source = structuredClone(items);
    const wrapper = mount(Nav, {
      attrs: { class: 'attr-nav', 'data-kind': 'primary' },
      props: { className: 'named-nav', items, style: { width: '240px' } },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-navigation',
        'semi-navigation-vertical',
        'attr-nav',
        'named-nav',
      ]),
    );
    expect(wrapper.attributes('data-kind')).toBe('primary');
    expect((wrapper.element as HTMLElement).style.width).toBe('240px');
    expect(wrapper.get('ul[role="menu"]').attributes('aria-orientation')).toBe('vertical');
    expect(wrapper.findAll('[role="menuitem"]')).toHaveLength(3);
    expect(items).toEqual(source);
  });

  it('叶节点事件顺序为 select -> 全局 click -> 局部 click，重选不再 select', async () => {
    const order: string[] = [];
    const wrapper = mount(Nav, {
      props: { onClick: () => order.push('global-click'), onSelect: () => order.push('select') },
      slots: {
        default: () =>
          h(NavItem, {
            itemKey: 'leaf',
            text: 'Leaf',
            onClick: () => order.push('local-click'),
          }),
      },
    });
    await wrapper.get('.semi-navigation-item').trigger('click');
    await nextTick();
    expect(order).toEqual(['select', 'global-click', 'local-click']);
    expect(wrapper.emitted('update:selectedKeys')?.[0]?.[0]).toEqual(['leaf']);
    expect(wrapper.get('.semi-navigation-item').classes()).toContain(
      'semi-navigation-item-selected',
    );
    order.splice(0);
    await wrapper.get('.semi-navigation-item').trigger('click');
    expect(order).toEqual(['global-click', 'local-click']);
  });

  it('SubNav 非受控开合并保持 openChange -> click 顺序', async () => {
    const order: string[] = [];
    const wrapper = mount(Nav, {
      props: { onClick: () => order.push('click'), onOpenChange: () => order.push('open') },
      slots: {
        default: () =>
          h(SubNav, { itemKey: 'parent', text: 'Parent' }, () =>
            h(NavItem, { itemKey: 'child', text: 'Child' }),
          ),
      },
    });
    await wrapper.get('.semi-navigation-sub-title').trigger('click');
    await nextTick();
    expect(wrapper.get('.semi-navigation-sub-title').html()).toContain('semi-icon-chevron_down');
    expect(order).toEqual(['open', 'click']);
    expect(wrapper.emitted('update:openKeys')?.[0]?.[0]).toEqual(['parent']);
    expect(wrapper.find('.semi-navigation-sub-open').exists()).toBe(true);
  });

  it('受控 selected/open 只通知并等待父级回写', async () => {
    const wrapper = mount(Nav, { props: { items, openKeys: [], selectedKeys: ['home'] } });
    await wrapper
      .findAll('.semi-navigation-item:not(.semi-navigation-item-sub)')
      .at(1)!
      .trigger('click');
    expect(wrapper.emitted('update:selectedKeys')?.at(-1)?.[0]).toEqual(['settings']);
    expect(wrapper.find('.semi-navigation-item-selected').text()).toContain('首页');
    await wrapper.get('.semi-navigation-sub-title').trigger('click');
    expect(wrapper.emitted('update:openKeys')?.at(-1)?.[0]).toEqual(['manage']);
    expect(wrapper.find('.semi-navigation-sub-open').exists()).toBe(false);
  });

  it('模板与 h() 区分默认真值 prop 和裸 collapse-button', () => {
    const Host = defineComponent({
      components: { Nav, NavFooter: Nav.Footer, NavItem },
      template: `<div>
        <Nav><NavItem item-key="a" text="A" /></Nav>
        <Nav :limit-indent="false" :sub-nav-motion="false"><NavItem item-key="b" text="B" /><NavFooter :collapse-button="false" /></Nav>
        <Nav :limit-indent="true" :sub-nav-motion="true"><NavItem item-key="c" text="C" /><NavFooter collapse-button /></Nav>
      </div>`,
    });
    const template = mount(Host);
    expect(template.findAllComponents(Nav)).toHaveLength(3);
    expect(template.findAll('.semi-navigation-collapse-btn')).toHaveLength(1);
    const render = mount(Nav, {
      props: { limitIndent: false, subNavMotion: false },
      slots: {
        default: () => [
          h(NavItem, { itemKey: 'render', text: 'Render' }),
          h(Nav.Footer, { collapseButton: true }),
        ],
      },
    });
    expect(render.find('.semi-navigation-collapse-btn').exists()).toBe(true);
  });

  it('header/footer、link、wrapper、disabled、键盘和 locale 保持公开行为', async () => {
    const onSelect = vi.fn();
    const wrapper = mount(ConfigProvider, {
      props: {
        locale: {
          code: 'en-US',
          Navigation: {
            collapseText: 'Fold navigation',
            expandText: 'Unfold navigation',
          },
        },
      },
      slots: {
        default: () =>
          h(
            Nav,
            {
              footer: { collapseButton: true },
              header: { text: 'Brand' },
              onSelect,
            },
            {
              default: () => [
                h(NavItem, { itemKey: 'link', link: '/docs', text: 'Docs' }),
                h(NavItem, { disabled: true, itemKey: 'disabled', text: 'Disabled' }),
                h(NavItem, { itemKey: 'keyboard', text: 'Keyboard' }),
              ],
              itemWrapper: ({ itemElement }: NavigationWrapperData) =>
                h('section', { class: 'wrapped' }, [itemElement]),
            },
          ),
      },
    });
    expect(wrapper.text()).toContain('Brand');
    expect(wrapper.get('a').attributes('href')).toBe('/docs');
    expect(wrapper.findAll('.wrapped')).toHaveLength(3);
    await wrapper.findAll('.semi-navigation-item').at(1)!.trigger('click');
    expect(onSelect).not.toHaveBeenCalled();
    await wrapper.findAll('.semi-navigation-item').at(2)!.trigger('keypress', { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('Fold navigation');
  });

  it('收起 SubNav 把稳定自定义容器透传给 Dropdown 并在卸载时清理', async () => {
    const portal = document.createElement('div');
    document.body.append(portal);
    const wrapper = mount(Nav, {
      attachTo: document.body,
      props: { defaultIsCollapsed: true, getPopupContainer: () => portal },
      slots: {
        default: () =>
          h(SubNav, { itemKey: 'parent', text: 'Parent' }, () =>
            h(NavItem, { itemKey: 'child', text: 'Child' }),
          ),
      },
    });
    expect(wrapper.getComponent(Dropdown).props('getPopupContainer')?.()).toBe(portal);
    wrapper.unmount();
    await nextTick();
    expect(portal.children).toHaveLength(0);
    portal.remove();
  });
});
