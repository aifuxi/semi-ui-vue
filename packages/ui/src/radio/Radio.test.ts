/* eslint-disable vue/one-component-per-file -- test hosts cover template and render Boolean inputs. */

import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, shallowRef } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import Radio, { RadioGroup, type RadioValue } from './index';

function setNativeChecked(
  wrapper: ReturnType<typeof mount>,
  index: number,
  checked: boolean,
): void {
  const input = wrapper.findAll('input')[index]!.element;
  input.checked = checked;
}

describe('Radio', () => {
  it('非受控 change 更新 DOM，并发出完整事件与 Vue update', async () => {
    const wrapper = mount(Radio, { props: { value: 'semi' }, slots: { default: 'Semi' } });
    setNativeChecked(wrapper, 0, true);
    await wrapper.get('input').trigger('change');
    expect(wrapper.classes()).toContain('semi-radio-checked');
    expect(wrapper.get('.semi-radio-inner').classes()).toContain('semi-radio-inner-checked');
    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({
      target: { checked: true, value: 'semi' },
    });
    expect(wrapper.emitted('update:checked')).toEqual([[true]]);
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
  });

  it('区分 checked 缺省、显式 false/true/undefined 和 modelValue', async () => {
    const missing = mount(Radio, { props: { defaultChecked: true } });
    const explicitFalse = mount(Radio, { props: { checked: false, defaultChecked: true } });
    const explicitTrue = mount(Radio, { props: { checked: true } });
    const explicitUndefined = mount(Radio, {
      props: { checked: undefined, defaultChecked: true },
    });
    const model = mount(Radio, { props: { modelValue: true } });
    expect(missing.get('input').element.checked).toBe(true);
    expect(explicitFalse.get('input').element.checked).toBe(false);
    expect(explicitTrue.get('input').element.checked).toBe(true);
    expect(explicitUndefined.get('input').element.checked).toBe(true);
    expect(model.get('input').element.checked).toBe(true);

    setNativeChecked(explicitFalse, 0, true);
    await explicitFalse.get('input').trigger('change');
    await nextTick();
    expect(explicitFalse.get('input').element.checked).toBe(false);
    expect(explicitFalse.emitted('change')?.[0]?.[0]).toMatchObject({ target: { checked: true } });
  });

  it('advanced 允许取消；button/card/pureCard、hover 与三类内容 DOM 对齐', async () => {
    const advanced = mount(Radio, {
      props: { mode: 'advanced', defaultChecked: true, extra: '辅助', type: 'card' },
      slots: { default: '标题' },
    });
    expect(advanced.get('input').attributes('type')).toBe('checkbox');
    expect(advanced.classes()).toEqual(
      expect.arrayContaining(['semi-radio-cardRadioGroup', 'semi-radio-cardRadioGroup_checked']),
    );
    expect(advanced.get('.semi-radio-addon').attributes('x-semi-prop')).toBe('children');
    expect(advanced.get('.semi-radio-extra').attributes('x-semi-prop')).toBe('extra');
    expect(advanced.get('input').attributes('aria-labelledby')).toBe(
      advanced.get('.semi-radio-addon').attributes('id'),
    );
    expect(advanced.get('input').attributes('aria-describedby')).toBe(
      advanced.get('.semi-radio-extra').attributes('id'),
    );
    setNativeChecked(advanced, 0, false);
    await advanced.get('input').trigger('change');
    expect(advanced.classes()).not.toContain('semi-radio-checked');

    const button = mount(Radio, { props: { type: 'button' }, slots: { default: '按钮' } });
    await button.trigger('mouseenter');
    expect(button.classes()).toContain('semi-radio-buttonRadioComponent');
    expect(button.get('.semi-radio-addon-buttonRadio').classes()).toContain(
      'semi-radio-addon-buttonRadio-hover',
    );
    expect(button.find('.semi-radio-extra').exists()).toBe(false);

    const pure = mount(Radio, { props: { type: 'pureCard' }, slots: { default: '纯卡片' } });
    expect(pure.get('.semi-radio-inner').classes()).toContain('semi-radio-inner-pureCardRadio');
  });

  it('disabled、focus-visible、preventScroll focus/blur 与 mouse emits 落在公开 DOM', async () => {
    const onMouseenter = vi.fn();
    const onMouseleave = vi.fn();
    const wrapper = mount(Radio, {
      attachTo: document.body,
      props: { disabled: true, preventScroll: true, onMouseenter, onMouseleave },
      slots: { default: '禁用' },
    });
    await wrapper.trigger('mouseenter');
    await wrapper.trigger('mouseleave');
    expect(onMouseenter).toHaveBeenCalledOnce();
    expect(onMouseleave).toHaveBeenCalledOnce();
    expect(wrapper.classes()).toContain('semi-radio-disabled');

    const enabled = mount(Radio, { attachTo: document.body });
    const input = enabled.get('input');
    vi.spyOn(input.element, 'matches').mockReturnValue(true);
    await input.trigger('focus');
    expect(enabled.get('.semi-radio-inner-display').classes()).toContain('semi-radio-focus');
    const exposed = enabled.vm as unknown as { focus(): void; blur(): void };
    exposed.focus();
    expect(document.activeElement).toBe(input.element);
    exposed.blur();
    expect(document.activeElement).not.toBe(input.element);
    wrapper.unmount();
    enabled.unmount();
  });
});

describe('RadioGroup', () => {
  it('options 非受控状态、组先于单项的事件顺序、name/ARIA/方向对齐', async () => {
    const order: string[] = [];
    const wrapper = mount(RadioGroup, {
      props: {
        defaultValue: 'a',
        name: 'choices',
        direction: 'vertical',
        ariaLabel: '选项组',
        ariaRequired: true,
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', extra: '说明' },
        ],
        onChange: () => order.push('group'),
      },
    });
    const second = wrapper.findAll('input')[1]!;
    setNativeChecked(wrapper, 1, true);
    await second.trigger('change');
    expect(order).toEqual(['group']);
    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ target: { value: 'b' } });
    expect(wrapper.emitted('update:modelValue')).toEqual([['b']]);
    expect(wrapper.classes()).toContain('semi-radioGroup-vertical-default');
    expect(wrapper.attributes('aria-label')).toBe('选项组');
    expect(wrapper.attributes('aria-required')).toBe('true');
    expect(wrapper.findAll('input').every((item) => item.attributes('name') === 'choices')).toBe(
      true,
    );
    expect(wrapper.findAll('.semi-radio')[1]!.classes()).toContain('semi-radio-checked');
  });

  it('slot 单项 change 在 group 后触发，普通模式相同值不重复通知', async () => {
    const order: string[] = [];
    const wrapper = mount(RadioGroup, {
      props: { defaultValue: 'a', onChange: () => order.push('group') },
      slots: {
        default: () => [
          h(Radio, { value: 'a', onChange: () => order.push('item') }, () => 'A'),
          h(Radio, { value: 'b', onChange: () => order.push('item') }, () => 'B'),
        ],
      },
    });
    setNativeChecked(wrapper, 0, true);
    await wrapper.findAll('input')[0]!.trigger('change');
    expect(order).toEqual(['item']);
    order.length = 0;
    setNativeChecked(wrapper, 1, true);
    await wrapper.findAll('input')[1]!.trigger('change');
    expect(order).toEqual(['group', 'item']);
  });

  it('受控 value/modelValue 等待回写，并保持 0/false/undefined 与 NaN', async () => {
    const value = shallowRef<RadioValue | undefined>(false);
    const Host = defineComponent({
      setup: () => () =>
        h(
          RadioGroup,
          {
            modelValue: value.value,
            'onUpdate:modelValue': (next: RadioValue | undefined) => (value.value = next),
          },
          () => [h(Radio, { value: false }, () => 'False'), h(Radio, { value: 0 }, () => 'Zero')],
        ),
    });
    const wrapper = mount(Host);
    expect(wrapper.findAll('input')[0]!.element.checked).toBe(true);
    setNativeChecked(wrapper, 1, true);
    await wrapper.findAll('input')[1]!.trigger('change');
    await nextTick();
    expect(value.value).toBe(0);
    expect(wrapper.findAll('input')[1]!.element.checked).toBe(true);

    const undefinedValue = mount(RadioGroup, {
      props: { value: undefined, defaultValue: 'fallback' },
      slots: { default: () => h(Radio, { value: 'fallback' }, () => 'Fallback') },
    });
    expect(undefinedValue.get('input').element.checked).toBe(false);
    const nan = mount(RadioGroup, { props: { value: Number.NaN } });
    await nan.setProps({ value: Number.NaN });
    expect(nan.emitted('change')).toBeUndefined();
  });

  it('advanced 取消选中并覆盖 button/card/pureCard 与尺寸 class', async () => {
    const advanced = mount(RadioGroup, {
      props: { mode: 'advanced', defaultValue: 'a' },
      slots: { default: () => h(Radio, { value: 'a' }, () => 'A') },
    });
    setNativeChecked(advanced, 0, false);
    await advanced.get('input').trigger('change');
    expect(advanced.emitted('change')?.[0]?.[0]).toMatchObject({
      target: { checked: false, value: undefined },
    });
    expect(advanced.emitted('update:modelValue')).toEqual([[undefined]]);

    const button = mount(RadioGroup, {
      props: { type: 'button', buttonSize: 'large', options: ['A', 'B'] },
    });
    expect(button.classes()).toContain('semi-radioGroup-buttonRadio');
    expect(button.findAll('.semi-radio')[0]!.classes()).toContain(
      'semi-radio-buttonRadioGroup-large',
    );
    const card = mount(RadioGroup, {
      props: { type: 'card', direction: 'vertical', options: ['A'] },
    });
    expect(card.classes()).toContain('semi-radioGroup-vertical-card');
    const pure = mount(RadioGroup, { props: { type: 'pureCard', options: ['A'] } });
    expect(pure.get('.semi-radio-inner').classes()).toContain('semi-radio-inner-pureCardRadio');
  });

  it('真实模板与 h() 的 disabled true/false 均保留最终 input 和事件语义', () => {
    const TemplateHost = defineComponent({
      components: { Radio, RadioGroup },
      template: `<RadioGroup><Radio value="a" disabled>A</Radio><Radio value="b" :disabled="false">B</Radio></RadioGroup>`,
    });
    const template = mount(TemplateHost);
    expect(template.findAll('input')[0]!.attributes('disabled')).toBeDefined();
    expect(template.findAll('input')[1]!.attributes('disabled')).toBeUndefined();

    const render = mount(RadioGroup, {
      slots: {
        default: () => [
          h(Radio, { value: 'a', disabled: true }, () => 'A'),
          h(Radio, { value: 'b', disabled: false }, () => 'B'),
        ],
      },
    });
    expect(render.findAll('input')[0]!.attributes('disabled')).toBeDefined();
    expect(render.findAll('input')[1]!.attributes('disabled')).toBeUndefined();
  });
});
