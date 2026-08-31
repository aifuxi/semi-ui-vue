/* eslint-disable vue/one-component-per-file -- template/render hosts verify single-VNode ref and constrainer contracts. */
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, shallowRef } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { semiGlobal } from '../config-provider';
import DragMove from './DragMove.vue';

function mouse(
  target: EventTarget,
  type: 'mousedown' | 'mousemove' | 'mouseup',
  clientX: number,
  clientY: number,
): boolean {
  return target.dispatchEvent(
    new MouseEvent(type, { bubbles: true, cancelable: true, clientX, clientY }),
  );
}

function touch(
  target: EventTarget,
  type: 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel',
  clientX = 0,
  clientY = 0,
): boolean {
  const event = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;
  Object.defineProperty(event, 'targetTouches', {
    configurable: true,
    value: type === 'touchend' || type === 'touchcancel' ? [] : [{ clientX, clientY }],
  });
  return target.dispatchEvent(event);
}

function defineLayout(
  element: HTMLElement,
  values: Partial<
    Pick<HTMLElement, 'offsetHeight' | 'offsetLeft' | 'offsetTop' | 'offsetWidth'> & {
      offsetParent: HTMLElement | null;
    }
  >,
): void {
  for (const [key, value] of Object.entries(values)) {
    Object.defineProperty(element, key, { configurable: true, value });
  }
}

beforeEach(() => {
  semiGlobal.config = {};
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
});

afterEach(() => {
  semiGlobal.config = {};
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('DragMove', () => {
  it('不增加 wrapper，并在模板与 h() 宿主中保留原 ref', () => {
    const templateHost = mount(
      defineComponent({
        components: { DragMove },
        template: '<DragMove><div ref="child" class="drag-child">template</div></DragMove>',
      }),
    );
    const templateChild = templateHost.get('.drag-child').element as HTMLElement;
    expect(templateHost.element).toBe(templateChild);
    expect(templateHost.vm.$refs.child).toBe(templateChild);
    expect(templateChild.style.position).toBe('absolute');
    expect(templateChild.style.cursor).toBe('move');

    const child = shallowRef<HTMLElement | null>(null);
    const renderHost = mount(
      defineComponent({
        setup: () => () => h(DragMove, null, { default: () => h('button', { ref: child }, 'h') }),
      }),
    );
    expect(child.value).toBe(renderHost.get('button').element);
    expect(child.value?.style.position).toBe('absolute');
  });

  it('支持根节点为 HTMLElement 的 Vue 组件并拒绝非单元素 slot', () => {
    const Child = defineComponent({
      name: 'DragChild',
      setup: () => () => h('article', { class: 'component-child' }, 'component'),
    });
    const wrapper = mount(DragMove, { slots: { default: () => h(Child) } });
    expect((wrapper.get('.component-child').element as HTMLElement).style.position).toBe(
      'absolute',
    );

    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      mount(DragMove, { slots: { default: () => [h('span', 'one'), h('span', 'two')] } }),
    ).toThrow('DragMove requires exactly one element in the default slot');
    error.mockRestore();
  });

  it('默认值、全局覆盖和显式值优先级保持独立', async () => {
    semiGlobal.config.overrideDefaultProps = {
      DragMove: { allowInputDrag: true, positionStrategy: 'relative' },
    };
    const inheritedDown = vi.fn();
    const inheritedMove = vi.fn();
    const inherited = mount(DragMove, {
      props: { onMouseDown: inheritedDown, onMouseMove: inheritedMove },
      slots: { default: () => h('div', [h('input')]) },
    });
    const inheritedRoot = inherited.get('div').element as HTMLElement;
    expect(inheritedRoot.style.position).toBe('relative');
    mouse(inherited.get('input').element, 'mousedown', 10, 10);
    mouse(document, 'mousemove', 20, 30);
    expect(inheritedDown).toHaveBeenCalledOnce();
    expect(inheritedMove).toHaveBeenCalledOnce();

    const explicitMove = vi.fn();
    const explicit = mount(DragMove, {
      props: {
        allowInputDrag: false,
        onMouseMove: explicitMove,
        positionStrategy: 'absolute',
      },
      slots: { default: () => h('div', [h('input')]) },
    });
    expect((explicit.get('div').element as HTMLElement).style.position).toBe('absolute');
    mouse(explicit.get('input').element, 'mousedown', 10, 10);
    mouse(document, 'mousemove', 20, 30);
    expect(explicitMove).not.toHaveBeenCalled();

    await explicit.setProps({ positionStrategy: 'relative' });
    await nextTick();
    expect((explicit.get('div').element as HTMLElement).style.position).toBe('relative');
  });

  it('鼠标拖动按固定顺序通知并写入 absolute top/left', () => {
    const calls: string[] = [];
    const wrapper = mount(DragMove, {
      props: {
        onMouseDown: () => calls.push('down'),
        onMouseMove: () => calls.push('move'),
        onMouseUp: () => calls.push('up'),
      },
      slots: { default: () => h('div', 'drag') },
    });
    const element = wrapper.element as HTMLElement;
    defineLayout(element, { offsetLeft: 0, offsetTop: 0 });

    expect(mouse(element, 'mousedown', 10, 15)).toBe(false);
    mouse(document, 'mousemove', 42, 55);
    expect(element.style.left).toBe('32px');
    expect(element.style.top).toBe('40px');
    mouse(document, 'mouseup', 42, 55);
    mouse(document, 'mousemove', 60, 70);
    expect(calls).toEqual(['down', 'move', 'up']);
  });

  it('parent 与函数 constrainer 分别限制 absolute 和 relative 范围', () => {
    const absolute = mount(
      defineComponent({
        setup: () => () =>
          h('div', { class: 'parent-constrainer' }, [
            h(
              DragMove,
              { constrainer: 'parent' },
              { default: () => h('div', { class: 'absolute-child' }, 'absolute') },
            ),
          ]),
      }),
      { attachTo: document.body },
    );
    const parent = absolute.get('.parent-constrainer').element as HTMLElement;
    const absoluteChild = absolute.get('.absolute-child').element as HTMLElement;
    defineLayout(parent, { offsetHeight: 100, offsetWidth: 200 });
    defineLayout(absoluteChild, {
      offsetHeight: 30,
      offsetLeft: 20,
      offsetParent: parent,
      offsetTop: 10,
      offsetWidth: 50,
    });
    mouse(absoluteChild, 'mousedown', 30, 20);
    mouse(document, 'mousemove', 500, 500);
    expect(absoluteChild.style.left).toBe('150px');
    expect(absoluteChild.style.top).toBe('70px');
    mouse(document, 'mouseup', 500, 500);

    const relativeContainer = document.createElement('div');
    document.body.append(relativeContainer);
    const relative = mount(DragMove, {
      attachTo: relativeContainer,
      props: {
        constrainer: () => relativeContainer,
        positionStrategy: 'relative',
      },
      slots: { default: () => h('div', { style: { left: '10px', top: '5px' } }, 'relative') },
    });
    const relativeChild = relative.element as HTMLElement;
    relativeChild.getBoundingClientRect = () =>
      ({ left: 40, top: 30, right: 140, bottom: 80, width: 100, height: 50 }) as DOMRect;
    relativeContainer.getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100 }) as DOMRect;
    mouse(relativeChild, 'mousedown', 100, 100);
    mouse(document, 'mousemove', 300, 300);
    expect(relativeChild.style.left).toBe('70px');
    expect(relativeChild.style.top).toBe('25px');
  });

  it('自定义 handler 是唯一 start 入口，allowMove=false 只通知 down', () => {
    let handle: HTMLElement | null = null;
    const move = vi.fn();
    const down = vi.fn();
    const wrapper = mount(DragMove, {
      props: {
        allowMove: () => false,
        handler: () => handle,
        onMouseDown: down,
        onMouseMove: move,
      },
      slots: {
        default: () =>
          h('div', { class: 'handler-root' }, [
            h('span', { class: 'handle', ref: (value) => (handle = value as HTMLElement) }, '::'),
            h('span', { class: 'body' }, 'body'),
          ]),
      },
    });
    const root = wrapper.get('.handler-root').element as HTMLElement;
    const handler = wrapper.get('.handle').element as HTMLElement;
    expect(root.style.cursor).toBe('');
    expect(handler.style.cursor).toBe('move');

    mouse(root, 'mousedown', 0, 0);
    expect(down).not.toHaveBeenCalled();
    mouse(handler, 'mousedown', 0, 0);
    mouse(document, 'mousemove', 10, 10);
    expect(down).toHaveBeenCalledOnce();
    expect(move).not.toHaveBeenCalled();
  });

  it('input/textarea 缺省禁止拖动，显式 true 恢复且 customMove 接收计算位置', () => {
    const blockedDown = vi.fn();
    const blockedMove = vi.fn();
    const blockedUp = vi.fn();
    const blocked = mount(DragMove, {
      props: {
        onMouseDown: blockedDown,
        onMouseMove: blockedMove,
        onMouseUp: blockedUp,
      },
      slots: { default: () => h('div', [h('textarea')]) },
    });
    const textarea = blocked.get('textarea').element;
    expect(mouse(textarea, 'mousedown', 10, 10)).toBe(true);
    mouse(document, 'mousemove', 20, 20);
    mouse(document, 'mouseup', 20, 20);
    expect(blockedDown).toHaveBeenCalledOnce();
    expect(blockedMove).not.toHaveBeenCalled();
    expect(blockedUp).not.toHaveBeenCalled();

    const customMove = vi.fn();
    const allowed = mount(DragMove, {
      props: { allowInputDrag: true, customMove },
      slots: { default: () => h('div', [h('input')]) },
    });
    const allowedRoot = allowed.get('div').element as HTMLElement;
    defineLayout(allowedRoot, { offsetLeft: 0, offsetTop: 0 });
    mouse(allowed.get('input').element, 'mousedown', 5, 6);
    mouse(document, 'mousemove', 25, 36);
    expect(customMove).toHaveBeenCalledWith(allowedRoot, 30, 20);
    expect(allowedRoot.style.left).toBe('');
    expect(allowedRoot.style.top).toBe('');
  });

  it('触摸 start/move/end/cancel 与卸载清理 document 监听', () => {
    const events: string[] = [];
    const wrapper = mount(DragMove, {
      props: {
        onTouchStart: () => events.push('start'),
        onTouchMove: () => events.push('move'),
        onTouchEnd: () => events.push('end'),
        onTouchCancel: () => events.push('cancel'),
      },
      slots: { default: () => h('div', 'touch') },
    });
    const element = wrapper.element as HTMLElement;
    defineLayout(element, { offsetLeft: 0, offsetTop: 0 });
    expect(touch(element, 'touchstart', 10, 10)).toBe(false);
    touch(document, 'touchmove', 30, 40);
    expect(element.style.left).toBe('20px');
    expect(element.style.top).toBe('30px');
    touch(document, 'touchend');
    expect(events).toEqual(['start', 'move', 'end']);

    touch(element, 'touchstart', 30, 40);
    touch(document, 'touchcancel');
    expect(events.slice(-2)).toEqual(['start', 'cancel']);

    touch(element, 'touchstart', 30, 40);
    wrapper.unmount();
    touch(document, 'touchmove', 60, 70);
    touch(document, 'touchend');
    expect(events.slice(-1)).toEqual(['start']);
  });
});
