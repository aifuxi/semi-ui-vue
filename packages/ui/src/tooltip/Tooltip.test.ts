/* eslint-disable vue/one-component-per-file -- test hosts exercise controlled state, template Boolean props, and hydration. */
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, defineComponent, h, nextTick, shallowRef } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { Button } from '../button';
import { ConfigProvider } from '../config-provider';

import Tooltip from './Tooltip.vue';
import type { TooltipExposed } from './types';

async function flushTooltip(): Promise<void> {
  for (let index = 0; index < 5; index += 1) {
    await nextTick();
    await vi.runOnlyPendingTimersAsync();
  }
}

describe('Tooltip', () => {
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

  it('SSR 只渲染 trigger，并在显式 wrapperId 下输出稳定 ARIA', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            Tooltip,
            { content: '说明', visible: true, trigger: 'custom', wrapperId: 'tip-fixed' },
            { default: () => h('button', { id: 'trigger' }, '触发器') },
          ),
      }),
    );

    expect(html).toContain('aria-describedby="tip-fixed"');
    expect(html).toContain('data-popupid="tip-fixed"');
    expect(html).not.toContain('semi-portal');
    expect(document.body.childElementCount).toBe(0);
  });

  it('custom visible 插入真实 Portal、固定 DOM、箭头和 placement', async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: '固定说明',
        motion: false,
        position: 'right',
        trigger: 'custom',
        visible: true,
        wrapperId: 'tip-right',
      },
      slots: { default: '<button id="tip-trigger">触发</button>' },
    });
    await flushTooltip();

    expect(wrapper.get('#tip-trigger').attributes('aria-describedby')).toBe('tip-right');
    const portal = document.body.querySelector('.semi-portal');
    const popup = document.body.querySelector<HTMLElement>('.semi-tooltip-wrapper');
    expect(portal).not.toBeNull();
    expect((portal as HTMLElement).style.zIndex).toBe('1060');
    expect(popup?.getAttribute('role')).toBe('tooltip');
    expect(popup?.getAttribute('x-placement')).toBe('right');
    expect(popup?.textContent).toContain('固定说明');
    expect(popup?.querySelector('svg[width="7"][height="24"]')).not.toBeNull();
    expect(wrapper.emitted('visibleChange')).toEqual([[true]]);

    wrapper.unmount();
    expect(document.body.querySelector('.semi-portal')).toBeNull();
  });

  it('hover 合并用户事件，并按 enter/leave 延迟跨 trigger 与 popup 保持可见', async () => {
    const userEnter = vi.fn();
    const wrapper = mount(Tooltip, {
      props: {
        content: 'Hover 内容',
        motion: false,
        mouseEnterDelay: 20,
        mouseLeaveDelay: 30,
      },
      slots: {
        default: () => h('button', { id: 'hover-trigger', onMouseenter: userEnter }, 'Hover'),
      },
    });
    await flushTooltip();

    const hoverTrigger = wrapper.get('#hover-trigger');
    vi.spyOn(hoverTrigger.element, 'matches').mockImplementation(
      (selector) => selector === ':hover',
    );
    await hoverTrigger.trigger('mouseenter');
    expect(userEnter).toHaveBeenCalledOnce();
    expect(document.body.querySelector('.semi-tooltip-wrapper')).toBeNull();
    await vi.advanceTimersByTimeAsync(20);
    await flushTooltip();
    expect(document.body.querySelector('.semi-tooltip-wrapper-show')).not.toBeNull();

    await hoverTrigger.trigger('mouseleave');
    await vi.advanceTimersByTimeAsync(10);
    await document.body
      .querySelector<HTMLElement>('.semi-tooltip-wrapper')!
      .dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
    await vi.advanceTimersByTimeAsync(30);
    expect(document.body.querySelector('.semi-tooltip-wrapper-show')).not.toBeNull();
  });

  it('click、outside、clickToHide 与 v-model:visible 通知公开行为', async () => {
    const visible = shallowRef<boolean | undefined>(undefined);
    const outside = vi.fn();
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Tooltip,
            {
              'onUpdate:visible': (value: boolean) => {
                visible.value = value;
              },
              clickToHide: true,
              content: h('button', { id: 'inside' }, '关闭'),
              motion: false,
              onClickOutside: outside,
              trigger: 'click',
              visible: visible.value ?? false,
            },
            { default: () => h('button', { id: 'click-trigger' }, '打开') },
          );
      },
    });
    const wrapper = mount(Host);

    await flushTooltip();
    await wrapper.get('#click-trigger').trigger('click');
    await flushTooltip();
    expect(visible.value).toBe(true);

    document.body.querySelector<HTMLElement>('#inside')!.click();
    await flushTooltip();
    expect(visible.value).toBe(false);

    await wrapper.get('#click-trigger').trigger('click');
    await flushTooltip();
    window.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await flushTooltip();
    expect(outside).toHaveBeenCalledOnce();
    expect(visible.value).toBe(false);
  });

  it('condition=false 阻止普通触发，但 custom visible 不受影响', async () => {
    const wrapper = mount(Tooltip, {
      props: { condition: false, content: '禁止', motion: false },
      slots: { default: '<button id="blocked-trigger">Blocked</button>' },
    });
    await wrapper.get('#blocked-trigger').trigger('mouseenter');
    await vi.advanceTimersByTimeAsync(100);
    expect(document.body.querySelector('.semi-tooltip-wrapper')).toBeNull();

    await wrapper.setProps({ trigger: 'custom', visible: true });
    await flushTooltip();
    expect(document.body.querySelector('.semi-tooltip-wrapper-show')).not.toBeNull();
  });

  it('focus 与 contextMenu trigger 保留延迟、阻止默认菜单和关闭行为', async () => {
    const focus = mount(Tooltip, {
      props: { content: 'Focus 内容', motion: false, trigger: 'focus' },
      slots: { default: '<button id="focus-trigger">Focus</button>' },
    });
    await flushTooltip();
    await focus.get('#focus-trigger').trigger('focus');
    await vi.advanceTimersByTimeAsync(50);
    await flushTooltip();
    expect(document.body.querySelector('.semi-tooltip-wrapper-show')?.textContent).toContain(
      'Focus 内容',
    );
    await focus.get('#focus-trigger').trigger('blur');
    await vi.advanceTimersByTimeAsync(50);
    await flushTooltip();
    expect(document.body.querySelector('.semi-tooltip-wrapper')).toBeNull();
    focus.unmount();

    const contextMenu = mount(Tooltip, {
      props: { content: '菜单说明', motion: false, trigger: 'contextMenu' },
      slots: { default: '<button id="context-trigger">Context</button>' },
    });
    await flushTooltip();
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    contextMenu.get('#context-trigger').element.dispatchEvent(event);
    await flushTooltip();
    expect(event.defaultPrevented).toBe(true);
    expect(document.body.querySelector('.semi-tooltip-wrapper-show')?.textContent).toContain(
      '菜单说明',
    );
  });

  it('自定义箭头、dialog ARIA 与公开实例方法保持 Vue 契约', async () => {
    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: {
        content: 'Dialog 内容',
        motion: false,
        returnFocusOnClose: true,
        role: 'dialog',
        trigger: 'click',
        visible: true,
        wrapperId: 'tip-dialog',
      },
      slots: {
        arrow: '<i class="custom-arrow" />',
        default: '<button id="dialog-method-trigger">打开</button>',
      },
    });
    await flushTooltip();

    const trigger = wrapper.get('#dialog-method-trigger');
    expect(trigger.attributes('aria-controls')).toBe('tip-dialog');
    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(trigger.attributes('aria-haspopup')).toBe('dialog');
    expect(document.body.querySelector('.custom-arrow')).not.toBeNull();
    expect(document.body.querySelector('.semi-tooltip-icon-arrow')).toBeNull();

    const exposed = wrapper.vm as unknown as TooltipExposed;
    expect(exposed.getPopupId()).toBe('tip-dialog');
    expect(exposed.rePosition()).toMatchObject({
      left: expect.any(Number),
      top: expect.any(Number),
      transform: expect.any(String),
    });
    exposed.focusTrigger();
    expect(document.activeElement?.id).toBe('dialog-method-trigger');
  });

  it('SSR 标记可以无 hydration 警告接管并在客户端插入 Portal', async () => {
    const HydrationHost = defineComponent({
      render: () =>
        h(
          Tooltip,
          {
            content: 'Hydration 内容',
            motion: false,
            trigger: 'custom',
            visible: true,
            wrapperId: 'tip-hydration',
          },
          { default: () => h('button', { id: 'hydration-trigger' }, 'Hydrate') },
        ),
    });
    const serverHtml = await renderToString(createSSRApp(HydrationHost));
    const container = document.createElement('div');
    container.innerHTML = serverHtml;
    document.body.appendChild(container);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const app = createSSRApp(HydrationHost);
    app.mount(container);
    await flushTooltip();

    expect(consoleError).not.toHaveBeenCalled();
    expect(container.querySelector('#hydration-trigger')).not.toBeNull();
    expect(document.body.querySelector('#tip-hydration')?.textContent).toContain('Hydration 内容');
    app.unmount();
  });

  it('文本、多节点和 disabled Button 使用 span 包裹并保留特殊样式', () => {
    const text = mount(Tooltip, {
      props: { content: '说明' },
      slots: { default: '文本触发' },
    });
    expect(text.get('span').attributes('tabindex')).toBe('0');
    expect(text.get('span').attributes('style')).toBeUndefined();

    const multiple = mount(Tooltip, {
      props: { content: '说明', wrapperClassName: 'multi-wrapper' },
      slots: { default: '<b>一</b><b>二</b>' },
    });
    expect(multiple.get('.multi-wrapper').attributes('style')).toContain('display: inline-block');

    const disabled = mount(Tooltip, {
      props: { content: '说明', wrapperClassName: 'disabled-wrapper' },
      slots: { default: () => h(Button, { disabled: true }, () => '禁用按钮') },
    });
    expect(disabled.get('.disabled-wrapper').attributes('style')).toContain('cursor: not-allowed');
    expect(disabled.get('button').attributes('style')).toContain('pointer-events: none');

    const templateDisabled = mount({
      components: { Button, Tooltip },
      template:
        '<Tooltip content="说明" wrapper-class-name="template-disabled"><Button disabled>模板禁用</Button></Tooltip>',
    });
    expect(templateDisabled.get('.template-disabled').element.tagName).toBe('SPAN');

    const noWrap = mount(Tooltip, {
      props: { content: '说明', wrapWhenSpecial: false, wrapperClassName: 'must-not-render' },
      slots: { default: () => h(Button, { disabled: true }, () => '不包裹') },
    });
    expect(noWrap.find('.must-not-render').exists()).toBe(false);
    expect(noWrap.get('button').attributes('style')).toBeUndefined();
  });

  it('ConfigProvider 提供自定义容器与 RTL Portal class', async () => {
    const target = document.createElement('div');
    target.id = 'popup-target';
    target.style.position = 'relative';
    document.body.appendChild(target);
    mount(ConfigProvider, {
      props: { direction: 'rtl', getPopupContainer: () => target },
      slots: {
        default: () =>
          h(
            Tooltip,
            { content: 'RTL', motion: false, trigger: 'custom', visible: true },
            { default: () => h('button', '触发') },
          ),
      },
    });
    await flushTooltip();

    expect(target.querySelector('.semi-portal-rtl')).not.toBeNull();
    expect(target.querySelector('.semi-tooltip-rtl')).not.toBeNull();
    expect(document.body.querySelector(':scope > .semi-portal')).toBeNull();
  });

  it('closeOnEsc、initialFocusRef、guardFocus、keepDOM 与 afterClose', async () => {
    const afterClose = vi.fn();
    const esc = vi.fn();
    const wrapper = mount(Tooltip, {
      props: {
        closeOnEsc: true,
        guardFocus: true,
        keepDOM: true,
        motion: false,
        onAfterClose: afterClose,
        onEscKeydown: esc,
        trigger: 'click',
      },
      slots: {
        content: ({ initialFocusRef }) =>
          h('div', [
            h('button', { id: 'first', ref: initialFocusRef }, '首项'),
            h('button', { id: 'last' }, '末项'),
          ]),
        default: () => h('button', { id: 'dialog-trigger' }, '打开'),
      },
    });
    await flushTooltip();
    await wrapper.get('#dialog-trigger').trigger('click');
    await flushTooltip();
    expect(document.activeElement?.id).toBe('first');

    document.body.querySelector<HTMLElement>('#last')!.focus();
    document.body
      .querySelector<HTMLElement>('.semi-portal-inner')!
      .dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }));
    expect(document.activeElement?.id).toBe('first');

    document.body
      .querySelector<HTMLElement>('.semi-portal-inner')!
      .dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    await flushTooltip();
    expect(esc).toHaveBeenCalledOnce();
    expect(afterClose).toHaveBeenCalledOnce();
    expect(document.body.querySelector<HTMLElement>('.semi-tooltip-wrapper')?.style.display).toBe(
      'none',
    );
  });
});
