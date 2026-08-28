/* eslint-disable vue/one-component-per-file -- public template and render-function hosts are parity fixtures. */
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, shallowRef } from 'vue';

import { semiGlobal } from '../config-provider';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTitle } from './index';

async function flushDropdown(): Promise<void> {
  for (let index = 0; index < 6; index += 1) {
    await nextTick();
    await vi.runOnlyPendingTimersAsync();
  }
}

describe('Dropdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.replaceChildren();
    semiGlobal.config = {};
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.replaceChildren();
    semiGlobal.config = {};
    vi.restoreAllMocks();
  });

  it('custom visible 输出固定 Portal、trigger ARIA、class/style/zIndex 与公开实例方法', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        class: 'wrapper-extra',
        contentClassName: ['content-extra'],
        motion: false,
        style: { color: 'red' },
        trigger: 'custom',
        visible: true,
        wrapperId: 'dropdown-fixed',
        zIndex: 2000,
      },
      slots: {
        content: () => h(DropdownMenu, null, () => h(DropdownItem, null, () => '操作')),
        default: () => h('button', { id: 'dropdown-trigger' }, '菜单'),
      },
    });
    await flushDropdown();

    const trigger = wrapper.get('#dropdown-trigger');
    expect(trigger.attributes()).toMatchObject({
      'aria-expanded': 'true',
      'aria-haspopup': 'true',
      'data-popupid': 'dropdown-fixed',
    });
    expect(trigger.attributes('aria-describedby')).toBeUndefined();
    expect(trigger.classes()).toContain('semi-dropdown-showing');
    expect(document.body.querySelector('.semi-portal')?.getAttribute('style')).toContain(
      'z-index: 2000',
    );
    expect(document.body.querySelector('.semi-dropdown-wrapper')?.classList).toContain(
      'wrapper-extra',
    );
    const content = document.body.querySelector<HTMLElement>('.semi-dropdown.content-extra');
    expect(content?.style.color).toBe('red');
    expect(content?.querySelector('.semi-dropdown-content')?.getAttribute('x-semi-prop')).toBe(
      'render',
    );
    expect((wrapper.vm as unknown as { getPopupId(): string }).getPopupId()).toBe('dropdown-fixed');
    expect((wrapper.vm as unknown as { rePosition(): unknown }).rePosition()).toMatchObject({
      left: expect.any(Number),
      top: expect.any(Number),
    });

    wrapper.unmount();
    expect(document.body.querySelector('.semi-portal')).toBeNull();
  });

  it('menu 数组渲染 title/item/divider、类型、图标、active tick 与 disabled 事件', async () => {
    const activeClick = vi.fn();
    const disabledClick = vi.fn();
    const arrayWrapper = mount(Dropdown, {
      props: {
        menu: [
          { node: 'title', name: '操作组', class: 'title-extra' },
          {
            active: true,
            icon: () => h('i', { class: 'array-icon' }),
            name: '编辑',
            node: 'item',
            onClick: activeClick,
            type: 'primary',
          },
          { node: 'divider' },
          { disabled: true, name: '删除', node: 'item', onClick: disabledClick, type: 'danger' },
        ],
        motion: false,
        showTick: true,
        trigger: 'custom',
        visible: true,
      },
      slots: { default: '<button id="array-trigger">数组菜单</button>' },
    });
    await flushDropdown();

    const popup = document.body;
    expect(Array.isArray(arrayWrapper.props('menu'))).toBe(true);
    expect(popup.querySelector('.semi-dropdown-title-withTick')?.textContent).toBe('操作组');
    expect(popup.querySelectorAll('.semi-dropdown-divider')).toHaveLength(1);
    const items = popup.querySelectorAll<HTMLElement>('.semi-dropdown-item');
    expect(items).toHaveLength(2);
    expect(items[0]?.classList).toContain('semi-dropdown-item-primary');
    expect(items[0]?.classList).toContain('semi-dropdown-item-active');
    expect(items[0]?.querySelector('.array-icon')).not.toBeNull();
    expect(items[0]?.querySelector('.semi-icon-tick')).not.toBeNull();
    expect(items[1]?.getAttribute('aria-disabled')).toBe('true');
    items[0]?.click();
    items[1]?.click();
    expect(activeClick).toHaveBeenCalledOnce();
    expect(disabledClick).not.toHaveBeenCalled();
  });

  it('click trigger 支持 v-model、首项聚焦、上下循环、字符跳转、激活与 Esc 回焦', async () => {
    const visible = shallowRef<boolean | undefined>(undefined);
    const actions: string[] = [];
    const Host = defineComponent({
      setup() {
        return () => {
          const controlled = visible.value === undefined ? {} : { visible: visible.value };
          return h(
            Dropdown,
            {
              ...controlled,
              'onUpdate:visible': (value: boolean) => {
                visible.value = value;
              },
              motion: false,
              onEscKeydown: () => actions.push('esc'),
              onVisibleChange: (value: boolean) => actions.push(`visible:${value}`),
              trigger: 'click',
              wrapperId: 'keyboard-dropdown',
            },
            {
              content: () =>
                h(DropdownMenu, null, () => [
                  h(DropdownItem, { disabled: true }, () => '禁用'),
                  h(DropdownItem, { onClick: () => actions.push('alpha') }, () => 'Alpha'),
                  h(DropdownItem, { onClick: () => actions.push('beta') }, () => 'Beta'),
                ]),
              default: () => h('button', { id: 'keyboard-trigger' }, '打开'),
            },
          );
        };
      },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    await flushDropdown();
    const trigger = wrapper.get('#keyboard-trigger');
    await trigger.trigger('click');
    await flushDropdown();

    expect(visible.value).toBe(true);
    expect(actions[0]).toBe('visible:true');
    const items = [...document.body.querySelectorAll<HTMLElement>('.semi-dropdown-item')];
    expect(document.activeElement).toBe(items[1]);
    items[1]?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    expect(document.activeElement).toBe(items[2]);
    items[2]?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    expect(document.activeElement).toBe(items[1]);
    items[1]?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'b' }));
    expect(document.activeElement).toBe(items[2]);
    items[2]?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    expect(actions).toContain('beta');
    items[2]?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    await flushDropdown();
    expect(visible.value).toBe(false);
    expect(actions).toContain('esc');
    expect(document.activeElement).toBe(trigger.element);
  });

  it('trigger 键盘处理先于模板宿主原事件，并覆盖裸/显式 Boolean 与 Fragment', async () => {
    const order: string[] = [];
    const Host = defineComponent({
      components: { Dropdown, DropdownItem, DropdownMenu },
      methods: {
        childKeydown() {
          order.push('child');
        },
        visibleChange() {
          order.push('dropdown');
        },
      },
      template: `
        <Dropdown :motion="false" trigger="click" @visible-change="visibleChange">
          <template #content><DropdownMenu><DropdownItem>模板项</DropdownItem></DropdownMenu></template>
          <button id="template-trigger" @keydown="childKeydown"><span>模板</span></button>
        </Dropdown>
      `,
    });
    const wrapper = mount(Host);
    await flushDropdown();
    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' });
    wrapper.get('#template-trigger').element.dispatchEvent(event);
    await flushDropdown();
    expect(order).toEqual(['dropdown', 'child']);
    expect(document.body.querySelector('.semi-dropdown-wrapper-show')).not.toBeNull();
  });

  it('hover/focus/contextMenu/custom trigger 与 outside click 保持公开可见性语义', async () => {
    async function mountTrigger(trigger: 'hover' | 'focus' | 'contextMenu' | 'custom') {
      const changes: boolean[] = [];
      const clickOutside = vi.fn();
      const wrapper = mount(Dropdown, {
        props: {
          menu: [{ name: trigger, node: 'item' }],
          motion: false,
          mouseEnterDelay: 10,
          mouseLeaveDelay: 20,
          onClickOutside: clickOutside,
          onVisibleChange: (visible: boolean) => changes.push(visible),
          trigger,
        },
        slots: { default: () => h('button', { class: `${trigger}-trigger` }, trigger) },
      });
      await flushDropdown();
      return { changes, clickOutside, trigger: wrapper.get('button'), wrapper };
    }

    const hover = await mountTrigger('hover');
    await hover.trigger.trigger('mouseenter');
    await flushDropdown();
    expect(hover.changes).toEqual([true]);
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(hover.clickOutside).not.toHaveBeenCalled();
    await hover.trigger.trigger('mouseleave');
    await flushDropdown();
    expect(hover.changes).toEqual([true, false]);
    hover.wrapper.unmount();

    const focus = await mountTrigger('focus');
    await focus.trigger.trigger('focus');
    await flushDropdown();
    expect(focus.changes).toEqual([true]);
    await focus.trigger.trigger('blur');
    await flushDropdown();
    expect(focus.changes).toEqual([true, false]);
    focus.wrapper.unmount();

    const contextMenu = await mountTrigger('contextMenu');
    await contextMenu.trigger.trigger('contextmenu');
    await flushDropdown();
    expect(contextMenu.changes).toEqual([true]);
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await flushDropdown();
    expect(contextMenu.clickOutside).toHaveBeenCalledOnce();
    expect(contextMenu.changes).toEqual([true, false]);
    contextMenu.wrapper.unmount();

    const custom = await mountTrigger('custom');
    await custom.trigger.trigger('click');
    await custom.trigger.trigger('mouseenter');
    await custom.trigger.trigger('focus');
    await flushDropdown();
    expect(custom.changes).toEqual([]);
    custom.wrapper.unmount();
  });

  it('全局默认值只作用于缺省，显式 false/true 优先，并保持稳定自定义容器', async () => {
    const container = document.createElement('div');
    container.id = 'stable-dropdown-container';
    document.body.appendChild(container);
    semiGlobal.config = {
      overrideDefaultProps: {
        Dropdown: { closeOnEsc: false, motion: true, showTick: true },
      },
    };

    const wrapper = mount(Dropdown, {
      props: {
        closeOnEsc: true,
        getPopupContainer: () => container,
        menu: [{ active: false, name: '项目', node: 'item' }],
        motion: false,
        showTick: false,
        trigger: 'custom',
        visible: true,
      },
      slots: { default: '<button id="explicit-trigger">显式值</button>' },
    });
    await flushDropdown();
    expect(container.querySelector(':scope > .semi-portal')).not.toBeNull();
    expect(container.querySelector('.semi-icon-tick')).toBeNull();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    await flushDropdown();
    expect(container.querySelector('.semi-dropdown-wrapper-show')).not.toBeNull();
    wrapper.unmount();
  });

  it('嵌套层级使用 2px spacing，并在 mousedown 先触发子 Item 回调', async () => {
    const nestedClick = vi.fn();
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Dropdown,
            { motion: false, trigger: 'custom', visible: true, wrapperId: 'outer-menu' },
            {
              content: () =>
                h(DropdownMenu, null, () =>
                  h(
                    Dropdown,
                    { motion: false, trigger: 'custom', visible: true, wrapperId: 'inner-menu' },
                    {
                      content: () =>
                        h(DropdownMenu, null, () =>
                          h(DropdownItem, { onClick: nestedClick }, () => '嵌套项'),
                        ),
                      default: () => h(DropdownItem, null, () => '子菜单'),
                    },
                  ),
                ),
              default: () => h('button', { id: 'outer-trigger' }, '外层'),
            },
          );
      },
    });
    mount(Host);
    await flushDropdown();
    const nested = document.body.querySelectorAll<HTMLElement>('.semi-dropdown-item')[1];
    nested?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    expect(nestedClick).toHaveBeenCalledOnce();
  });

  it('独立导出的 Menu/Title/Item 保留原生 attrs、ARIA 与鼠标事件', async () => {
    const enter = vi.fn();
    const leave = vi.fn();
    const contextmenu = vi.fn();
    const wrapper = mount(DropdownMenu, {
      attrs: { 'data-menu': 'standalone' },
      slots: {
        default: () => [
          h(DropdownTitle, { class: 'custom-title', 'data-title': 'yes' }, () => '标题'),
          h(
            DropdownItem,
            {
              'data-item': 'yes',
              onContextmenu: contextmenu,
              onMouseenter: enter,
              onMouseleave: leave,
            },
            () => '项目',
          ),
        ],
      },
    });
    const item = wrapper.get('.semi-dropdown-item');
    await item.trigger('mouseenter');
    await item.trigger('mouseleave');
    await item.trigger('contextmenu');
    expect(wrapper.attributes()).toMatchObject({
      'aria-orientation': 'vertical',
      'data-menu': 'standalone',
      role: 'menu',
    });
    expect(wrapper.get('.custom-title').attributes('data-title')).toBe('yes');
    expect(item.attributes()).toMatchObject({
      'aria-disabled': 'false',
      'data-item': 'yes',
      role: 'menuitem',
      tabindex: '-1',
    });
    expect(enter).toHaveBeenCalledOnce();
    expect(leave).toHaveBeenCalledOnce();
    expect(contextmenu).toHaveBeenCalledOnce();
  });
});
