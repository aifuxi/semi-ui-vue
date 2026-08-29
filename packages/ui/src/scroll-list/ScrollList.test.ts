import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ScrollItem from './ScrollItem.vue';
import ScrollList from './ScrollList.vue';
import type { ScrollItemData } from './types';

const list: ScrollItemData[] = [
  { value: 'AM', transform: () => '上午' },
  { value: 'PM' },
  { value: 'disabled', disabled: true },
];

function setGeometry(wrapper: ReturnType<typeof mount>): void {
  const outer = wrapper.get('.semi-scrolllist-list-outer').element as HTMLElement;
  const selector = wrapper.get('.semi-scrolllist-selector').element as HTMLElement;
  const items = wrapper.findAll('li').map((item) => item.element as HTMLElement);
  Object.defineProperty(outer, 'offsetHeight', { configurable: true, value: 108 });
  Object.defineProperty(outer, 'clientHeight', { configurable: true, value: 108 });
  Object.defineProperty(selector, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ top: 36, height: 36 }),
  });
  Object.defineProperty(outer, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ top: 0, height: 108 }),
  });
  items.forEach((item, index) => {
    Object.defineProperty(item, 'offsetHeight', { configurable: true, value: 36 });
    Object.defineProperty(item, 'offsetTop', { configurable: true, value: index * 36 });
    Object.defineProperty(item, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ top: index * 36, height: 36 }),
    });
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(Date.now()), 16),
  );
  vi.stubGlobal('cancelAnimationFrame', (handle: number) => window.clearTimeout(handle));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ScrollList', () => {
  it('渲染 header/body/footer、VNode prop、slot、bodyHeight 与 data 属性', () => {
    const wrapper = mount(ScrollList, {
      attrs: { 'data-kind': 'picker', title: 'filtered' },
      props: {
        bodyHeight: 240,
        class: 'vue-class',
        className: 'react-class',
        footer: h('button', 'Prop footer'),
        header: h('strong', 'Prop header'),
        prefixCls: 'custom-scroll',
        style: { width: '320px' },
      },
      slots: { header: () => h('em', 'Slot header'), default: () => h('span', 'Body') },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['custom-scroll', 'vue-class', 'react-class']),
    );
    expect(wrapper.attributes('data-kind')).toBe('picker');
    expect(wrapper.attributes('title')).toBeUndefined();
    expect(wrapper.get('.custom-scroll-header-title').text()).toBe('Slot header');
    expect(wrapper.get('.custom-scroll-body').attributes('style')).toContain('height: 240px');
    expect(wrapper.get('.custom-scroll-body').text()).toBe('Body');
    expect(wrapper.get('.custom-scroll-footer button').text()).toBe('Prop footer');
  });
});

describe('ScrollItem', () => {
  it('normal 模式保留选中、禁用、transform、ARIA 与 select payload', async () => {
    const commonTransform = vi.fn((value: unknown) => `common-${String(value)}`);
    const wrapper = mount(ScrollItem, {
      props: {
        ariaLabel: '时段',
        class: 'vue-column',
        className: 'react-column',
        list,
        mode: 'normal',
        selectedIndex: 0,
        transform: commonTransform,
        type: 7,
      },
    });

    const options = wrapper.findAll('[role="option"]');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-scrolllist-item', 'vue-column', 'react-column']),
    );
    expect(wrapper.get('[role="listbox"]').attributes('aria-label')).toBe('时段');
    expect(options[0]!.classes()).toContain('semi-scrolllist-item-sel');
    expect(options[0]!.text()).toBe('上午');
    expect(options[1]!.text()).toBe('PM');
    expect(options[2]!.attributes('aria-disabled')).toBe('true');

    await options[2]!.trigger('click');
    expect(wrapper.emitted('select')).toBeUndefined();
    await options[1]!.trigger('click');
    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual({ value: 'PM', type: 7, index: 1 });
  });

  it('selectedIndex 更新后只变换新的选中项并保持受控 class', async () => {
    const wrapper = mount(ScrollItem, {
      props: { list, mode: 'normal', selectedIndex: 0, transform: (value) => `T-${String(value)}` },
    });
    await wrapper.setProps({ selectedIndex: 1 });

    expect(wrapper.findAll('li').map((item) => item.text())).toEqual(['AM', 'T-PM', 'disabled']);
    expect(wrapper.findAll('.semi-scrolllist-item-sel')).toHaveLength(1);
    expect(wrapper.get('.semi-scrolllist-item-sel').text()).toBe('T-PM');
  });

  it('wheel 模式渲染固定 shade/selector/nocycle DOM，禁用项不选择', async () => {
    const wrapper = mount(ScrollItem, {
      props: { ariaLabel: '滚轮', list, mode: 'wheel', motion: false, selectedIndex: 0 },
    });
    await nextTick();

    expect(wrapper.classes()).toContain('semi-scrolllist-item-wheel');
    expect(wrapper.findAll('.semi-scrolllist-shade')).toHaveLength(2);
    expect(wrapper.find('.semi-scrolllist-selector').exists()).toBe(true);
    expect(wrapper.get('.semi-scrolllist-list-outer').classes()).toContain(
      'semi-scrolllist-list-outer-nocycle',
    );
    expect(wrapper.findAll('li')).toHaveLength(3);
    await wrapper.findAll('li')[2]!.trigger('click');
    await vi.advanceTimersByTimeAsync(40);
    expect(wrapper.emitted('select')).toBeUndefined();
  });

  it('wheel 点击启用项经过固定防抖后发出源索引 payload', async () => {
    const wrapper = mount(ScrollItem, {
      props: { list, mode: 'wheel', motion: false, selectedIndex: 0, type: 'period' },
    });
    await nextTick();
    setGeometry(wrapper);

    await wrapper.findAll('li')[1]!.trigger('click');
    expect(wrapper.emitted('select')).toBeUndefined();
    await vi.advanceTimersByTimeAsync(40);
    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual({
      value: 'PM',
      type: 'period',
      index: 1,
    });
  });

  it('滚动选择距离 selector 最近的未禁用项', async () => {
    const wrapper = mount(ScrollItem, {
      props: { list, mode: 'wheel', motion: false, selectedIndex: 0 },
    });
    await nextTick();
    setGeometry(wrapper);

    await wrapper.get('.semi-scrolllist-list-outer').trigger('scroll');
    await vi.advanceTimersByTimeAsync(40);
    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual({ value: 'PM', index: 1, type: undefined });
  });

  it('motion 缺省与显式 true 使用动画，显式 false 立即写入 scrollTop', async () => {
    const omitted = mount(ScrollItem, { props: { list, mode: 'wheel' } });
    const enabled = mount(ScrollItem, { props: { list, mode: 'wheel', motion: true } });
    const disabled = mount(ScrollItem, { props: { list, mode: 'wheel', motion: false } });
    await nextTick();

    for (const wrapper of [omitted, enabled, disabled]) {
      const outer = wrapper.get('.semi-scrolllist-list-outer').element as HTMLElement;
      outer.scrollTop = 0;
      (wrapper.vm as unknown as { scrollToPos(top: number, duration: number): void }).scrollToPos(
        72,
        120,
      );
    }

    expect((omitted.get('.semi-scrolllist-list-outer').element as HTMLElement).scrollTop).toBe(0);
    expect((enabled.get('.semi-scrolllist-list-outer').element as HTMLElement).scrollTop).toBe(0);
    expect((disabled.get('.semi-scrolllist-list-outer').element as HTMLElement).scrollTop).toBe(72);
    omitted.unmount();
    enabled.unmount();
    disabled.unmount();
  });

  it('cycled 根据有效几何扩展列表并在卸载后取消异步选择', async () => {
    const wrapper = mount(ScrollItem, {
      props: { cycled: true, list, mode: 'wheel', motion: false },
    });
    setGeometry(wrapper);
    await nextTick();
    await nextTick();

    expect(wrapper.get('.semi-scrolllist-list-outer').classes()).not.toContain(
      'semi-scrolllist-list-outer-nocycle',
    );
    await wrapper.get('.semi-scrolllist-list-outer').trigger('scroll');
    wrapper.unmount();
    await vi.advanceTimersByTimeAsync(100);
  });
});
