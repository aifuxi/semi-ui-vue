import { mount } from '@vue/test-utils';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Resizable, ResizeGroup, ResizeHandler, ResizeItem } from './index';

const widthDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
const heightDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

function restoreDescriptor(
  name: 'offsetWidth' | 'offsetHeight',
  descriptor?: PropertyDescriptor,
): void {
  if (descriptor) Object.defineProperty(HTMLElement.prototype, name, descriptor);
  else Reflect.deleteProperty(HTMLElement.prototype, name);
}

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get(this: HTMLElement) {
      if (this.classList.contains('semi-resizable-group')) return 600;
      if (this.classList.contains('semi-resizable-handler')) return 10;
      if (this.classList.contains('semi-resizable-item')) return 295;
      if (this.classList.contains('semi-resizable-resizable')) return 100;
      return 0;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get(this: HTMLElement) {
      if (this.classList.contains('semi-resizable-group')) return 300;
      if (this.classList.contains('semi-resizable-handler')) return 10;
      if (this.classList.contains('semi-resizable-item')) return 145;
      if (this.classList.contains('semi-resizable-resizable')) return 80;
      return 0;
    },
  });
});

afterEach(() => {
  restoreDescriptor('offsetWidth', widthDescriptor);
  restoreDescriptor('offsetHeight', heightDescriptor);
  vi.restoreAllMocks();
});

describe('Resizable', () => {
  it('渲染固定根 class、默认尺寸、八方向 handler、slot 与原生属性', () => {
    const wrapper = mount(Resizable, {
      attrs: {
        'aria-label': '可伸缩区域',
        class: 'custom-resizable',
        'data-resizable': 'single',
        style: { backgroundColor: 'red' },
      },
      props: {
        defaultSize: { height: 120, width: '60%' },
        minWidth: 120,
        maxWidth: '90%',
      },
      slots: { default: () => 'Resizable content', 'handle-right': () => 'Right handle' },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-resizable-resizable', 'custom-resizable']),
    );
    expect(wrapper.attributes()).toMatchObject({
      'aria-label': '可伸缩区域',
      'data-resizable': 'single',
    });
    expect((wrapper.element as HTMLElement).style.width).toBe('60%');
    expect((wrapper.element as HTMLElement).style.height).toBe('120px');
    expect((wrapper.element as HTMLElement).style.minWidth).toBe('120px');
    expect((wrapper.element as HTMLElement).style.maxWidth).toBe('90%');
    expect((wrapper.element as HTMLElement).style.backgroundColor).toBe('red');
    expect(wrapper.findAll('.semi-resizable-resizableHandler')).toHaveLength(8);
    expect(wrapper.get('.semi-resizable-resizableHandler-right').text()).toBe('Right handle');
    expect(wrapper.text()).toContain('Resizable content');
  });

  it('支持关闭全部或特定方向，并转发 handle class/style/wrapper 契约', () => {
    const disabled = mount(Resizable, { props: { enable: false } });
    expect(disabled.find('.semi-resizable-resizableHandler').exists()).toBe(false);

    const wrapper = mount(Resizable, {
      props: {
        enable: { left: false },
        handleClass: { right: 'custom-right' },
        handleStyle: { right: { width: '24px' } },
        handleWrapperClass: 'custom-wrapper',
      },
    });
    expect(wrapper.get('.custom-wrapper').classes()).toContain('custom-wrapper');
    expect(wrapper.find('.semi-resizable-resizableHandler-left').exists()).toBe(false);
    const right = wrapper.get('.semi-resizable-resizableHandler-right');
    expect(right.classes()).toContain('custom-right');
    expect((right.element as HTMLElement).style.width).toBe('24px');
  });

  it('按 mouse 事件顺序触发 resizeStart/change/update:size/resizeEnd 并清理遮罩', async () => {
    const wrapper = mount(Resizable, {
      attachTo: document.body,
      props: { defaultSize: { width: 100, height: 80 } },
    });
    await wrapper.get('.semi-resizable-resizableHandler-right').trigger('mousedown', {
      clientX: 10,
      clientY: 10,
    });
    expect(wrapper.emitted('resizeStart')?.[0]?.[1]).toBe('right');
    expect(wrapper.find('.semi-resizable-background').exists()).toBe(true);

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 35, clientY: 10 }));
    await nextTick();
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual({ height: 80, width: 125 });
    expect(wrapper.emitted('update:size')?.[0]?.[0]).toEqual({ height: 80, width: 125 });
    expect((wrapper.element as HTMLElement).style.width).toBe('125px');

    window.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();
    expect(wrapper.emitted('resizeEnd')?.[0]?.[1]).toBeInstanceOf(MouseEvent);
    expect(wrapper.find('.semi-resizable-background').exists()).toBe(false);
    wrapper.unmount();
  });

  it('通过 beforeResizeStart 等价保留 React 返回 false 取消能力', async () => {
    const guard = vi.fn(() => false);
    const wrapper = mount(Resizable, { props: { beforeResizeStart: guard } });
    await wrapper.get('.semi-resizable-resizableHandler-bottom').trigger('mousedown');
    expect(guard).toHaveBeenCalledOnce();
    expect(wrapper.emitted('resizeStart')).toBeUndefined();
    expect(wrapper.find('.semi-resizable-background').exists()).toBe(false);
  });

  it('应用 max/min、ratio、grid 与受控 size 契约', async () => {
    const wrapper = mount(Resizable, {
      attachTo: document.body,
      props: {
        defaultSize: { width: 100, height: 80 },
        grid: [10, 10],
        maxWidth: 140,
        minWidth: 90,
        ratio: 2,
        size: { width: 100, height: 80 },
      },
    });
    await wrapper.get('.semi-resizable-resizableHandler-right').trigger('mousedown', {
      clientX: 0,
      clientY: 0,
    });
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 30, clientY: 0 }));
    await nextTick();
    expect(wrapper.emitted('update:size')?.[0]?.[0]).toEqual({ height: 80, width: 140 });
    await wrapper.setProps({ size: { width: 140, height: 80 } });
    window.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();
    expect((wrapper.element as HTMLElement).style.width).toBe('140px');
    wrapper.unmount();
  });

  it('对齐 snap、宽高比、parent bounds，并忽略没有尺寸变化的 move', async () => {
    const wrapper = mount(Resizable, {
      attachTo: document.body,
      props: {
        boundElement: 'parent',
        defaultSize: { width: 100, height: 80 },
        lockAspectRatio: true,
        snap: { x: [130] },
        snapGap: 10,
      },
      attrs: { style: { flexBasis: 'auto' } },
    });
    Object.defineProperty(wrapper.element.parentElement, 'offsetWidth', {
      configurable: true,
      value: 200,
    });
    expect(wrapper.props('snap')).toEqual({ x: [130] });

    await wrapper.get('.semi-resizable-resizableHandler-right').trigger('mousedown', {
      clientX: 0,
      clientY: 0,
    });
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    expect(wrapper.emitted('change')).toBeUndefined();

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 25, clientY: 0 }));
    await nextTick();
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual({ height: 100, width: 125 });

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 0 }));
    await nextTick();
    expect(wrapper.emitted('change')?.[1]?.[0]).toEqual({ height: 160, width: 200 });
    window.dispatchEvent(new MouseEvent('mouseup'));
    wrapper.unmount();
  });

  it('支持 touchstart/touchmove/touchend，并完整清理遮罩', async () => {
    const wrapper = mount(Resizable, {
      attachTo: document.body,
      props: { defaultSize: { width: 100, height: 80 } },
    });
    const handle = wrapper.get('.semi-resizable-resizableHandler-bottom');
    await handle.trigger('touchstart', {
      targetTouches: [{ clientX: 0, clientY: 0, target: handle.element }],
    });

    const move = new Event('touchmove', { cancelable: true });
    Object.defineProperty(move, 'targetTouches', {
      value: [{ clientX: 0, clientY: 30 }],
    });
    window.dispatchEvent(move);
    await nextTick();
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual({ height: 110, width: 100 });

    window.dispatchEvent(new Event('touchend'));
    await nextTick();
    expect(wrapper.emitted('resizeEnd')).toHaveLength(1);
    expect(wrapper.find('.semi-resizable-background').exists()).toBe(false);
    wrapper.unmount();
  });
});

describe('ResizeGroup', () => {
  it('按默认值分配组合面板，并输出固定 group/item/handler DOM 与图标', async () => {
    const wrapper = mount(ResizeGroup, {
      attachTo: document.body,
      props: { direction: 'horizontal' },
      slots: {
        default: () => [
          h(ResizeItem, { defaultSize: '50%' }, () => 'A'),
          h(ResizeHandler),
          h(ResizeItem, { defaultSize: '50%' }, () => 'B'),
        ],
      },
    });
    await nextTick();
    expect(wrapper.classes()).toContain('semi-resizable-group');
    expect((wrapper.element as HTMLElement).style.flexDirection).toBe('row');
    const items = wrapper.findAll('.semi-resizable-item');
    expect(items).toHaveLength(2);
    expect((items[0]?.element as HTMLElement).style.width).toBe('calc(50% - 5px)');
    expect((items[1]?.element as HTMLElement).style.width).toBe('calc(50% - 5px)');
    const handler = wrapper.get('.semi-resizable-handler-horizontal');
    expect(handler.find('.semi-icon-handle').exists()).toBe(true);
    wrapper.unmount();
  });

  it('拖动 group handler 时向相邻面板派发成对方向与尺寸事件', async () => {
    const previousChange = vi.fn();
    const nextChange = vi.fn();
    const wrapper = mount(ResizeGroup, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(ResizeItem, { defaultSize: '50%', onChange: previousChange }, () => 'A'),
          h(ResizeHandler),
          h(ResizeItem, { defaultSize: '50%', onChange: nextChange }, () => 'B'),
        ],
      },
    });
    await nextTick();
    await wrapper.get('.semi-resizable-handler').trigger('mousedown', { clientX: 100, clientY: 0 });
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 0 }));
    await nextTick();
    expect(previousChange).toHaveBeenCalledWith(
      { height: 145, width: 295 },
      expect.any(MouseEvent),
      'right',
    );
    expect(nextChange).toHaveBeenCalledWith(
      { height: 145, width: 295 },
      expect.any(MouseEvent),
      'left',
    );
    expect(wrapper.find('.semi-resizable-background').exists()).toBe(true);
    window.dispatchEvent(new MouseEvent('mouseup'));
    await nextTick();
    expect(wrapper.find('.semi-resizable-background').exists()).toBe(false);
    wrapper.unmount();
  });

  it('按固定百分比与数字权重分配剩余空间，并扣除相邻 handler 尺寸', async () => {
    const wrapper = mount(ResizeGroup, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(ResizeItem, { defaultSize: '25%' }, () => 'A'),
          h(ResizeHandler),
          h(ResizeItem, { defaultSize: 1 }, () => 'B'),
          h(ResizeHandler),
          h(ResizeItem, { defaultSize: '3' }, () => 'C'),
        ],
      },
    });
    await nextTick();
    const items = wrapper.findAll('.semi-resizable-item');
    expect((items[0]?.element as HTMLElement).style.width).toBe('calc(25% - 5px)');
    expect((items[1]?.element as HTMLElement).style.width).toBe('calc(18.75% - 10px)');
    expect((items[2]?.element as HTMLElement).style.width).toBe('calc(56.25% - 5px)');
    wrapper.unmount();
  });

  it('动态切换 direction，并拒绝脱离 Group 的 Item/Handler', async () => {
    const wrapper = mount(ResizeGroup, {
      props: { direction: 'horizontal' },
      slots: {
        default: () => [h(ResizeItem, () => 'A'), h(ResizeHandler), h(ResizeItem, () => 'B')],
      },
    });
    await wrapper.setProps({ direction: 'vertical' });
    await nextTick();
    expect((wrapper.element as HTMLElement).style.flexDirection).toBe('column');
    expect(wrapper.get('.semi-resizable-handler').classes()).toContain(
      'semi-resizable-handler-vertical',
    );
    expect(() => mount(ResizeItem)).toThrowError(
      'please make sure <ResizeItem> inside <ResizeGroup>',
    );
    expect(() => mount(ResizeHandler)).toThrowError(
      'please make sure <ResizeHandler> inside <ResizeGroup>',
    );
  });

  it('SSR-safe import 与渲染不依赖 window、测量或事件注册', async () => {
    const Root = {
      render: () =>
        h('div', [
          h(Resizable, { defaultSize: { width: 120, height: 80 } }, () => 'Single'),
          h(ResizeGroup, { direction: 'horizontal' }, () => [
            h(ResizeItem, { defaultSize: '50%' }, () => 'A'),
            h(ResizeHandler),
            h(ResizeItem, { defaultSize: '50%' }, () => 'B'),
          ]),
        ]),
    };
    const html = await renderToString(createSSRApp(Root));
    expect(html).toContain('semi-resizable-resizable');
    expect(html).toContain('semi-resizable-resizableHandler-right');
    expect(html).toContain('semi-resizable-group');
    expect(html).toContain('semi-resizable-handler-horizontal');
  });
});
