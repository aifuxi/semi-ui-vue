import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import PinCode from './PinCode.vue';
import type { PinCodeExposed } from './types';

function inputs(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('input');
}

async function settle(count = 3): Promise<void> {
  for (let index = 0; index < count; index += 1) await nextTick();
}

function paste(element: HTMLInputElement, text: string): Event {
  const event = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'clipboardData', {
    value: { getData: (type: string) => (type === 'text' ? text : '') },
  });
  element.dispatchEvent(event);
  return event;
}

describe('PinCode', () => {
  it('渲染默认六格并保留尺寸、禁用、class 与 style 契约', () => {
    const wrapper = mount(PinCode, {
      props: { className: 'custom-pin-code', disabled: true, size: 'small' },
      attrs: { style: 'border: 1px solid red' },
    });

    expect(wrapper.classes()).toContain('semi-pincode-wrapper');
    expect(wrapper.classes()).toContain('custom-pin-code');
    expect(wrapper.attributes('style')).toContain('border: 1px solid red');
    expect(inputs(wrapper)).toHaveLength(6);
    expect(inputs(wrapper).every((input) => input.attributes('disabled') !== undefined)).toBe(true);
    expect(wrapper.find('.semi-input-wrapper-small').exists()).toBe(true);
  });

  it('区分 autoFocus 缺省、显式 false 与显式 true', async () => {
    const omitted = mount(PinCode, { attachTo: document.body });
    await nextTick();
    expect(document.activeElement).toBe(inputs(omitted)[0]?.element);
    omitted.unmount();

    const explicitFalse = mount(PinCode, {
      props: { autoFocus: false },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.activeElement).not.toBe(inputs(explicitFalse)[0]?.element);
    explicitFalse.unmount();

    const explicitTrue = mount(PinCode, {
      props: { autoFocus: true },
      attachTo: document.body,
    });
    await nextTick();
    expect(document.activeElement).toBe(inputs(explicitTrue)[0]?.element);
    explicitTrue.unmount();
  });

  it('覆盖 defaultValue、value/modelValue 优先级、空串、undefined 与运行期同步', async () => {
    const defaulted = mount(PinCode, {
      props: { autoFocus: false, count: 4, defaultValue: '1234' },
    });
    expect(inputs(defaulted).map((input) => input.element.value)).toEqual(['1', '2', '3', '4']);

    const controlled = mount(PinCode, {
      props: {
        autoFocus: false,
        count: 4,
        defaultValue: '9999',
        modelValue: '4321',
        value: '1234',
      },
    });
    expect(inputs(controlled).map((input) => input.element.value)).toEqual(['1', '2', '3', '4']);
    await controlled.setProps({ value: '5678' });
    await settle();
    expect(inputs(controlled).map((input) => input.element.value)).toEqual(['5', '6', '7', '8']);

    await controlled.setProps({ value: '' });
    await settle();
    expect(inputs(controlled).map((input) => input.element.value)).toEqual(['', '', '', '']);
    await controlled.setProps({ value: undefined });
    await settle();
    expect(inputs(controlled).map((input) => input.element.value)).toEqual(['', '', '', '']);

    const initialEmpty = mount(PinCode, {
      props: { autoFocus: false, count: 4, defaultValue: '2468', value: '' },
    });
    expect(inputs(initialEmpty).map((input) => input.element.value)).toEqual(['2', '4', '6', '8']);
  });

  it('覆盖 number、mixed、RegExp、函数、非法字符与组合输入', async () => {
    const number = mount(PinCode, { props: { autoFocus: false, count: 2, format: 'number' } });
    await inputs(number)[0]!.setValue('a');
    await settle();
    expect(number.emitted('change')).toBeUndefined();
    await inputs(number)[0]!.setValue('7');
    await settle();
    expect(number.emitted('change')?.at(-1)).toEqual(['7']);

    const mixed = mount(PinCode, { props: { autoFocus: false, count: 2, format: 'mixed' } });
    await inputs(mixed)[0]!.setValue('A');
    await settle();
    expect(mixed.emitted('change')?.at(-1)).toEqual(['A']);

    const regexp = mount(PinCode, {
      props: { autoFocus: false, count: 2, format: /^[A-Z]$/ },
    });
    await inputs(regexp)[0]!.setValue('b');
    await settle();
    expect(regexp.emitted('change')).toBeUndefined();
    await inputs(regexp)[0]!.setValue('B');
    await settle();
    expect(regexp.emitted('change')?.at(-1)).toEqual(['B']);

    const custom = mount(PinCode, {
      props: { autoFocus: false, count: 2, format: (value) => /^[a-z]$/.test(value) },
    });
    await inputs(custom)[0]!.setValue('c');
    await settle();
    expect(custom.emitted('change')?.at(-1)).toEqual(['c']);

    const composing = mount(PinCode, {
      props: { autoFocus: false, count: 2, format: () => true },
    });
    const composingInput = inputs(composing)[0]!.element;
    composingInput.value = '中';
    composingInput.dispatchEvent(
      new InputEvent('input', { bubbles: true, data: '中', isComposing: true }),
    );
    await settle();
    expect(composing.emitted('change')).toBeUndefined();
  });

  it('覆盖 change/update/complete 顺序和受控回写', async () => {
    const order: string[] = [];
    const wrapper = mount(PinCode, {
      props: {
        autoFocus: false,
        count: 3,
        defaultValue: '12',
        onChange: () => order.push('change'),
        onComplete: () => order.push('complete'),
        'onUpdate:value': () => order.push('update:value'),
        'onUpdate:modelValue': () => order.push('update:modelValue'),
      },
      attachTo: document.body,
    });
    await inputs(wrapper)[2]!.setValue('3');
    await settle();
    expect(order).toEqual(['change', 'update:value', 'update:modelValue', 'complete']);
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['123']);
    expect(document.activeElement).not.toBe(inputs(wrapper)[2]!.element);
    wrapper.unmount();

    const controlled = mount(PinCode, {
      props: { autoFocus: false, count: 2, value: '' },
    });
    await inputs(controlled)[0]!.setValue('8');
    await settle();
    expect(controlled.emitted('change')?.at(-1)).toEqual(['8']);
    expect(inputs(controlled)[0]!.element.value).toBe('');
    await controlled.setProps({ value: '8' });
    await settle();
    expect(inputs(controlled)[0]!.element.value).toBe('8');
  });

  it('覆盖 Backspace、Delete、左右键与边界焦点', async () => {
    const wrapper = mount(PinCode, {
      props: { autoFocus: false, count: 3, defaultValue: '123' },
      attachTo: document.body,
    });
    inputs(wrapper)[1]!.element.focus();
    await inputs(wrapper)[1]!.trigger('keydown', { key: 'Backspace' });
    await settle();
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['13']);
    expect(document.activeElement).toBe(inputs(wrapper)[0]!.element);

    inputs(wrapper)[1]!.element.focus();
    await inputs(wrapper)[1]!.trigger('keydown', { key: 'Delete' });
    await settle();
    expect(document.activeElement).toBe(inputs(wrapper)[2]!.element);

    await inputs(wrapper)[2]!.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(inputs(wrapper)[2]!.element);
    await inputs(wrapper)[2]!.trigger('keydown', { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(inputs(wrapper)[1]!.element);
    await inputs(wrapper)[1]!.trigger('keydown', { key: 'Enter' });
    expect(document.activeElement).toBe(inputs(wrapper)[1]!.element);
    wrapper.unmount();
  });

  it('覆盖完整、部分、非法、空粘贴与 count 截断', async () => {
    const wrapper = mount(PinCode, {
      props: { autoFocus: false, count: 4, defaultValue: '1', format: 'number' },
    });
    const fullPaste = paste(inputs(wrapper)[1]!.element, '23456');
    expect(fullPaste.defaultPrevented).toBe(true);
    await settle(12);
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['1234']);
    expect(inputs(wrapper).map((input) => input.element.value)).toEqual(['1', '2', '3', '4']);

    const invalid = mount(PinCode, {
      props: { autoFocus: false, count: 4, format: 'number' },
    });
    paste(inputs(invalid)[0]!.element, '12a4');
    await settle(12);
    expect(invalid.emitted('change')).toEqual([['1'], ['12']]);

    const empty = mount(PinCode, { props: { autoFocus: false, count: 4 } });
    const emptyPaste = paste(inputs(empty)[0]!.element, '');
    await settle();
    expect(emptyPaste.defaultPrevented).toBe(true);
    expect(empty.emitted('change')).toBeUndefined();
  });

  it('暴露 focus(index) 与 blur(index) 并设置字符末尾选区', async () => {
    const wrapper = mount(PinCode, {
      props: { autoFocus: false, count: 3, defaultValue: '123' },
      attachTo: document.body,
    });
    const exposed = wrapper.vm as unknown as PinCodeExposed;
    exposed.focus(2);
    await nextTick();
    expect(document.activeElement).toBe(inputs(wrapper)[2]!.element);
    expect(inputs(wrapper)[2]!.element.selectionStart).toBe(1);
    expect(inputs(wrapper)[2]!.element.selectionEnd).toBe(1);
    exposed.blur(2);
    expect(document.activeElement).not.toBe(inputs(wrapper)[2]!.element);
    wrapper.unmount();
  });

  it('卸载后不留下文档级监听或可触发副作用', () => {
    const addEventListener = vi.spyOn(document, 'addEventListener');
    const wrapper = mount(PinCode, { props: { autoFocus: false } });
    wrapper.unmount();
    expect(addEventListener).not.toHaveBeenCalled();
    addEventListener.mockRestore();
  });

  it('预留 complete 公开事件门禁', () => {
    const complete = vi.fn();
    const wrapper = mount(PinCode, { props: { count: 3, onComplete: complete } });
    expect(inputs(wrapper)).toHaveLength(3);
    expect(complete).not.toHaveBeenCalled();
  });
});
