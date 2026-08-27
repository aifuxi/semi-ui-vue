/* eslint-disable vue/one-component-per-file -- test hosts cover template Boolean and controlled contracts. */

import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, shallowRef } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Input, { InputGroup, TextArea } from './index';

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];
  callback: ResizeObserverCallback;
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ResizeObserverMock.instances.push(this);
  }
}

beforeEach(() => {
  ResizeObserverMock.instances = [];
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Input', () => {
  it('非受控输入更新 DOM，并按公开顺序发出 input/change/update', async () => {
    const order: string[] = [];
    const wrapper = mount(Input, {
      props: {
        defaultValue: 'Semi',
        onInput: () => order.push('input'),
        onChange: () => order.push('change'),
        'onUpdate:modelValue': () => order.push('update'),
      },
    });
    await wrapper.get('input').setValue('Vue');
    expect(wrapper.get('input').element.value).toBe('Vue');
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe('Vue');
    expect(order.slice(0, 3)).toEqual(['input', 'change', 'update']);
  });

  it('value 优先于 modelValue，受控输入等待父级回写', async () => {
    const wrapper = mount(Input, { props: { value: 'fixed', modelValue: 'ignored' } });
    await wrapper.get('input').setValue('next');
    await nextTick();
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe('next');
    expect(wrapper.get('input').element.value).toBe('fixed');
    await wrapper.setProps({ value: 'parent' });
    expect(wrapper.get('input').element.value).toBe('parent');
  });

  it('前后附加项、前后缀、尺寸、状态、readonly 与原生 attrs 落点对齐', () => {
    const wrapper = mount(Input, {
      attrs: { class: 'host', style: 'width: 240px', 'data-input': 'native', name: 'account' },
      props: {
        addonBefore: 'https://',
        addonAfter: '.com',
        prefix: 'P',
        suffix: 'S',
        size: 'large',
        validateStatus: 'error',
        readonly: true,
      },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['host', 'semi-input-wrapper-large', 'semi-input-wrapper-error']),
    );
    expect(wrapper.get('.semi-input-prepend').text()).toBe('https://');
    expect(wrapper.get('.semi-input-append').text()).toBe('.com');
    expect(wrapper.get('.semi-input-prefix').text()).toBe('P');
    expect(wrapper.get('.semi-input-suffix').text()).toBe('S');
    expect(wrapper.get('input').attributes()).toMatchObject({
      'aria-invalid': 'true',
      'data-input': 'native',
      name: 'account',
      readonly: '',
    });
  });

  it('showClear 只在有值且 hover/focus 时显示，并保持 change → clear 顺序', async () => {
    const order: string[] = [];
    const wrapper = mount(Input, {
      props: {
        defaultValue: 'clear me',
        showClear: true,
        onChange: () => order.push('change'),
        onClear: () => order.push('clear'),
      },
    });
    expect(wrapper.find('.semi-input-clearbtn').exists()).toBe(false);
    await wrapper.trigger('mouseenter');
    await wrapper.get('.semi-input-clearbtn').trigger('mousedown');
    expect(wrapper.get('input').element.value).toBe('');
    expect(order).toEqual(['change', 'clear']);
  });

  it('password 按钮支持 click、Enter/Space、动态 aria-label 并保留输入焦点', async () => {
    const wrapper = mount(Input, { attachTo: document.body, props: { mode: 'password' } });
    const input = wrapper.get('input');
    const button = wrapper.get('[role="button"]');
    expect(input.attributes('type')).toBe('password');
    expect(button.attributes('aria-label')).toBe('Show password');
    await button.trigger('keypress', { key: 'Enter' });
    expect(input.attributes('type')).toBe('text');
    expect(document.activeElement).toBe(input.element);
    await button.trigger('keypress', { key: ' ' });
    expect(input.attributes('type')).toBe('password');
    wrapper.unmount();
  });

  it('自定义长度执行截断，IME composition 模式只在结束时发一次 change', async () => {
    const wrapper = mount(Input, {
      props: { composition: true, maxLength: 2, getValueLength: (text) => [...text].length },
    });
    const input = wrapper.get('input');
    await input.trigger('compositionstart');
    input.element.value = '中文中';
    await input.trigger('input');
    expect(wrapper.emitted('change')).toBeUndefined();
    await input.trigger('compositionend');
    expect(wrapper.emitted('change')?.map((call) => call[0])).toEqual(['中文']);
    expect(wrapper.emitted('compositionStart')).toHaveLength(1);
    expect(wrapper.emitted('compositionEnd')).toHaveLength(1);
  });

  it('公开 focus/blur/select 与 input 引用落在原生节点', () => {
    const wrapper = mount(Input, { attachTo: document.body, props: { defaultValue: 'Semi' } });
    const exposed = wrapper.vm as unknown as {
      input: HTMLInputElement;
      focus(): void;
      blur(): void;
      select(): void;
    };
    exposed.focus();
    expect(document.activeElement).toBe(exposed.input);
    exposed.select();
    expect(exposed.input.selectionStart).toBe(0);
    expect(exposed.input.selectionEnd).toBe(4);
    exposed.blur();
    expect(document.activeElement).not.toBe(exposed.input);
    wrapper.unmount();
  });
});

describe('InputGroup', () => {
  it('组级 size/disabled 只回退到未显式声明的子项', () => {
    const TemplateHost = defineComponent({
      components: { Input, InputGroup },
      template: `<InputGroup size="large" disabled><Input placeholder="A" disabled /><Input placeholder="B" :disabled="false" /><Input placeholder="C" /></InputGroup>`,
    });
    const template = mount(TemplateHost);
    const inputs = template.findAll('input');
    expect(inputs[0]!.attributes('disabled')).toBeDefined();
    expect(inputs[1]!.attributes('disabled')).toBeUndefined();
    expect(inputs[2]!.attributes('disabled')).toBeDefined();
    expect(inputs.every((item) => item.classes().includes('semi-input-large'))).toBe(true);

    const render = mount(InputGroup, {
      props: { disabled: true },
      slots: {
        default: () => [h(Input, { disabled: true }), h(Input, { disabled: false }), h(Input)],
      },
    });
    expect(
      render.findAll('input').map((item) => item.attributes('disabled') !== undefined),
    ).toEqual([true, false, true]);
  });

  it('label DOM、optional locale、group ARIA 与 focus/blur 事件对齐', async () => {
    const wrapper = mount(InputGroup, {
      attachTo: document.body,
      props: {
        disabled: true,
        label: { text: '账号', name: 'account', optional: true, required: true },
        labelPosition: 'top',
      },
      slots: { default: () => h(Input, { disabled: false }) },
    });
    expect(wrapper.classes()).toContain('semi-input-group-wrapper-with-top-label');
    expect(wrapper.get('label').attributes('for')).toBe('account');
    expect(wrapper.get('.semi-form-field-label-optional-text').text()).toBe('（可选）');
    expect(wrapper.get('[role="group"]').attributes('aria-disabled')).toBe('true');
    wrapper.get('input').element.focus();
    await nextTick();
    wrapper.get('input').element.blur();
    await nextTick();
    expect(wrapper.emitted('focus')).toHaveLength(1);
    expect(wrapper.emitted('blur')).toHaveLength(1);
    wrapper.unmount();
  });
});

describe('TextArea', () => {
  it('非受控值、计数、maxCount 状态与 Enter 事件对齐', async () => {
    const wrapper = mount(TextArea, {
      props: { defaultValue: 'ab', showCounter: true, maxCount: 3 },
    });
    expect(wrapper.get('.semi-input-textarea-counter').text()).toBe('2/3');
    await wrapper.get('textarea').setValue('abcd');
    expect(wrapper.get('.semi-input-textarea-counter').classes()).toContain(
      'semi-input-textarea-counter-exceed',
    );
    await wrapper.get('textarea').trigger('keydown', { key: 'Enter', keyCode: 13 });
    expect(wrapper.emitted('enterPress')).toHaveLength(1);
  });

  it('disabledEnterStartNewLine 仅拦截无 Shift 的 Enter', async () => {
    const wrapper = mount(TextArea, { props: { disabledEnterStartNewLine: true } });
    const first = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    wrapper.get('textarea').element.dispatchEvent(first);
    expect(first.defaultPrevented).toBe(true);
    const shifted = new KeyboardEvent('keydown', {
      key: 'Enter',
      shiftKey: true,
      cancelable: true,
    });
    wrapper.get('textarea').element.dispatchEvent(shifted);
    expect(shifted.defaultPrevented).toBe(false);
  });

  it('showClear、readonly、borderless 和自定义长度截断保持公开行为', async () => {
    const wrapper = mount(TextArea, {
      props: {
        borderless: true,
        defaultValue: '你好呀',
        getValueLength: (text) => [...text].length,
        maxLength: 2,
        showClear: true,
      },
    });
    await wrapper.trigger('mouseenter');
    expect(wrapper.classes()).toContain('semi-input-textarea-borderless');
    await wrapper.get('textarea').setValue('中文中');
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe('中文');
    await wrapper.get('.semi-input-clearbtn').trigger('click');
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.get('textarea').element.value).toBe('');
  });

  it('autosize/行号创建 Observer、同步滚动，并在卸载时清理', async () => {
    const wrapper = mount(TextArea, {
      attachTo: document.body,
      props: { autosize: { minRows: 2, maxRows: 4 }, defaultValue: 'a\nb', showLineNumber: true },
    });
    expect(wrapper.findAll('.semi-input-textarea-lineNumber-item')).toHaveLength(2);
    expect(ResizeObserverMock.instances).toHaveLength(1);
    const instance = ResizeObserverMock.instances[0]!;
    instance.callback(
      [
        {
          target: wrapper.get('textarea').element,
          contentRect: { width: 200, height: 80 },
        } as unknown as ResizeObserverEntry,
      ],
      instance as unknown as ResizeObserver,
    );
    const textarea = wrapper.get('textarea').element;
    Object.defineProperty(textarea, 'scrollTop', { value: 24, writable: true });
    await wrapper.get('textarea').trigger('scroll');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect((wrapper.get('.semi-input-textarea-lineNumber').element as HTMLElement).scrollTop).toBe(
      24,
    );
    wrapper.unmount();
    expect(instance.disconnect).toHaveBeenCalled();
  });

  it('受控值不提前漂移，父级 v-model 回写后同步', async () => {
    const value = shallowRef('old');
    const Host = defineComponent({
      setup: () => () =>
        h(TextArea, {
          modelValue: value.value,
          'onUpdate:modelValue': (next: string) => (value.value = next),
        }),
    });
    const wrapper = mount(Host);
    await wrapper.get('textarea').setValue('new');
    await nextTick();
    expect(value.value).toBe('new');
    expect(wrapper.get('textarea').element.value).toBe('new');
  });
});
