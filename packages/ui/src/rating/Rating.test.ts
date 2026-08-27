import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, h, nextTick } from 'vue';

import { configContextKey, type ConfigContextValue } from '../config-provider';
import Rating from './index';

function mockItemGeometry(element: Element, left = 0, width = 100): void {
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: width });
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    bottom: 24,
    height: 24,
    left,
    right: left + width,
    top: 0,
    width,
    x: left,
    y: 0,
    toJSON: () => ({}),
  });
}

async function flushTooltip(): Promise<void> {
  for (let index = 0; index < 5; index += 1) {
    await nextTick();
    await vi.runOnlyPendingTimersAsync();
  }
}

describe('Rating', () => {
  beforeEach(() => document.body.replaceChildren());
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it('保留 count + 1 DOM、默认/半星/尺寸、字符与完整 ARIA', () => {
    const basic = mount(Rating, {
      props: { defaultValue: 3, id: 'score', ariaLabel: 'heart' },
    });
    expect(basic.get('ul').classes()).toContain('semi-rating');
    expect(basic.findAll('li')).toHaveLength(6);
    expect(basic.findAll('.semi-rating-star-full')).toHaveLength(3);
    expect(basic.get('ul').attributes('aria-label')).toBe('Rating: 3 of 5 hearts,');
    expect(basic.findAll('[role="radio"]')[2]!.attributes()).toMatchObject({
      'aria-checked': 'true',
      'aria-posinset': '3',
      'aria-setsize': '6',
      tabindex: '0',
    });
    expect(basic.findAll('[role="radio"]')[5]!.attributes('aria-label')).toBe('0 hearts');

    const half = mount(Rating, { props: { allowHalf: true, defaultValue: 3.5 } });
    expect(half.findAll('.semi-rating-star-full')).toHaveLength(3);
    expect(half.findAll('.semi-rating-star-half')).toHaveLength(1);
    expect(half.findAll('[role="radio"]')).toHaveLength(11);
    expect(half.findAll('[role="radio"]')[6]!.attributes('aria-checked')).toBe('true');

    const custom = mount(Rating, { props: { character: 'S', defaultValue: 2, size: 32 } });
    expect(custom.findAll('.semi-rating-star-second')[0]!.text()).toBe('S');
    expect(custom.findAll('li')[0]!.attributes('style')).toContain('width: 32px');
    expect(custom.get('ul').attributes('aria-label')).toContain('Ss');
  });

  it.each([
    ['missing', {}, 0],
    ['explicit false', { allowClear: false, defaultValue: 2 }, 2],
    ['explicit true', { allowClear: true, defaultValue: 2 }, 0],
  ] as const)('区分 allowClear %s', async (label, props, expected) => {
    const wrapper = mount(Rating, { props });
    const target = wrapper.findAll('[role="radio"]')[1]!;
    await target.trigger('click', { pageX: 100 });
    if (label === 'missing') await target.trigger('click', { pageX: 100 });
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe(expected);
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(expected);
  });

  it('受控 value/modelValue 只通知并等待回写；显式 undefined 不退化为非受控', async () => {
    const controlled = mount(Rating, { props: { value: 2 } });
    await controlled.findAll('[role="radio"]')[3]!.trigger('click', { pageX: 100 });
    expect(controlled.findAll('.semi-rating-star-full')).toHaveLength(2);
    expect(controlled.emitted('change')).toEqual([[4]]);
    await controlled.setProps({ value: 4 });
    expect(controlled.findAll('.semi-rating-star-full')).toHaveLength(4);

    const model = mount(Rating, { props: { modelValue: 1 } });
    await model.findAll('[role="radio"]')[2]!.trigger('click', { pageX: 100 });
    expect(model.findAll('.semi-rating-star-full')).toHaveLength(1);
    expect(model.emitted('update:modelValue')).toEqual([[3]]);

    const explicitUndefined = mount(Rating, {
      props: { value: undefined, defaultValue: 2 },
    });
    await explicitUndefined.findAll('[role="radio"]')[3]!.trigger('click', { pageX: 100 });
    expect(explicitUndefined.findAll('.semi-rating-star-full')).toHaveLength(2);
  });

  it('按真实几何计算 LTR/RTL 半星并在离开时清空 hover', async () => {
    const ltr = mount(Rating, { props: { allowHalf: true } });
    mockItemGeometry(ltr.findAll('li')[1]!.element);
    await ltr.findAll('.semi-rating-star-wrapper')[1]!.trigger('mousemove', { clientX: 25 });
    expect(ltr.emitted('hoverChange')?.at(-1)).toEqual([1.5]);
    expect(ltr.findAll('.semi-rating-star-half')).toHaveLength(1);
    await ltr.get('ul').trigger('mouseleave');
    expect(ltr.emitted('hoverChange')?.at(-1)).toEqual([undefined]);

    const rtlHost = mount(Rating, {
      props: { allowHalf: true },
      global: {
        provide: {
          [configContextKey as symbol]: computed(
            () => ({ direction: 'rtl' }) as ConfigContextValue,
          ),
        },
      },
    });
    const rtl = rtlHost;
    mockItemGeometry(rtl.findAll('li')[1]!.element);
    await rtl.findAll('.semi-rating-star-wrapper')[1]!.trigger('mousemove', { clientX: 75 });
    expect(rtl.emitted('hoverChange')?.at(-1)).toEqual([1.5]);
  });

  it('方向键按整/半步环绕、迁移 roving focus 并保持事件顺序', async () => {
    const order: string[] = [];
    const wrapper = mount(Rating, {
      attachTo: document.body,
      props: {
        allowHalf: true,
        defaultValue: 2.5,
        onChange: () => order.push('change'),
        onHoverChange: () => order.push('hover'),
        onKeyDown: () => order.push('keydown'),
      },
    });
    const selected = wrapper.findAll('[role="radio"]')[4]!;
    (selected.element as HTMLElement).focus();
    await selected.trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('change')?.at(-1)).toEqual([3]);
    expect(order.slice(-3)).toEqual(['keydown', 'change', 'hover']);
    expect(document.activeElement).toBe(wrapper.findAll('[role="radio"]')[5]!.element);

    const max = mount(Rating, { attachTo: document.body, props: { defaultValue: 5 } });
    const last = max.findAll('[role="radio"]')[4]!;
    (last.element as HTMLElement).focus();
    await last.trigger('keydown', { key: 'ArrowRight' });
    expect(max.emitted('change')).toEqual([[0]]);
    expect(document.activeElement).toBe(max.findAll('[role="radio"]')[5]!.element);
    wrapper.unmount();
    max.unmount();
  });

  it('disabled 阻止交互；autoFocus 与公开 focus/blur 遵循 preventScroll', async () => {
    const disabled = mount(Rating, {
      props: { disabled: true, defaultValue: 2, autoFocus: true },
    });
    expect(disabled.classes()).toContain('semi-rating-disabled');
    expect(disabled.get('ul').attributes('tabindex')).toBe('-1');
    expect(
      disabled.findAll('[role="radio"]').every((item) => item.attributes('tabindex') === '-1'),
    ).toBe(true);
    await disabled.findAll('[role="radio"]')[3]!.trigger('click');
    await disabled.get('ul').trigger('keydown', { key: 'ArrowRight' });
    expect(disabled.emitted('change')).toBeUndefined();

    const enabled = mount(Rating, {
      attachTo: document.body,
      props: { autoFocus: true, defaultValue: 2, preventScroll: true },
    });
    await nextTick();
    expect(document.activeElement).toBe(enabled.findAll('[role="radio"]')[1]!.element);
    const exposed = enabled.vm as unknown as { focus(): void; blur(): void };
    exposed.focus();
    expect(document.activeElement).toBe(enabled.get('ul').element);
    exposed.blur();
    expect(document.activeElement).not.toBe(enabled.get('ul').element);
    enabled.unmount();
  });

  it('character slot 优先于 prop，Tooltip 通过真实 Portal 展示对应内容', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Rating, {
      attachTo: document.body,
      props: { character: 'P', tooltips: ['bad', 'normal', 'good'] },
      slots: { character: () => h('strong', { class: 'slot-character' }, 'V') },
    });
    expect(wrapper.findAll('.slot-character')).toHaveLength(6);
    await flushTooltip();
    await wrapper.findAll('[role="radio"]')[1]!.trigger('mousemove', { pageX: 100 });
    await flushTooltip();
    expect(document.body.querySelector('.semi-tooltip-wrapper-show')?.textContent).toContain(
      'normal',
    );
    wrapper.unmount();
    expect(document.body.querySelector('.semi-portal')).toBeNull();
  });
});
