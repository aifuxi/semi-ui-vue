import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { semiGlobal } from '../config-provider';
import OverflowList from './OverflowList.vue';
import type { OverflowItem } from './types';

class TestResizeObserver {
  static instances: TestResizeObserver[] = [];
  readonly observe = vi.fn();
  readonly unobserve = vi.fn();
  readonly disconnect = vi.fn();

  constructor(readonly callback: ResizeObserverCallback) {
    TestResizeObserver.instances.push(this);
  }

  notify(target: Element): void {
    this.callback([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
}

class TestIntersectionObserver {
  static instances: TestIntersectionObserver[] = [];
  readonly observe = vi.fn();
  readonly unobserve = vi.fn();
  readonly disconnect = vi.fn();

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    TestIntersectionObserver.instances.push(this);
  }

  notify(entries: IntersectionObserverEntry[]): void {
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

const items = [{ key: 'alarm' }, { key: 'bookmark' }, { key: 'camera' }, { key: 'duration' }];

function mountList(
  props: Record<string, unknown> = {},
  width: { root: number; item: number; overflow: number } = {
    root: 100,
    item: 40,
    overflow: 20,
  },
) {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.classList.contains('semi-overflow-list-overflow')) return width.overflow;
    if (this.classList.contains('semi-overflow-list-item')) return width.item;
    if (this.classList.contains('semi-overflow-list')) return width.root;
    return 0;
  });
  return mount(OverflowList, {
    props: { items, ...props },
    slots: {
      visibleItem: ({ item, index }: { item: OverflowItem; index: number }) =>
        h('button', { class: 'token', 'data-index': index }, String(item.key)),
      overflow: ({ items: overflowItems }: { items: readonly OverflowItem[] }) =>
        h('button', { class: 'overflow-trigger' }, `+${overflowItems.length}`),
    },
  });
}

async function settleMeasurement(): Promise<void> {
  await nextTick();
  await nextTick();
  await nextTick();
}

beforeEach(() => {
  TestResizeObserver.instances = [];
  TestIntersectionObserver.instances = [];
  vi.stubGlobal('ResizeObserver', TestResizeObserver);
  vi.stubGlobal('IntersectionObserver', TestIntersectionObserver);
});

afterEach(() => {
  delete semiGlobal.config.overrideDefaultProps;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('OverflowList', () => {
  it('collapse 默认从末尾收起并按最终 pivot 触发 overflow', async () => {
    const wrapper = mountList();
    expect(wrapper.classes()).toContain('semi-overflow-list');
    expect(wrapper.attributes('style')).toContain('visibility: hidden');

    await settleMeasurement();

    expect(wrapper.findAll('.semi-overflow-list-item')).toHaveLength(2);
    expect(wrapper.findAll('.token').map((node) => node.text())).toEqual(['alarm', 'bookmark']);
    expect(wrapper.find('.overflow-trigger').text()).toBe('+2');
    expect(wrapper.attributes('style')).toContain('visibility: visible');
    expect(wrapper.emitted('overflow')?.at(-1)?.[0]).toEqual(items.slice(2));
  });

  it('collapseFrom=start 保留尾部且 minVisibleItems 优先', async () => {
    const wrapper = mountList(
      { collapseFrom: 'start', minVisibleItems: 2 },
      { root: 50, item: 40, overflow: 20 },
    );
    await settleMeasurement();

    expect(wrapper.findAll('.token').map((node) => node.text())).toEqual(['camera', 'duration']);
    expect(wrapper.element.firstElementChild?.textContent).toBe('+2');
    expect(wrapper.emitted('overflow')?.at(-1)?.[0]).toEqual(items.slice(0, 2));
  });

  it('读取全局默认但显式 prop 优先，并合并根与 wrapper 属性', async () => {
    semiGlobal.config.overrideDefaultProps = {
      OverflowList: { collapseFrom: 'start', minVisibleItems: 3 },
    };
    const wrapper = mountList(
      {
        collapseFrom: 'end',
        class: 'direct-class',
        className: 'react-class',
        style: { width: '80px' },
      },
      { root: 50, item: 40, overflow: 20 },
    );
    await settleMeasurement();

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-overflow-list', 'direct-class', 'react-class']),
    );
    expect(wrapper.attributes('style')).toContain('width: 80px');
    expect(wrapper.findAll('.token').map((node) => node.text())).toEqual([
      'alarm',
      'bookmark',
      'camera',
    ]);
  });

  it('scroll 渲染全部项目、转发 key，并按 visibleStateChange → intersect 顺序通知', async () => {
    const order: string[] = [];
    const wrapper = mountList({
      renderMode: 'scroll',
      threshold: 0.5,
      wrapperClassName: 'custom-wrapper',
      wrapperStyle: { gap: '4px' },
      onVisibleStateChange: () => order.push('visible'),
      onIntersect: () => order.push('intersect'),
    });
    await settleMeasurement();

    const scroller = wrapper.find('.semi-overflow-list-scroll-wrapper');
    expect(scroller.classes()).toContain('custom-wrapper');
    expect(scroller.attributes('style')).toContain('gap: 4px');
    expect(
      wrapper.findAll('[data-scrollkey]').map((node) => node.attributes('data-scrollkey')),
    ).toEqual(items.map((item) => item.key));

    const observer = TestIntersectionObserver.instances.at(-1)!;
    expect(observer.options?.root).toBe(scroller.element);
    expect(observer.options?.threshold).toBe(0.5);
    observer.notify(
      wrapper.findAll('[data-scrollkey]').map((node, index) => ({
        target: node.element,
        isIntersecting: index > 0 && index < 3,
        boundingClientRect: { y: 0 },
      })) as unknown as IntersectionObserverEntry[],
    );
    await nextTick();

    expect(order).toEqual(['visible', 'intersect']);
    const visible = wrapper.emitted('visibleStateChange')?.[0]?.[0] as Map<string, boolean>;
    expect([...visible.entries()]).toEqual([
      ['alarm', false],
      ['bookmark', true],
      ['camera', true],
      ['duration', false],
    ]);
    expect(wrapper.findAll('.overflow-trigger').map((node) => node.text())).toEqual(['+1', '+1']);
  });

  it('items 改变后移除旧 scroll 节点并重新观察新 key', async () => {
    const wrapper = mountList({ renderMode: 'scroll' });
    await settleMeasurement();
    await wrapper.setProps({ items: [{ key: 'alarm' }, { key: 'folder' }] });
    await settleMeasurement();

    expect(
      wrapper.findAll('[data-scrollkey]').map((node) => node.attributes('data-scrollkey')),
    ).toEqual(['alarm', 'folder']);
    expect(TestIntersectionObserver.instances.length).toBeGreaterThan(1);
  });

  it('卸载时清理 ResizeObserver 与 IntersectionObserver', async () => {
    const wrapper = mountList({ renderMode: 'scroll' });
    await settleMeasurement();
    wrapper.unmount();

    expect(
      TestResizeObserver.instances.every((observer) => observer.disconnect.mock.calls.length > 0),
    ).toBe(true);
    expect(
      TestIntersectionObserver.instances.every(
        (observer) => observer.disconnect.mock.calls.length > 0,
      ),
    ).toBe(true);
  });
});
