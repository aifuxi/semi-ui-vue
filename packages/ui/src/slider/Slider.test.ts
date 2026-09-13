import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, nextTick } from 'vue';

import { configContextKey, type ConfigContextValue } from '../config-provider';
import Slider from './index';

function mockSliderGeometry(element: Element, left = 10, top = 20, width = 200, height = 32): void {
  Object.defineProperties(element, {
    offsetHeight: { configurable: true, value: height },
    offsetLeft: { configurable: true, value: left },
    offsetTop: { configurable: true, value: top },
    offsetWidth: { configurable: true, value: width },
  });
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    bottom: top + height,
    height,
    left,
    right: left + width,
    top,
    width,
    x: left,
    y: top,
    toJSON: () => ({}),
  });
}

describe('Slider', () => {
  beforeEach(() => document.body.replaceChildren());
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it('保留默认/范围/纵向 DOM、样式位置与完整 ARIA', () => {
    const basic = mount(Slider, { props: { defaultValue: 30, ariaLabel: '音量' } });
    expect(basic.get('.semi-slider')).toBeTruthy();
    expect(
      [...basic.get('.semi-slider-wrapper').element.children].map(
        (node) => (node as HTMLElement).className,
      ),
    ).toEqual(['semi-slider-rail', 'semi-slider-track', '', 'semi-slider-boundary']);
    expect(basic.get('[role="slider"]').attributes()).toMatchObject({
      'aria-label': '音量',
      'aria-valuemax': '100',
      'aria-valuemin': '0',
      'aria-valuenow': '30',
      tabindex: '0',
    });
    expect(basic.get('.semi-slider-track').attributes('style')).toContain('width: 30%');
    expect(basic.get('.semi-slider-handle').attributes('style')).toContain('left: 30%');

    const range = mount(Slider, { props: { range: true, defaultValue: [20, 60] } });
    expect(range.findAll('[role="slider"]')).toHaveLength(2);
    expect(range.get('.semi-slider-wrapper').attributes('aria-label')).toBe('Range: 20 to 60');
    expect(range.findAll('[role="slider"]')[0]!.attributes('aria-valuemax')).toBe('60');
    expect(range.findAll('[role="slider"]')[1]!.attributes('aria-valuemin')).toBe('20');

    const vertical = mount(Slider, { props: { vertical: true, verticalReverse: true } });
    expect(vertical.get('.semi-slider-vertical-wrapper').classes()).toContain(
      'semi-slider-vertical-wrapper',
    );
    expect(vertical.get('.semi-slider-vertical-wrapper').classes()).toContain(
      'semi-slider-reverse',
    );
    expect(vertical.get('[role="slider"]').attributes('aria-orientation')).toBe('vertical');
  });

  it.each([
    ['missing', {}, true, true, true],
    [
      'explicit false',
      { included: false, showMarkLabel: false, showArrow: false },
      false,
      false,
      false,
    ],
    ['explicit true', { included: true, showMarkLabel: true, showArrow: true }, true, true, true],
  ] as const)('默认 true Boolean 三态：%s', (_label, props, included, showMarkLabel, showArrow) => {
    const wrapper = mount(Slider, {
      props: { marks: { 0: '0', 50: '50', 100: '100' }, tooltipVisible: true, ...props },
    });
    expect(wrapper.get('.semi-slider-track').attributes('style') !== undefined).toBe(included);
    expect(wrapper.find('.semi-slider-marks').exists()).toBe(showMarkLabel);
    expect(wrapper.getComponent({ name: 'Tooltip' }).props('showArrow')).toBe(showArrow);
  });

  it.each([
    ['missing', {}, true],
    ['explicit false', { tooltipVisible: false }, false],
    ['explicit true', { tooltipVisible: true }, true],
  ] as const)('tooltipVisible 三态：%s', async (_label, props, visible) => {
    const wrapper = mount(Slider, { props });
    mockSliderGeometry(wrapper.get('.semi-slider-wrapper').element);
    await wrapper.get('[role="slider"]').trigger('mouseenter');
    expect(wrapper.getComponent({ name: 'Tooltip' }).props('visible')).toBe(visible);
  });

  it('非受控点击更新并按 change/update/afterChange 顺序通知；受控只通知', async () => {
    const order: string[] = [];
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 20,
        onChange: () => order.push('change'),
        'onUpdate:modelValue': () => order.push('model'),
        onAfterChange: () => order.push('after'),
      },
    });
    mockSliderGeometry(wrapper.get('.semi-slider-wrapper').element);
    await wrapper.get('.semi-slider-rail').trigger('click', { clientX: 110, clientY: 20 });
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('50');
    expect(wrapper.emitted('change')).toEqual([[50]]);
    expect(order).toEqual(['change', 'model', 'after']);

    const controlled = mount(Slider, { props: { value: 20 } });
    mockSliderGeometry(controlled.get('.semi-slider-wrapper').element);
    await controlled.get('.semi-slider-rail').trigger('click', { clientX: 210, clientY: 20 });
    expect(controlled.get('[role="slider"]').attributes('aria-valuenow')).toBe('20');
    expect(controlled.emitted('change')).toEqual([[100]]);
    await controlled.setProps({ value: 40 });
    expect(controlled.get('[role="slider"]').attributes('aria-valuenow')).toBe('40');
    expect(controlled.emitted('afterChange')?.at(-1)).toEqual([40]);
  });

  it('marks、included、boundary、handleDot 与小数 step 保持公开行为', async () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 0.1,
        handleDot: { color: 'red', size: '6px' },
        marks: { 0.1: '低', 0.3: '中', 0.5: '高', 2: '越界' },
        max: 1,
        step: 0.1,
        showBoundary: true,
      },
    });
    expect(wrapper.findAll('.semi-slider-dot')).toHaveLength(3);
    expect(wrapper.findAll('.semi-slider-mark')).toHaveLength(3);
    expect(wrapper.get('.semi-slider-handle-dot').attributes('style')).toContain('width: 6px');
    await wrapper.get('.semi-slider-wrapper').trigger('mouseenter');
    expect(wrapper.get('.semi-slider-boundary').classes()).toContain('semi-slider-boundary-show');
    await wrapper.get('[role="slider"]').trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('change')?.at(-1)).toEqual([0.2]);
  });

  it('键盘覆盖步长、10 倍步长、Home/End、range 限制与 RTL 反转', async () => {
    const wrapper = mount(Slider, { props: { range: true, defaultValue: [20, 60] } });
    const handles = wrapper.findAll('[role="slider"]');
    await handles[0]!.trigger('keydown', { key: 'PageUp' });
    expect(wrapper.emitted('change')?.at(-1)).toEqual([[30, 60]]);
    await handles[0]!.trigger('keydown', { key: 'End' });
    expect(wrapper.emitted('change')?.at(-1)).toEqual([[60, 60]]);
    await handles[1]!.trigger('keydown', { key: 'Home' });
    expect(wrapper.emitted('change')?.at(-1)).toEqual([[60, 60]]);

    const rtl = mount(Slider, {
      props: { defaultValue: 20 },
      global: {
        provide: {
          [configContextKey as symbol]: computed(
            () => ({ direction: 'rtl' }) as ConfigContextValue,
          ),
        },
      },
    });
    await rtl.get('[role="slider"]').trigger('keydown', { key: 'ArrowLeft' });
    expect(rtl.emitted('change')).toEqual([[21]]);
    expect(rtl.get('.semi-slider-handle').attributes('style')).toContain('right: 21%');
  });

  it('disabled 阻止交互；ARIA valuetext 与纵向属性精确输出', async () => {
    const wrapper = mount(Slider, {
      props: {
        ariaLabelledby: 'slider-label',
        defaultValue: 30,
        disabled: true,
        getAriaValueText: (value) => `${value}%`,
        vertical: true,
      },
    });
    const handle = wrapper.get('[role="slider"]');
    expect(handle.attributes()).toMatchObject({
      'aria-disabled': 'true',
      'aria-labelledby': 'slider-label',
      'aria-orientation': 'vertical',
      'aria-valuetext': '30%',
      tabindex: '-1',
    });
    await handle.trigger('keydown', { key: 'ArrowUp' });
    await wrapper.get('.semi-slider-rail').trigger('click', { clientX: 100, clientY: 20 });
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('拖拽按 mouseUp/afterChange 顺序结束并在卸载后清理全局监听', async () => {
    const addBody = vi.spyOn(document.body, 'addEventListener');
    const removeBody = vi.spyOn(document.body, 'removeEventListener');
    const addWindow = vi.spyOn(window, 'addEventListener');
    const removeWindow = vi.spyOn(window, 'removeEventListener');
    const order: string[] = [];
    const wrapper = mount(Slider, {
      attachTo: document.body,
      props: {
        defaultValue: 20,
        onAfterChange: () => order.push('after'),
        onMouseUp: () => order.push('mouseup'),
      },
    });
    const root = wrapper.get('.semi-slider-wrapper');
    const handle = wrapper.get('.semi-slider-handle');
    mockSliderGeometry(root.element);
    mockSliderGeometry(handle.element, 38, 24, 24, 24);
    await handle.trigger('mousedown', { clientX: 50, clientY: 32 });
    document.body.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 110 }));
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 110 }));
    await nextTick();
    expect(wrapper.emitted('change')?.at(-1)).toEqual([50]);
    expect(order).toEqual(['mouseup', 'after']);
    expect(addBody).toHaveBeenCalled();
    expect(removeBody).toHaveBeenCalled();
    expect(addWindow).toHaveBeenCalled();
    expect(removeWindow).toHaveBeenCalled();
    wrapper.unmount();
  });
});
