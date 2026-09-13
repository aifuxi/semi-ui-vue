/* eslint-disable vue/one-component-per-file -- template and render hosts are both parity gates. */

import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Carousel from './Carousel.vue';
import type { CarouselMethods } from './types';

const slides = {
  default: () => [
    h('section', { class: 'original', style: { backgroundColor: 'red' } }, 'one'),
    h('section', 'two'),
    h('section', 'three'),
  ],
};

function methods(wrapper: ReturnType<typeof mount>): CarouselMethods {
  return wrapper.vm as unknown as CarouselMethods;
}

afterEach(() => {
  vi.useRealTimers();
});

describe('Carousel', () => {
  it('渲染固定 DOM/class、默认值并合并子 VNode 的 class/style', () => {
    const wrapper = mount(Carousel, {
      props: {
        autoPlay: false,
        className: 'named',
        class: 'prop-class',
        style: { width: '600px' },
      },
      attrs: { 'data-root': 'carousel' },
      slots: slides,
    });
    expect(wrapper.get('.semi-carousel').classes()).toEqual(
      expect.arrayContaining(['semi-carousel', 'named', 'prop-class']),
    );
    expect(wrapper.get('.semi-carousel').attributes()).toMatchObject({ 'data-root': 'carousel' });
    expect(wrapper.get('.semi-carousel').attributes('style')).toContain('width: 600px');
    expect(wrapper.get('.semi-carousel-content').classes()).toContain(
      'semi-carousel-content-slide',
    );
    const items = wrapper.findAll('.semi-carousel-content-item');
    expect(items).toHaveLength(3);
    expect(items[0]!.classes()).toEqual(
      expect.arrayContaining([
        'original',
        'semi-carousel-content-item-active',
        'semi-carousel-content-item-current',
      ]),
    );
    expect(items[0]!.attributes('style')).toContain('background-color: red');
    expect(items[0]!.attributes('style')).toContain('animation-duration: 300ms');
    expect(items[1]!.classes()).toContain('semi-carousel-content-item-next');
    expect(items[2]!.classes()).toContain('semi-carousel-content-item-prev');
    expect(wrapper.findAll('.semi-carousel-indicator-item')).toHaveLength(3);
    expect(wrapper.find('.semi-carousel-arrow').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Previous index"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Next index"]').exists()).toBe(true);
  });

  it('缺省、显式 false、显式 true 与模板裸 Boolean 保持独立', async () => {
    vi.useFakeTimers();
    const host = mount(
      defineComponent({
        components: { Carousel },
        template: `
          <div>
            <Carousel data-kind="default"><div>A</div><div>B</div></Carousel>
            <Carousel data-kind="false" :auto-play="false" :show-arrow="false" :show-indicator="false"><div>A</div><div>B</div></Carousel>
            <Carousel data-kind="true" auto-play show-arrow show-indicator><div>A</div><div>B</div></Carousel>
          </div>
        `,
      }),
    );
    expect(host.find('[data-kind="default"] .semi-carousel-arrow').exists()).toBe(true);
    expect(host.find('[data-kind="false"] .semi-carousel-arrow').exists()).toBe(false);
    expect(host.find('[data-kind="false"] .semi-carousel-indicator').exists()).toBe(false);
    expect(host.find('[data-kind="true"] .semi-carousel-arrow').exists()).toBe(true);
    await vi.advanceTimersByTimeAsync(2300);
    await nextTick();
    expect(host.get('[data-kind="default"] .semi-carousel-content-item-active').text()).toBe('B');
    expect(host.get('[data-kind="false"] .semi-carousel-content-item-active').text()).toBe('A');
    expect(host.get('[data-kind="true"] .semi-carousel-content-item-active').text()).toBe('B');
    host.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('箭头循环切换并按 previous -> change -> active 的公开顺序更新', async () => {
    const change = vi.fn();
    const wrapper = mount(Carousel, {
      props: { autoPlay: false, onChange: change },
      slots: slides,
    });
    await wrapper.get('.semi-carousel-arrow-prev').trigger('click');
    expect(change).toHaveBeenLastCalledWith(2, 0);
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('three');
    expect(wrapper.get('.semi-carousel-content-item-slide-out').text()).toBe('one');
    expect(wrapper.get('.semi-carousel-content-item-slide-in').text()).toBe('three');
    expect(wrapper.get('.semi-carousel-content').classes()).toContain(
      'semi-carousel-content-reverse',
    );
    await wrapper.get('.semi-carousel-arrow-next').trigger('click');
    expect(change).toHaveBeenLastCalledWith(0, 2);
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('one');
  });

  it('受控 activeIndex 只通知，等待父级更新后才改变可见项', async () => {
    const change = vi.fn();
    const wrapper = mount(Carousel, {
      props: { activeIndex: 1, autoPlay: false, onChange: change },
      slots: slides,
    });
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('two');
    await wrapper.get('.semi-carousel-arrow-next').trigger('click');
    expect(change).toHaveBeenCalledWith(2, 1);
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('two');
    await wrapper.setProps({ activeIndex: 2 });
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('three');
  });

  it('指示器分别支持 click 与 hover，保留主题、位置、尺寸和类型 class', async () => {
    const click = mount(Carousel, {
      props: {
        autoPlay: false,
        indicatorPosition: 'left',
        indicatorSize: 'medium',
        indicatorType: 'line',
        theme: 'dark',
      },
      slots: slides,
    });
    const indicator = click.get('.semi-carousel-indicator-line');
    expect(indicator.classes()).toContain('semi-carousel-indicator-left');
    expect(indicator.get('[data-index="0"]').classes()).toEqual(
      expect.arrayContaining([
        'semi-carousel-indicator-item-medium',
        'semi-carousel-indicator-item-dark',
      ]),
    );
    await indicator.get('[data-index="2"]').trigger('click');
    expect(click.get('.semi-carousel-content-item-active').text()).toBe('three');

    const hover = mount(Carousel, {
      props: { autoPlay: false, trigger: 'hover', indicatorType: 'columnar' },
      slots: slides,
    });
    await hover.get('[data-index="1"]').trigger('mouseenter');
    expect(hover.get('.semi-carousel-content-item-active').text()).toBe('two');
  });

  it('自定义箭头 prop/slot 保留 attrs，且调用方 onClick 按固定 Adapter 覆盖内部切换', async () => {
    const customClick = vi.fn();
    const wrapper = mount(Carousel, {
      props: {
        autoPlay: false,
        arrowProps: {
          leftArrow: {
            children: h('strong', 'prop-left'),
            props: {
              'aria-label': 'custom previous',
              className: 'custom-left',
              onClick: customClick,
            },
          },
          rightArrow: { children: h('strong', 'prop-right') },
        },
      },
      slots: {
        ...slides,
        rightArrow: () => h('em', 'slot-right'),
      },
    });
    const left = wrapper.get('[aria-label="custom previous"]');
    expect(left.classes()).toContain('custom-left');
    expect(left.attributes('aria-label')).toBe('custom previous');
    expect(left.text()).toBe('prop-left');
    expect(wrapper.get('.semi-carousel-arrow-next').text()).toBe('slot-right');
    await left.trigger('click');
    expect(customClick).toHaveBeenCalledTimes(1);
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('one');
  });

  it('公开方法覆盖 goTo/prev/next/play/stop，并规范化越界索引', async () => {
    vi.useFakeTimers();
    const change = vi.fn();
    const wrapper = mount(Carousel, {
      props: { autoPlay: false, speed: 0, onChange: change },
      slots: slides,
    });
    methods(wrapper).goTo(-1);
    await nextTick();
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('three');
    methods(wrapper).goTo(4);
    await nextTick();
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('two');
    methods(wrapper).prev();
    methods(wrapper).next();
    await nextTick();
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('two');
    methods(wrapper).play();
    await vi.advanceTimersByTimeAsync(2000);
    await nextTick();
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('three');
    methods(wrapper).stop();
    await vi.advanceTimersByTimeAsync(4000);
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('three');
    expect(change).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('hoverToPause=true 经 400ms 暂停并在离开后恢复，卸载清理 debounce/interval', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Carousel, {
      props: { autoPlay: { interval: 1000, hoverToPause: true }, speed: 0 },
      slots: slides,
    });
    await wrapper.get('.semi-carousel').trigger('mouseenter');
    await vi.advanceTimersByTimeAsync(400);
    await vi.advanceTimersByTimeAsync(1200);
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('one');
    await wrapper.get('.semi-carousel').trigger('mouseleave');
    await vi.advanceTimersByTimeAsync(400);
    await vi.advanceTimersByTimeAsync(1000);
    await nextTick();
    expect(wrapper.get('.semi-carousel-content-item-active').text()).toBe('two');
    wrapper.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('单项/非元素 slot 不创建箭头、指示器或自动播放 timer', () => {
    vi.useFakeTimers();
    const templateHost = mount(
      defineComponent({
        components: { Carousel },
        template: '<Carousel>text<div>single</div><!-- comment --></Carousel>',
      }),
    );
    expect(templateHost.findAll('.semi-carousel-content-item')).toHaveLength(1);
    expect(templateHost.find('.semi-carousel-arrow').exists()).toBe(false);
    expect(templateHost.find('.semi-carousel-indicator').exists()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);

    const renderHost = mount(
      defineComponent({
        render: () => h(Carousel, { autoPlay: false }, () => [h('article', 'render-one')]),
      }),
    );
    expect(renderHost.get('.semi-carousel-content-item').text()).toBe('render-one');
    expect(renderHost.find('.semi-carousel-arrow').exists()).toBe(false);
  });
});
