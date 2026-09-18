/* eslint-disable vue/one-component-per-file -- local controls exercise the public getConfigureItem factory. */

import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, type PropType } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AIChatInputConfigure, getConfigureItem } from './index';

const TextControl = defineComponent({
  name: 'TextControl',
  props: {
    value: { type: String as PropType<unknown>, default: undefined },
    onChange: { type: Function as PropType<(value: unknown) => void>, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  setup: (props) => () =>
    h('input', {
      'aria-label': 'control',
      disabled: props.disabled,
      value: props.value,
      onInput: (event: Event) => props.onChange?.((event.target as HTMLInputElement).value),
    }),
});

const NestedControl = defineComponent({
  name: 'NestedControl',
  props: {
    value: { type: Object as PropType<unknown>, default: undefined },
    onChange: { type: Function as PropType<(value: unknown) => void>, default: undefined },
  },
  setup: (props) => () =>
    h(
      'button',
      {
        type: 'button',
        onClick: () => props.onChange?.({ target: { value: 'nested' } }),
      },
      'nested',
    ),
});

const CheckedControl = defineComponent({
  name: 'CheckedControl',
  props: {
    checked: { type: Boolean, default: false },
    onToggle: { type: Function as PropType<(value: unknown) => void>, default: undefined },
  },
  setup: (props) => () =>
    h(
      'button',
      {
        type: 'button',
        'data-checked': String(props.checked),
        onClick: () => props.onToggle?.(!props.checked),
      },
      'toggle',
    ),
});

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('getConfigureItem', () => {
  it('绑定 field 值并同步内部组件变更到 Configure 与单项回调', async () => {
    const Configured = getConfigureItem(TextControl);
    const onChange = vi.fn();
    const wrapper = mount(AIChatInputConfigure, {
      props: { value: { model: 'gpt-4o' } },
      slots: {
        default: () => h(Configured, { field: 'model', onChange }),
      },
    });
    await nextTick();
    expect(wrapper.get<HTMLInputElement>('input[aria-label="control"]').element.value).toBe(
      'gpt-4o',
    );

    await wrapper.get('input[aria-label="control"]').setValue('gpt-5');
    expect(wrapper.emitted('update:value')?.at(-1)?.[0]).toEqual({ model: 'gpt-5' });
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual({ model: 'gpt-5' });
    expect(onChange).toHaveBeenCalledWith('gpt-5');
    wrapper.unmount();
  });

  it('valuePath 从内部事件载荷解析字段值', async () => {
    const Configured = getConfigureItem(NestedControl, { valuePath: 'target.value' });
    const wrapper = mount(AIChatInputConfigure, {
      slots: { default: () => h(Configured, { field: 'nested' }) },
    });
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('update:value')?.at(-1)?.[0]).toEqual({ nested: 'nested' });
    wrapper.unmount();
  });

  it('支持自定义 valueKey 与 onKeyChangeFnName', async () => {
    const Configured = getConfigureItem(CheckedControl, {
      valueKey: 'checked',
      onKeyChangeFnName: 'onToggle',
    });
    const wrapper = mount(AIChatInputConfigure, {
      props: { value: { deepThink: true } },
      slots: { default: () => h(Configured, { field: 'deepThink' }) },
    });
    await nextTick();
    expect(wrapper.get('button[data-checked]').attributes('data-checked')).toBe('true');

    await wrapper.get('button[data-checked]').trigger('click');
    expect(wrapper.emitted('update:value')?.at(-1)?.[0]).toEqual({ deepThink: false });
    wrapper.unmount();
  });

  it('应用 defaultProps、调用方 attrs 与 className 合并，并让绑定值覆盖默认值', async () => {
    const Configured = getConfigureItem(TextControl, {
      className: 'option-class',
      defaultProps: { disabled: true, value: 'default-value' },
    });
    const wrapper = mount(AIChatInputConfigure, {
      props: { value: { model: 'from-configure' } },
      slots: {
        default: () =>
          h(Configured, { field: 'model', class: 'caller-class', 'data-extra': 'kept' }),
      },
    });
    await nextTick();
    const input = wrapper.get<HTMLInputElement>('input[aria-label="control"]');
    expect(input.element.value).toBe('from-configure');
    expect(input.element.disabled).toBe(true);
    expect(input.attributes('data-extra')).toBe('kept');
    expect(input.classes()).toEqual(expect.arrayContaining(['caller-class', 'option-class']));
    wrapper.unmount();
  });

  it('挂载时注册 initValue，卸载时从 Configure 移除字段', async () => {
    const Configured = getConfigureItem(TextControl);
    const wrapper = mount(AIChatInputConfigure, {
      slots: { default: () => h(Configured, { field: 'model', initValue: 'init' }) },
    });
    await flushPromises();
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual({ model: 'init' });
    expect(wrapper.emitted('change')?.at(-1)?.[1]).toEqual({ model: 'init' });

    wrapper.unmount();
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toEqual({});
  });

  it('脱离 Configure 使用时抛出明确错误', () => {
    const Configured = getConfigureItem(TextControl);
    expect(() => mount(Configured, { props: { field: 'model' } })).toThrow(
      'getConfigureItem result must be inside AIChatInput.Configure',
    );
  });

  it('多个 Configure 实例保持字段隔离', async () => {
    const Configured = getConfigureItem(TextControl);
    const first = mount(AIChatInputConfigure, {
      props: { value: { model: 'first' } },
      slots: { default: () => h(Configured, { field: 'model' }) },
    });
    const second = mount(AIChatInputConfigure, {
      props: { value: { model: 'second' } },
      slots: { default: () => h(Configured, { field: 'model' }) },
    });
    await first.get('input[aria-label="control"]').setValue('changed');
    expect(first.emitted('update:value')?.at(-1)?.[0]).toEqual({ model: 'changed' });
    expect(second.emitted('update:value')).toBeUndefined();
    expect(second.get<HTMLInputElement>('input[aria-label="control"]').element.value).toBe(
      'second',
    );
    first.unmount();
    second.unmount();
  });

  it('经 AIChatInput.Configure 收集到 messageSend.setup', async () => {
    const Configured = getConfigureItem(TextControl);
    const { AIChatInput } = await import('./index');
    const wrapper = mount(AIChatInput, {
      attachTo: document.body,
      props: { defaultContent: 'Send with factory' },
      slots: {
        configure: () => h(Configured, { field: 'model', initValue: 'gpt-4o' }),
      },
    });
    await flushPromises();
    await vi.waitFor(() =>
      expect(wrapper.get<HTMLButtonElement>('button[aria-label="Send"]').element.disabled).toBe(
        false,
      ),
    );
    await wrapper.get('button[aria-label="Send"]').trigger('click');
    expect(wrapper.emitted('messageSend')?.at(-1)?.[0]).toMatchObject({
      setup: { model: 'gpt-4o' },
    });
    wrapper.unmount();
  });
});
