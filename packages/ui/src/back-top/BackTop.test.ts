import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import BackTop from './BackTop.vue';

describe('BackTop', () => {
  beforeEach(() => {
    let now = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => {
      now += 16;
      return now;
    });
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(now);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('超过阈值后输出固定 DOM、默认 IconButton、class/style/attrs 与 duration', async () => {
    const wrapper = mount(BackTop, {
      props: {
        className: 'compat-class',
        duration: 1,
        style: { color: 'red', marginLeft: '8px' },
        visibilityHeight: -1,
      },
      attrs: { class: 'vue-class', 'data-source': 'unit' },
    });
    await nextTick();

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-backtop', 'compat-class', 'vue-class']),
    );
    expect(wrapper.attributes()).toMatchObject({
      'data-source': 'unit',
      duration: '1',
      'x-semi-prop': 'children',
    });
    expect((wrapper.element as HTMLElement).style.color).toBe('red');
    expect((wrapper.element as HTMLElement).style.marginLeft).toBe('8px');
    const button = wrapper.get('button');
    expect(button.classes()).toEqual(
      expect.arrayContaining(['semi-button', 'semi-button-light', 'semi-button-with-icon-only']),
    );
    expect(button.get('.semi-icon').attributes('aria-label')).toBe('chevron_up');
    expect(button.get('svg').attributes('aria-hidden')).toBe('true');
  });

  it('默认 slot 替换预设按钮', async () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: -1 },
      slots: { default: '<span class="custom-back-top">自定义</span>' },
    });
    await nextTick();
    expect(wrapper.get('.custom-back-top').text()).toBe('自定义');
    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('Element target 仅在 scrollTop 严格超过 visibilityHeight 时显示', async () => {
    const target = document.createElement('div');
    const wrapper = mount(BackTop, {
      props: { target: () => target, visibilityHeight: 400 },
    });
    expect(wrapper.find('.semi-backtop').exists()).toBe(false);

    target.scrollTop = 400;
    target.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(wrapper.find('.semi-backtop').exists()).toBe(false);

    target.scrollTop = 401;
    target.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(wrapper.classes()).toContain('semi-backtop');

    target.scrollTop = 0;
    target.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(wrapper.find('.semi-backtop').exists()).toBe(false);
  });

  it('点击先把 Element target 动画到顶部并发出 click', async () => {
    const target = document.createElement('div');
    target.scrollTop = 120;
    const wrapper = mount(BackTop, {
      props: { duration: 1, target: () => target, visibilityHeight: -1 },
    });
    await nextTick();
    await wrapper.trigger('click');
    expect(target.scrollTop).toBe(0);
    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('click')?.[0]?.[0]).toBeInstanceOf(MouseEvent);
  });

  it('默认 Window target 读取 pageYOffset，并同步 body 与 documentElement 回顶', async () => {
    document.body.scrollTop = 96;
    document.documentElement.scrollTop = 96;
    vi.spyOn(window, 'pageYOffset', 'get').mockImplementation(
      () => document.documentElement.scrollTop,
    );
    const wrapper = mount(BackTop, {
      props: { duration: 1, visibilityHeight: 80 },
    });
    await nextTick();

    expect(wrapper.classes()).toContain('semi-backtop');
    await wrapper.trigger('click');
    expect(document.body.scrollTop).toBe(0);
    expect(document.documentElement.scrollTop).toBe(0);
  });

  it('按 duration 节流连续点击，并在窗口结束后接受下一次点击', async () => {
    const target = document.createElement('div');
    const wrapper = mount(BackTop, {
      props: { duration: 100, target: () => target, visibilityHeight: -1 },
    });
    await nextTick();

    await wrapper.trigger('click');
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
    await new Promise((resolve) => setTimeout(resolve, 120));
    expect(wrapper.emitted('click')).toHaveLength(2);
  });

  it('空 target 保持隐藏，卸载移除实际 target 的 scroll 监听', () => {
    const empty = mount(BackTop, { props: { target: () => null, visibilityHeight: -1 } });
    expect(empty.find('.semi-backtop').exists()).toBe(false);
    empty.unmount();

    const target = document.createElement('div');
    const add = vi.spyOn(target, 'addEventListener');
    const remove = vi.spyOn(target, 'removeEventListener');
    const wrapper = mount(BackTop, { props: { target: () => target } });
    expect(add).toHaveBeenCalledWith('scroll', expect.any(Function));
    const listener = add.mock.calls.find(([name]) => name === 'scroll')?.[1];
    wrapper.unmount();
    expect(remove).toHaveBeenCalledWith('scroll', listener);
  });
});
