/* eslint-disable vue/one-component-per-file -- test hosts exercise controlled state, template Boolean props, and hydration. */
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Comment,
  Fragment,
  Text,
  createSSRApp,
  defineComponent,
  h,
  nextTick,
  shallowRef,
} from 'vue';
import { renderToString } from 'vue/server-renderer';

import { Button } from '../button';
import { Input } from '../input';
import { Tag } from '../tag';
import { ConfigProvider } from '../config-provider';

import DefaultTooltip, { Tooltip } from './index';
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

  it('公开入口保持 default 与 named 导出一致', () => {
    expect(DefaultTooltip).toBe(Tooltip);
  });

  it('rePosKey 与触发器位置同次更新后使用更新后的 DOM 定位', async () => {
    const left = shallowRef(100);
    const originalRect = HTMLElement.prototype.getBoundingClientRect;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.id === 'moving-tooltip-trigger') {
        // jsdom has no layout: derive geometry from the actual rendered DOM, not the ref.
        return new DOMRect(Number.parseFloat(this.style.left), 200, 20, 20);
      }
      return originalRect.call(this);
    });
    const Host = defineComponent({
      setup: () => () =>
        h(
          Tooltip,
          {
            content: '移动提示',
            visible: true,
            trigger: 'custom',
            motion: false,
            showArrow: false,
            autoAdjustOverflow: false,
            position: 'top',
            rePosKey: left.value,
          },
          {
            default: () =>
              h(
                'button',
                {
                  id: 'moving-tooltip-trigger',
                  style: { position: 'absolute', left: `${left.value}px` },
                },
                '移动触发器',
              ),
          },
        ),
    });
    const wrapper = mount(Host, { attachTo: document.body });
    try {
      await flushTooltip();
      const portal = document.body.querySelector<HTMLElement>('.semi-portal-inner')!;
      const previousLeft = Number.parseFloat(portal.style.left);
      expect(Number.isFinite(previousLeft)).toBe(true);
      left.value = 180;
      await flushTooltip();
      expect((wrapper.get('#moving-tooltip-trigger').element as HTMLElement).style.left).toBe(
        '180px',
      );
      expect(Number.parseFloat(portal.style.left) - previousLeft).toBe(80);
    } finally {
      wrapper.unmount();
    }
  });

  it.each([undefined, 0, -1, 2])(
    '向组件触发器传入 tabIndex=%s 并支持真实焦点',
    async (tabIndex) => {
      const wrapper = mount(Tooltip, {
        attachTo: document.body,
        props: { content: 'Tag tooltip', trigger: 'focus', motion: false },
        slots: {
          default: () => h(Tag, tabIndex === undefined ? {} : { tabIndex }, () => 'Focusable tag'),
        },
      });
      await flushTooltip();
      const tag = wrapper.get('.semi-tag');
      expect(tag.attributes('tabindex')).toBe(String(tabIndex ?? 0));
      (tag.element as HTMLElement).focus();
      await flushTooltip();
      expect(document.activeElement).toBe(tag.element);
      expect(document.body.querySelector('.semi-tooltip-content')?.textContent).toBe('Tag tooltip');
      wrapper.unmount();
    },
  );

  it.each(['semi-tooltip', 'semi-dropdown'])(
    '前缀 %s 的自身动画结束清理 class，忽略冒泡动画，并可再次开关',
    async (prefixCls) => {
      const afterClose = vi.fn();
      const wrapper = mount(Tooltip, {
        props: {
          prefixCls,
          content: h('span', { id: 'animated-content' }, '动画内容'),
          trigger: 'custom',
          visible: true,
          motion: true,
          keepDOM: true,
          onAfterClose: afterClose,
        },
        slots: { default: '<button>触发</button>' },
      });
      await flushTooltip();
      const popup = document.body.querySelector<HTMLElement>(`.${prefixCls}-wrapper`)!;
      const content = popup.querySelector('#animated-content')!;
      expect(popup.querySelector(':scope > .semi-tooltip-content')).not.toBeNull();
      expect(popup.classList.contains('semi-tooltip-animation-show')).toBe(true);
      content.dispatchEvent(new Event('animationstart', { bubbles: true }));
      content.dispatchEvent(new Event('animationend', { bubbles: true }));
      await nextTick();
      expect(popup.classList.contains('semi-tooltip-animation-show')).toBe(true);
      popup.dispatchEvent(new Event('animationstart'));
      popup.dispatchEvent(new Event('animationend'));
      await nextTick();
      expect(popup.classList.contains('semi-tooltip-animation-show')).toBe(false);
      expect(popup.textContent).toContain('动画内容');
      await wrapper.setProps({ visible: false });
      await flushTooltip();
      expect(popup.classList.contains('semi-tooltip-animation-hide')).toBe(true);
      popup.dispatchEvent(new Event('animationstart'));
      popup.dispatchEvent(new Event('animationend'));
      await flushTooltip();
      expect(popup.style.display).toBe('none');
      expect(afterClose).toHaveBeenCalledOnce();
      await wrapper.setProps({ visible: true });
      await flushTooltip();
      expect(popup.classList.contains('semi-tooltip-animation-show')).toBe(true);
      popup.dispatchEvent(new Event('animationend'));
      await nextTick();
      expect(popup.classList.contains('semi-tooltip-animation-show')).toBe(false);
      wrapper.unmount();
    },
  );

  it('content slot 优先，slot 变空后回退到 content prop', async () => {
    const showSlot = shallowRef(true);
    const wrapper = mount(Tooltip, {
      props: { content: '备用内容', visible: true, trigger: 'custom', motion: false },
      slots: {
        default: '<button>触发</button>',
        content: () => (showSlot.value ? h('span', '插槽内容') : h(Comment)),
      },
    });
    await flushTooltip();
    const popup = document.body.querySelector<HTMLElement>('[role="tooltip"]')!;
    expect(popup.textContent).toContain('插槽内容');
    expect(popup.textContent).not.toContain('备用内容');
    showSlot.value = false;
    await flushTooltip();
    expect(popup.textContent).toContain('备用内容');
    expect(popup.textContent).not.toContain('插槽内容');
    wrapper.unmount();
  });

  it('箭头 slot 忽略空白和注释、展开 Fragment，并保留嵌套数组节点', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '说明', visible: true, trigger: 'custom', motion: false },
      slots: {
        default: '<button>触发</button>',
        arrow: () => [
          h(Comment),
          h(Text, null, '  '),
          h(Fragment, null, [[h('i', { class: 'nested-arrow' })]]),
        ],
      },
    });
    await flushTooltip();
    expect(document.body.querySelectorAll('.nested-arrow')).toHaveLength(1);
    expect(document.body.querySelector('.semi-tooltip-icon-arrow')).toBeNull();
    wrapper.unmount();
  });

  it.each(['background-color: red', [{ backgroundColor: 'red' }]])(
    '字符串或数组 style 保持弹层样式且默认箭头可渲染：%j',
    async (style) => {
      const wrapper = mount(Tooltip, {
        props: { content: '说明', visible: true, trigger: 'custom', motion: false, style },
        slots: { default: '<button>触发</button>' },
      });
      await flushTooltip();
      const popup = document.body.querySelector<HTMLElement>('.semi-tooltip-wrapper')!;
      expect(popup.style.backgroundColor).toBe('red');
      expect(popup.querySelector('svg')).not.toBeNull();
      wrapper.unmount();
    },
  );

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

  it('initialFocusRef 调用 Input 公开 focus 并在关闭重开后恢复输入焦点', async () => {
    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: {
        trigger: 'click',
        role: 'dialog',
        motion: false,
        closeOnEsc: true,
        returnFocusOnClose: true,
      },
      slots: {
        default: () => h(Button, { id: 'component-focus-trigger' }, () => '打开'),
        content: ({ initialFocusRef }) =>
          h('div', [
            h(Button, {}, () => '前面的可聚焦按钮'),
            h(Input, { ref: initialFocusRef, placeholder: '指定的初始焦点' }),
          ]),
      },
    });
    try {
      await flushTooltip();
      for (let opening = 0; opening < 2; opening++) {
        await wrapper.get('#component-focus-trigger').trigger('click');
        await flushTooltip();
        const input = document.body.querySelector<HTMLInputElement>(
          'input[placeholder="指定的初始焦点"]',
        )!;
        expect(input).not.toBeNull();
        expect(document.activeElement).toBe(input);
        input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
        await flushTooltip();
        expect(document.body.querySelector('.semi-tooltip-wrapper')).toBeNull();
        expect(document.activeElement).toBe(wrapper.get('#component-focus-trigger').element);
      }
    } finally {
      wrapper.unmount();
    }
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
