import { mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { semiGlobal } from '../config-provider';
import Collapsible from './Collapsible.vue';

class TestResizeObserver {
  static instances: TestResizeObserver[] = [];
  readonly observe = vi.fn();
  readonly disconnect = vi.fn();

  constructor(readonly callback: ResizeObserverCallback) {
    TestResizeObserver.instances.push(this);
  }

  notify(entry: Partial<ResizeObserverEntry>): void {
    this.callback([entry as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
}

const offsetHeightDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'offsetHeight',
);
const scrollHeightDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollHeight',
);

function content(wrapper: VueWrapper): HTMLElement {
  return wrapper.get('[x-semi-prop="children"]').element as HTMLElement;
}

function setElementHeight(element: HTMLElement, height: number): void {
  Object.defineProperties(element, {
    clientHeight: { configurable: true, value: height },
    offsetHeight: { configurable: true, value: height },
    scrollHeight: { configurable: true, value: height },
  });
}

beforeEach(() => {
  TestResizeObserver.instances = [];
  vi.stubGlobal('ResizeObserver', TestResizeObserver);
  semiGlobal.config = {};
});

afterEach(() => {
  semiGlobal.config = {};
  vi.unstubAllGlobals();
  if (offsetHeightDescriptor) {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', offsetHeightDescriptor);
  }
  if (scrollHeightDescriptor) {
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', scrollHeightDescriptor);
  }
  vi.restoreAllMocks();
});

describe('Collapsible', () => {
  it('渲染固定 wrapper/内容 DOM、默认关闭状态、data attrs 与 id', () => {
    const wrapper = mount(Collapsible, {
      attrs: {
        'aria-label': '不会落到固定 Adapter',
        class: 'attr-class',
        'data-kind': 'basic',
        style: { backgroundColor: 'red' },
      },
      props: { className: 'named', id: 'collapsible-content' },
      slots: { default: () => 'hidden content' },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-collapsible-wrapper', 'attr-class', 'named']),
    );
    expect(wrapper.attributes('data-kind')).toBe('basic');
    expect(wrapper.attributes('aria-label')).toBeUndefined();
    expect(wrapper.attributes('style')).toContain('height: 0px');
    expect(wrapper.attributes('style')).toContain('opacity: 1');
    expect(wrapper.attributes('style')).toContain('transition-duration: 0ms');
    expect((wrapper.element as HTMLElement).style.backgroundColor).toBe('red');
    expect(content(wrapper).id).toBe('collapsible-content');
    expect(content(wrapper).getAttribute('style')).toContain('overflow: hidden');
    expect(wrapper.text()).not.toContain('hidden content');
    expect(TestResizeObserver.instances[0]!.observe).toHaveBeenCalledWith(content(wrapper));
  });

  it('motion 缺省/显式 false/显式 true 与模板裸属性保持独立', async () => {
    const host = mount(
      defineComponent({
        components: { Collapsible },
        data: () => ({ open: false }),
        template: `
          <div>
            <Collapsible data-kind="default" :is-open="open"><span>default</span></Collapsible>
            <Collapsible data-kind="false" :is-open="open" :motion="false"><span>false</span></Collapsible>
            <Collapsible data-kind="true" :is-open="open" motion><span>true</span></Collapsible>
          </div>
        `,
      }),
    );
    await host.setData({ open: true });

    expect(host.get('[data-kind="default"]').classes()).toContain('semi-collapsible-transition');
    expect(host.get('[data-kind="default"]').attributes('style')).toContain(
      'transition-duration: 250ms',
    );
    expect(host.get('[data-kind="false"]').classes()).not.toContain('semi-collapsible-transition');
    expect(host.get('[data-kind="false"]').attributes('style')).toContain(
      'transition-duration: 0ms',
    );
    expect(host.get('[data-kind="true"]').classes()).toContain('semi-collapsible-transition');
  });

  it('全局默认只作用于缺省 prop，显式值保持优先', async () => {
    semiGlobal.config.overrideDefaultProps = {
      Collapsible: { duration: 80, motion: false },
    };
    const inherited = mount(Collapsible, {
      props: { isOpen: false },
      slots: { default: () => 'inherited' },
    });
    await inherited.setProps({ isOpen: true });
    expect(inherited.classes()).not.toContain('semi-collapsible-transition');
    expect(inherited.attributes('style')).toContain('transition-duration: 0ms');

    const explicit = mount(Collapsible, {
      props: { duration: 40, isOpen: false, motion: true },
      slots: { default: () => 'explicit' },
    });
    await explicit.setProps({ isOpen: true });
    expect(explicit.classes()).toContain('semi-collapsible-transition');
    expect(explicit.attributes('style')).toContain('transition-duration: 40ms');
  });

  it('motion=true 关闭时保留内容至 transitionend，再隐藏并通知', async () => {
    const onMotionEnd = vi.fn();
    const wrapper = mount(Collapsible, {
      props: { isOpen: true, onMotionEnd },
      slots: { default: () => '<visible>' },
    });
    setElementHeight(content(wrapper), 72);
    TestResizeObserver.instances[0]!.notify({
      borderBoxSize: [{ blockSize: 72, inlineSize: 240 }] as ResizeObserverSize[],
      target: content(wrapper),
    });
    await nextTick();
    expect((wrapper.element as HTMLElement).style.height).toBe('72px');

    await wrapper.setProps({ isOpen: false });
    expect(wrapper.text()).toContain('<visible>');
    expect(wrapper.classes()).toContain('semi-collapsible-transition');
    await wrapper.trigger('transitionend');
    expect(onMotionEnd).toHaveBeenCalledOnce();
    expect(wrapper.emitted('motionEnd')).toHaveLength(1);
    expect(wrapper.text()).not.toContain('<visible>');
    expect(wrapper.classes()).not.toContain('semi-collapsible-transition');
  });

  it('motion=false 立即销毁，keepDOM/lazyRender 首开后持续保留', async () => {
    const immediate = mount(Collapsible, {
      props: { isOpen: true, motion: false },
      slots: { default: () => 'immediate' },
    });
    await immediate.setProps({ isOpen: false });
    expect(immediate.text()).not.toContain('immediate');

    const retained = mount(Collapsible, {
      props: { isOpen: false, keepDOM: true, lazyRender: true, motion: false },
      slots: { default: () => 'retained' },
    });
    expect(retained.text()).not.toContain('retained');
    await retained.setProps({ isOpen: true });
    expect(retained.text()).toContain('retained');
    await retained.setProps({ isOpen: false });
    expect(retained.text()).toContain('retained');

    const eager = mount(Collapsible, {
      props: { keepDOM: true, lazyRender: false, motion: false },
      slots: { default: () => 'eager' },
    });
    expect(eager.text()).toContain('eager');
  });

  it('折叠高度、adaptive、fade 与调用方 style 遵循固定优先级', async () => {
    const wrapper = mount(Collapsible, {
      props: {
        collapseHeight: 60,
        collapseHeightAdaptive: true,
        fade: true,
      },
      slots: { default: () => 'preview' },
    });
    TestResizeObserver.instances[0]!.notify({
      borderBoxSize: [{ blockSize: 36, inlineSize: 200 }] as ResizeObserverSize[],
      target: content(wrapper),
    });
    await nextTick();
    expect((wrapper.element as HTMLElement).style.height).toBe('36px');
    expect((wrapper.element as HTMLElement).style.opacity).toBe('1');
    expect(wrapper.text()).toContain('preview');

    const faded = mount(Collapsible, {
      props: { fade: true, style: { height: '11px', transitionDuration: '9ms' } },
      slots: { default: () => 'faded' },
    });
    expect((faded.element as HTMLElement).style.height).toBe('11px');
    expect((faded.element as HTMLElement).style.opacity).toBe('0');
    expect((faded.element as HTMLElement).style.transitionDuration).toBe('9ms');
  });

  it('ResizeObserver 支持 borderBox/contentRect、隐藏树恢复与 reCalcKey 重测', async () => {
    const wrapper = mount(Collapsible, {
      props: { isOpen: true, reCalcKey: 0 },
      slots: { default: () => 'measured' },
    });
    const element = content(wrapper);
    setElementHeight(element, 42);
    const observer = TestResizeObserver.instances[0]!;

    observer.notify({
      borderBoxSize: [{ blockSize: 0, inlineSize: 0 }] as ResizeObserverSize[],
      target: element,
    });
    observer.notify({
      borderBoxSize: [{ blockSize: 31.2, inlineSize: 200 }] as ResizeObserverSize[],
      target: element,
    });
    await nextTick();
    await nextTick();
    expect((wrapper.element as HTMLElement).style.height).toBe('42px');

    Object.defineProperty(element, 'clientHeight', { configurable: true, value: 28 });
    observer.notify({
      contentRect: { height: 28, width: 200 } as DOMRectReadOnly,
      target: element,
    });
    await nextTick();
    expect((wrapper.element as HTMLElement).style.height).toBe('28px');

    Object.defineProperty(element, 'scrollHeight', { configurable: true, value: 55 });
    await wrapper.setProps({ reCalcKey: 1 });
    await nextTick();
    expect((wrapper.element as HTMLElement).style.height).toBe('55px');

    wrapper.unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });

  it('ResizeObserver 不可用时 mount 测量安全降级', async () => {
    vi.stubGlobal('ResizeObserver', undefined);
    Object.defineProperties(HTMLElement.prototype, {
      offsetHeight: { configurable: true, get: () => 48 },
      scrollHeight: { configurable: true, get: () => 48 },
    });
    const wrapper = mount(Collapsible, {
      props: { isOpen: true },
      slots: { default: () => 'fallback' },
    });
    await nextTick();
    expect((wrapper.element as HTMLElement).style.height).toBe('48px');
    expect(wrapper.text()).toContain('fallback');
  });
});
