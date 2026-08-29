/* eslint-disable vue/one-component-per-file -- test hosts exercise controlled state and hydration. */
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, defineComponent, h, nextTick, shallowRef } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { Button } from '../button';
import { ConfigProvider, semiGlobal } from '../config-provider';

import Popover from './Popover.vue';
import type { PopoverExposed } from './types';

async function flushPopover(): Promise<void> {
  for (let index = 0; index < 5; index += 1) {
    await nextTick();
    await vi.runOnlyPendingTimersAsync();
  }
}

describe('Popover', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.replaceChildren();
    delete semiGlobal.config.overrideDefaultProps;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.replaceChildren();
    delete semiGlobal.config.overrideDefaultProps;
    vi.restoreAllMocks();
  });

  it('SSR 只渲染 trigger，不创建 Portal', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            Popover,
            { content: 'SSR 内容', trigger: 'custom', visible: true },
            { default: () => h('button', { id: 'ssr-popover-trigger' }, '触发') },
          ),
      }),
    );

    expect(html).toContain('ssr-popover-trigger');
    expect(html).not.toContain('semi-portal');
    expect(html).not.toContain('SSR 内容');
    expect(document.body.childElementCount).toBe(0);
  });

  it('默认值渲染 bottom dialog、卡片 DOM、1030 zIndex 且无箭头', async () => {
    const wrapper = mount(Popover, {
      props: { content: '固定内容', motion: false, trigger: 'custom', visible: true },
      slots: { default: '<button id="default-trigger">打开</button>' },
    });
    await flushPopover();

    const portal = document.body.querySelector<HTMLElement>('.semi-portal');
    const popup = document.body.querySelector<HTMLElement>('.semi-popover-wrapper');
    expect(portal?.style.zIndex).toBe('1030');
    expect(popup?.getAttribute('role')).toBe('dialog');
    expect(popup?.getAttribute('x-placement')).toBe('bottom');
    expect(popup?.querySelector('.semi-popover > .semi-popover-content')?.textContent).toContain(
      '固定内容',
    );
    expect(popup?.querySelector('.semi-popover-icon-arrow')).toBeNull();
    expect(wrapper.get('#default-trigger').attributes('aria-haspopup')).toBe('dialog');
  });

  it('showArrow 渲染双层 SVG，并按箭头和浮层 style 决定颜色', async () => {
    mount(Popover, {
      props: {
        arrowStyle: { backgroundColor: 'rgb(1, 2, 3)', borderOpacity: 0.5 },
        content: '箭头内容',
        motion: false,
        position: 'right',
        showArrow: true,
        style: { borderColor: 'rgb(4, 5, 6)' },
        trigger: 'custom',
        visible: true,
      },
      slots: { default: '<button>触发</button>' },
    });
    await flushPopover();

    const arrow = document.body.querySelector<SVGElement>('.semi-popover-icon-arrow');
    const paths = arrow?.querySelectorAll('path');
    expect(arrow?.getAttribute('width')).toBe('24');
    expect(arrow?.getAttribute('height')).toBe('8');
    expect(paths).toHaveLength(2);
    expect(paths?.[0]?.getAttribute('style')).toContain('fill: rgb(4, 5, 6)');
    expect(paths?.[0]?.getAttribute('style')).toContain('opacity: 0.5');
    expect(paths?.[1]?.getAttribute('style')).toContain('fill: rgb(1, 2, 3)');
  });

  it('content 作用域 slot 优先于 prop，并可设置初始焦点', async () => {
    const wrapper = mount(Popover, {
      props: { content: '不会显示', motion: false, trigger: 'click' },
      slots: {
        content: ({ initialFocusRef }) =>
          h('input', { id: 'initial-focus', ref: initialFocusRef, value: 'slot 内容' }),
        default: '<button id="slot-trigger">打开</button>',
      },
    });
    await flushPopover();
    await wrapper.get('#slot-trigger').trigger('click');
    await flushPopover();

    expect(document.body.querySelector<HTMLInputElement>('#initial-focus')?.value).toBe(
      'slot 内容',
    );
    expect(document.activeElement?.id).toBe('initial-focus');
    expect(document.body.textContent).not.toContain('不会显示');
  });

  it('click/outside、Escape 和 v-model:visible 保持公开事件', async () => {
    const visible = shallowRef(false);
    const outside = vi.fn();
    const escape = vi.fn();
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Popover,
            {
              'onUpdate:visible': (value: boolean) => {
                visible.value = value;
              },
              content: h('button', { id: 'inside-button' }, '内容'),
              motion: false,
              onClickOutside: outside,
              onEscKeydown: escape,
              trigger: 'click',
              visible: visible.value,
            },
            { default: () => h('button', { id: 'click-trigger' }, '打开') },
          );
      },
    });
    const wrapper = mount(Host, { attachTo: document.body });

    await flushPopover();
    await wrapper.get('#click-trigger').trigger('click');
    await flushPopover();
    expect(visible.value).toBe(true);

    window.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await flushPopover();
    expect(outside).toHaveBeenCalledOnce();
    expect(visible.value).toBe(false);

    await wrapper.get('#click-trigger').trigger('click');
    await flushPopover();
    document.body
      .querySelector<HTMLElement>('.semi-popover-wrapper')!
      .dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    await flushPopover();
    expect(escape).toHaveBeenCalledOnce();
    expect(visible.value).toBe(false);
    expect(document.activeElement?.id).toBe('click-trigger');
  });

  it('condition=false 阻止普通 trigger，而 custom visible 不受影响', async () => {
    const wrapper = mount(Popover, {
      props: { condition: false, content: '禁止', motion: false },
      slots: { default: '<button id="blocked-trigger">Blocked</button>' },
    });
    await wrapper.get('#blocked-trigger').trigger('mouseenter');
    await vi.advanceTimersByTimeAsync(100);
    expect(document.body.querySelector('.semi-popover-wrapper')).toBeNull();

    wrapper.unmount();
    mount(Popover, {
      props: {
        condition: false,
        content: '禁止',
        motion: false,
        trigger: 'custom',
        visible: true,
      },
      slots: { default: '<button>Custom</button>' },
    });
    await flushPopover();
    expect(document.body.querySelector('.semi-popover-wrapper-show')?.textContent).toContain(
      '禁止',
    );
  });

  it('Popover 全局默认值只用于缺省，显式 false/true 始终优先', async () => {
    semiGlobal.config.overrideDefaultProps = {
      Popover: { autoAdjustOverflow: false, closeOnEsc: false, showArrow: true },
    };
    const inherited = mount(Popover, {
      props: { content: '继承', motion: false, trigger: 'custom', visible: true },
      slots: { default: '<button>继承</button>' },
    });
    await flushPopover();
    expect(document.body.querySelector('.semi-popover-icon-arrow')).not.toBeNull();
    inherited.unmount();

    const explicitFalse = mount(Popover, {
      props: {
        autoAdjustOverflow: true,
        closeOnEsc: true,
        content: '显式',
        motion: false,
        showArrow: false,
        trigger: 'custom',
        visible: true,
      },
      slots: { default: '<button>显式</button>' },
    });
    await flushPopover();
    expect(document.body.querySelector('.semi-popover-icon-arrow')).toBeNull();
    expect(document.body.querySelector('.semi-popover-wrapper')).not.toBeNull();
    explicitFalse.unmount();
  });

  it('稳定自定义容器首次挂载即为 Portal 父节点，并保留 RTL class', async () => {
    const target = document.createElement('div');
    target.id = 'popover-target';
    target.style.position = 'relative';
    document.body.appendChild(target);

    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl', getPopupContainer: () => target },
      slots: {
        default: () =>
          h(
            Popover,
            { content: 'RTL', motion: false, trigger: 'custom', visible: true },
            { default: () => h('button', '触发') },
          ),
      },
    });
    await flushPopover();

    expect(target.querySelector(':scope > .semi-portal')).not.toBeNull();
    expect(target.querySelector('.semi-popover-rtl')).not.toBeNull();
    expect(document.body.querySelectorAll(':scope > .semi-portal')).toHaveLength(0);
    wrapper.unmount();
    expect(target.querySelector('.semi-portal')).toBeNull();
  });

  it('公开 focusTrigger 委托到底层 trigger', async () => {
    const wrapper = mount(Popover, {
      attachTo: document.body,
      props: { content: '方法' },
      slots: { default: '<button id="method-trigger">触发</button>' },
    });
    await flushPopover();
    (wrapper.vm as unknown as PopoverExposed).focusTrigger();
    expect(document.activeElement?.id).toBe('method-trigger');
  });

  it('SSR 标记 hydration 后插入 Portal 且无 hydration 警告', async () => {
    const HydrationHost = defineComponent({
      render: () =>
        h(
          Popover,
          { content: 'Hydration', motion: false, trigger: 'custom', visible: true },
          { default: () => h(Button, { id: 'hydration-trigger' }, () => 'Hydrate') },
        ),
    });
    const serverHtml = await renderToString(createSSRApp(HydrationHost));
    const container = document.createElement('div');
    container.innerHTML = serverHtml;
    document.body.appendChild(container);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const app = createSSRApp(HydrationHost);
    app.mount(container);
    await flushPopover();

    expect(consoleError).not.toHaveBeenCalled();
    expect(container.querySelector('#hydration-trigger')).not.toBeNull();
    expect(document.body.querySelector('.semi-popover-content')?.textContent).toContain(
      'Hydration',
    );
    app.unmount();
  });
});
