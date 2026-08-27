/* eslint-disable vue/one-component-per-file -- test hosts cover controlled state and template Boolean props. */

import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, shallowRef } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import Checkbox, { CheckboxGroup } from './index';

describe('Checkbox', () => {
  it('非受控点击更新 DOM/ARIA，并发出完整 change 与 Vue update 事件', async () => {
    const wrapper = mount(Checkbox, { props: { value: 'semi' }, slots: { default: 'Semi' } });
    await wrapper.trigger('click');
    expect(wrapper.classes()).toContain('semi-checkbox-checked');
    expect(wrapper.get('input').attributes('aria-checked')).toBe('true');
    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({
      target: { checked: true, value: 'semi' },
    });
    expect(wrapper.emitted('update:checked')).toEqual([[true]]);
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
  });

  it('checked 受控优先于 modelValue，并等待父级回写', async () => {
    const wrapper = mount(Checkbox, { props: { checked: false, modelValue: true } });
    await wrapper.trigger('click');
    expect(wrapper.classes()).not.toContain('semi-checkbox-checked');
    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ target: { checked: true } });
    await wrapper.setProps({ checked: true });
    expect(wrapper.classes()).toContain('semi-checkbox-checked');
  });

  it('disabled、indeterminate、addon/extra ARIA 与 card/pureCard DOM 对齐', async () => {
    const onChange = vi.fn();
    const wrapper = mount(Checkbox, {
      props: {
        disabled: true,
        indeterminate: true,
        type: 'card',
        extra: '辅助信息',
        onChange,
      },
      slots: { default: '标题' },
    });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'semi-checkbox-disabled',
        'semi-checkbox-indeterminate',
        'semi-checkbox-cardType',
      ]),
    );
    expect(wrapper.get('input').attributes('aria-labelledby')).toBe(
      wrapper.get('.semi-checkbox-addon').attributes('id'),
    );
    expect(wrapper.get('input').attributes('aria-describedby')).toBe(
      wrapper.get('.semi-checkbox-extra').attributes('id'),
    );
    await wrapper.trigger('click');
    expect(onChange).not.toHaveBeenCalled();

    const pure = mount(Checkbox, { props: { type: 'pureCard' } });
    expect(pure.get('.semi-checkbox-inner').classes()).toContain(
      'semi-checkbox-inner-pureCardType',
    );
  });

  it('Enter、focus-visible 与公开 focus/blur 落在原生 input', async () => {
    const wrapper = mount(Checkbox, { attachTo: document.body });
    const input = wrapper.get('input');
    vi.spyOn(input.element, 'matches').mockReturnValue(true);
    await input.trigger('focus');
    expect(wrapper.get('.semi-checkbox-inner-display').classes()).toContain('semi-checkbox-focus');
    await wrapper.trigger('keypress', { key: 'Enter', keyCode: 13 });
    expect(wrapper.classes()).toContain('semi-checkbox-checked');
    (wrapper.vm as unknown as { focus(): void; blur(): void }).focus();
    expect(document.activeElement).toBe(input.element);
    (wrapper.vm as unknown as { focus(): void; blur(): void }).blur();
    expect(document.activeElement).not.toBe(input.element);
    wrapper.unmount();
  });
});

describe('CheckboxGroup', () => {
  it('options 非受控值、item/group 顺序、name、方向与 list 语义对齐', async () => {
    const order: string[] = [];
    const wrapper = mount(CheckboxGroup, {
      props: {
        defaultValue: ['a'],
        direction: 'horizontal',
        name: 'choices',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', onChange: () => order.push('item') },
        ],
        onChange: () => order.push('group'),
      },
    });
    expect(wrapper.attributes('role')).toBe('list');
    expect(wrapper.classes()).toContain('semi-checkboxGroup-horizontal');
    expect(wrapper.findAll('[role="listitem"]')).toHaveLength(2);
    expect(wrapper.findAll('input').every((item) => item.attributes('name') === 'choices')).toBe(
      true,
    );
    await wrapper.findAll('.semi-checkbox')[1]!.trigger('click');
    expect(order).toEqual(['item', 'group']);
    expect(wrapper.emitted('change')?.[0]).toEqual([['a', 'b']]);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']]);
  });

  it('受控 value/modelValue 不提前漂移，父级回写后同步', async () => {
    const value = shallowRef<unknown[]>(['a']);
    const Host = defineComponent({
      setup: () => () =>
        h(
          CheckboxGroup,
          {
            modelValue: value.value,
            'onUpdate:modelValue': (next: unknown[]) => (value.value = next),
          },
          () => [h(Checkbox, { value: 'a' }, () => 'A'), h(Checkbox, { value: 'b' }, () => 'B')],
        ),
    });
    const wrapper = mount(Host);
    await wrapper.findAll('.semi-checkbox')[1]!.trigger('click');
    await nextTick();
    expect(value.value).toEqual(['a', 'b']);
    expect(wrapper.findAll('.semi-checkbox')[1]!.classes()).toContain('semi-checkbox-checked');
  });

  it('只让显式 value 子项入组，并保持 0/false/空字符串值', async () => {
    const wrapper = mount(CheckboxGroup, {
      slots: {
        default: () => [
          h(Checkbox, null, () => '独立'),
          h(Checkbox, { value: 0 }, () => '零'),
          h(Checkbox, { value: false }, () => '假'),
          h(Checkbox, { value: '' }, () => '空'),
        ],
      },
    });
    await wrapper.findAll('.semi-checkbox')[0]!.trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
    await wrapper.findAll('.semi-checkbox')[1]!.trigger('click');
    await wrapper.findAll('.semi-checkbox')[2]!.trigger('click');
    await wrapper.findAll('.semi-checkbox')[3]!.trigger('click');
    expect(wrapper.emitted('change')?.map((call) => call[0])).toEqual([
      [0],
      [0, false],
      [0, false, ''],
    ]);
  });

  it('真实模板裸 disabled 与 render function true/false 都保留最终 DOM/事件语义', async () => {
    const TemplateHost = defineComponent({
      components: { Checkbox, CheckboxGroup },
      template: `<CheckboxGroup><Checkbox value="a" disabled>A</Checkbox><Checkbox value="b" :disabled="false">B</Checkbox></CheckboxGroup>`,
    });
    const template = mount(TemplateHost);
    expect(template.findAll('input')[0]!.attributes('disabled')).toBeDefined();
    expect(template.findAll('input')[1]!.attributes('disabled')).toBeUndefined();

    const render = mount(CheckboxGroup, {
      slots: {
        default: () => [
          h(Checkbox, { value: 'a', disabled: true }, () => 'A'),
          h(Checkbox, { value: 'b', disabled: false }, () => 'B'),
        ],
      },
    });
    expect(render.findAll('input')[0]!.attributes('disabled')).toBeDefined();
    expect(render.findAll('input')[1]!.attributes('disabled')).toBeUndefined();
  });
});
