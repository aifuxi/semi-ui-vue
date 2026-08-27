import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, shallowRef } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import InputNumber from './InputNumber.vue';
import type { InputNumberExposed, InputNumberValue } from './types';

describe('InputNumber', () => {
  it('保留 spinbutton DOM、默认值与步进按钮骨架', () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 1 } });

    expect(wrapper.get('[role="spinbutton"]').element).toHaveProperty('value', '1');
    expect(wrapper.findAll('.semi-input-number-button')).toHaveLength(2);
  });

  it('非受控输入同时通知 numberChange 与两个 Vue update 事件', async () => {
    const wrapper = mount(InputNumber);
    const input = wrapper.get('input');

    await input.setValue('12.5');

    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe(12.5);
    expect(wrapper.emitted('numberChange')?.at(-1)?.[0]).toBe(12.5);
    expect(wrapper.emitted('update:value')?.at(-1)?.[0]).toBe(12.5);
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(12.5);
  });

  it('按 value/modelValue 原始 prop 存在性区分受控并由 value 优先', async () => {
    const model = shallowRef<InputNumberValue>(2);
    const value = shallowRef<InputNumberValue | undefined>(0);
    const Host = defineComponent(
      () => () =>
        h(InputNumber, {
          modelValue: model.value,
          value: value.value,
          'onUpdate:modelValue': (next: InputNumberValue) => {
            model.value = next;
          },
        }),
    );
    const wrapper = mount(Host);

    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('0');
    value.value = undefined;
    await nextTick();
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('');
    value.value = 4;
    await nextTick();
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('4');
  });

  it('按钮和方向键使用 step/shiftStep 并保持小数精度', async () => {
    const wrapper = mount(InputNumber, {
      props: { defaultValue: 0.9, max: 2, shiftStep: 0.5, step: 0.1 },
    });
    const input = wrapper.get('input');

    await wrapper.get('.semi-input-number-button-up').trigger('mousedown', { button: 0 });
    expect((input.element as HTMLInputElement).value).toBe('1');
    await input.trigger('keydown', { key: 'ArrowUp', keyCode: 38, shiftKey: true });
    expect((input.element as HTMLInputElement).value).toBe('1.5');
    await input.trigger('keydown', { key: 'ArrowDown', keyCode: 40 });
    expect((input.element as HTMLInputElement).value).toBe('1.4');
  });

  it('限制 min/max 并为边界按钮增加 not-allowed class', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 1, min: 1, max: 2 } });

    expect(wrapper.get('.semi-input-number-button-down').classes()).toContain(
      'semi-input-number-button-down-not-allowed',
    );
    await wrapper.get('.semi-input-number-button-up').trigger('mousedown', { button: 0 });
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('2');
    expect(wrapper.get('.semi-input-number-button-up').classes()).toContain(
      'semi-input-number-button-up-not-allowed',
    );
  });

  it('右键、disabled 与 readonly 不执行步进', async () => {
    const right = mount(InputNumber, { props: { defaultValue: 3 } });
    await right.get('.semi-input-number-button-up').trigger('mousedown', { button: 2 });
    expect((right.get('input').element as HTMLInputElement).value).toBe('3');

    const disabled = mount(InputNumber, { props: { defaultValue: 3, disabled: true } });
    await disabled.get('.semi-input-number-button-up').trigger('mousedown', { button: 0 });
    expect((disabled.get('input').element as HTMLInputElement).value).toBe('3');

    const readonly = mount(InputNumber, { props: { defaultValue: 3, readonly: true } });
    await readonly.get('.semi-input-number-button-up').trigger('mousedown', { button: 0 });
    expect((readonly.get('input').element as HTMLInputElement).value).toBe('3');
  });

  it('formatter/parser 首帧与失焦格式化保持一致', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        defaultValue: 1000,
        formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
        precision: 2,
      },
    });
    const input = wrapper.get('input');

    expect((input.element as HTMLInputElement).value).toBe('$ 1,000.00');
    await input.setValue('$ 1,234.5');
    await input.trigger('blur');
    expect((input.element as HTMLInputElement).value).toBe('$ 1,234.50');
  });

  it('货币与科学计数法按 locale/焦点格式化', async () => {
    const currency = mount(InputNumber, {
      props: { currency: 'EUR', defaultValue: 1234.5, localeCode: 'de-DE' },
    });
    await nextTick();
    expect((currency.get('input').element as HTMLInputElement).value).toBe('1.234,50 €');

    const scientific = mount(InputNumber, {
      props: { defaultValue: 123456789012345, scientificNotation: true },
    });
    const input = scientific.get('input');
    expect((input.element as HTMLInputElement).value).toContain('e+');
    await input.trigger('focus');
    expect((input.element as HTMLInputElement).value).toBe('123456789012345');
    await input.trigger('blur');
    expect((input.element as HTMLInputElement).value).toContain('e+');
  });

  it('innerButtons 仅在 hover/focus 替换 suffix，hideButtons 完全隐藏外部按钮', async () => {
    const inner = mount(InputNumber, { props: { innerButtons: true, suffix: '小时' } });
    expect(inner.text()).toContain('小时');
    expect(inner.find('.semi-input-number-suffix-btns').exists()).toBe(false);
    await inner.trigger('mouseenter');
    expect(inner.find('.semi-input-number-suffix-btns-inner').exists()).toBe(true);
    expect(inner.text()).not.toContain('小时');

    const hidden = mount(InputNumber, { props: { hideButtons: true } });
    expect(hidden.find('.semi-input-number-suffix-btns').exists()).toBe(false);
  });

  it('长按离开后注册 document mouseup，并在卸载时清理', async () => {
    vi.useFakeTimers();
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    const wrapper = mount(InputNumber, { props: { defaultValue: 1 } });
    const up = wrapper.get('.semi-input-number-button-up');

    await up.trigger('mousedown', { button: 0 });
    await up.trigger('mouseleave');
    expect(add).toHaveBeenCalledWith('mouseup', expect.any(Function));
    wrapper.unmount();
    expect(remove).toHaveBeenCalledWith('mouseup', expect.any(Function));
    vi.useRealTimers();
  });

  it('暴露 input/focus/blur/select 且透传 spinbutton ARIA', async () => {
    const wrapper = mount(InputNumber, {
      props: { defaultValue: 2, min: 1, max: 3, step: 0.5 },
      attachTo: document.body,
    });
    const exposed = wrapper.vm as unknown as InputNumberExposed;
    exposed.focus();
    await nextTick();
    expect(document.activeElement).toBe(exposed.input);
    exposed.select();
    expect(exposed.input?.selectionStart).toBe(0);
    exposed.blur();
    expect(wrapper.get('input').attributes()).toMatchObject({
      role: 'spinbutton',
      'aria-valuemax': '3',
      'aria-valuemin': '1',
      'aria-valuenow': '2',
      step: '0.5',
    });
    wrapper.unmount();
  });
});
