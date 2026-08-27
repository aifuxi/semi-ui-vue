import { mount } from '@vue/test-utils';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, defineComponent, h, nextTick, shallowRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Switch, { SWITCH_SIZES } from './index';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Switch', () => {
  it('保留固定 wrapper、knob、原生 checkbox、ARIA 与 data DOM 契约', () => {
    const wrapper = mount(Switch, {
      props: {
        ariaLabel: '通知开关',
        ariaDescribedby: 'switch-help',
        ariaErrormessage: 'switch-error',
        ariaInvalid: true,
        ariaLabelledby: 'switch-label',
        id: 'notification-switch',
      },
      attrs: { class: 'custom-switch', style: 'margin-left: 8px', 'data-source': 'unit' },
    });

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['semi-switch', 'custom-switch']));
    expect((wrapper.element as HTMLElement).style.marginLeft).toBe('8px');
    expect(wrapper.attributes('data-source')).toBe('unit');
    expect(wrapper.get('.semi-switch-knob').attributes('aria-hidden')).toBe('true');
    const input = wrapper.get('input');
    expect(input.attributes()).toMatchObject({
      type: 'checkbox',
      role: 'switch',
      id: 'notification-switch',
      'aria-label': '通知开关',
      'aria-describedby': 'switch-help',
      'aria-errormessage': 'switch-error',
      'aria-invalid': 'true',
      'aria-labelledby': 'switch-label',
      'aria-checked': 'false',
      'aria-disabled': 'false',
    });
  });

  it('非受控模式先更新公开状态，再按 checked、modelValue 的 Vue 契约发出事件', async () => {
    const wrapper = mount(Switch, { props: { defaultChecked: false } });
    const input = wrapper.get('input');
    (input.element as HTMLInputElement).checked = true;
    await input.trigger('change');

    expect(wrapper.classes()).toContain('semi-switch-checked');
    expect(input.attributes('aria-checked')).toBe('true');
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true);
    expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(Event);
    expect(wrapper.emitted('update:checked')).toEqual([[true]]);
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
  });

  it('checked 受控模式不自行提交状态，并在父级更新后同步', async () => {
    const wrapper = mount(Switch, { props: { checked: false } });
    const input = wrapper.get('input');
    (input.element as HTMLInputElement).checked = true;
    await input.trigger('change');
    await nextTick();

    expect(wrapper.classes()).not.toContain('semi-switch-checked');
    expect((input.element as HTMLInputElement).checked).toBe(false);
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true);

    await wrapper.setProps({ checked: true });
    expect(wrapper.classes()).toContain('semi-switch-checked');
    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it('支持原生 v-model，并保持 checked 的兼容优先级', async () => {
    const value = shallowRef(false);
    const Host = defineComponent({
      setup() {
        return () =>
          h(Switch, {
            modelValue: value.value,
            'onUpdate:modelValue': (next: boolean) => (value.value = next),
          });
      },
    });
    const wrapper = mount(Host);
    const input = wrapper.get('input');
    (input.element as HTMLInputElement).checked = true;
    await input.trigger('change');
    expect(value.value).toBe(true);
    expect(wrapper.get('.semi-switch').classes()).toContain('semi-switch-checked');

    const checkedWins = mount(Switch, { props: { checked: false, modelValue: true } });
    expect(checkedWins.classes()).not.toContain('semi-switch-checked');
  });

  it('响应 disabled/loading，loading 使用固定 Spin DOM 且阻止输入', async () => {
    const wrapper = mount(Switch, { props: { disabled: true, loading: true, size: 'large' } });
    await nextTick();
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['semi-switch-disabled', 'semi-switch-loading', 'semi-switch-large']),
    );
    expect(wrapper.get('input').attributes('disabled')).toBeDefined();
    expect(wrapper.get('input').attributes('aria-disabled')).toBe('true');
    expect(wrapper.find('.semi-switch-knob').exists()).toBe(false);
    expect(wrapper.get('.semi-switch-loading-spin').classes()).toContain('semi-spin-large');
    expect(wrapper.get('[data-icon="spin"]').element.tagName).toBe('svg');

    await wrapper.setProps({ disabled: false, loading: false });
    expect(wrapper.classes()).not.toContain('semi-switch-disabled');
    expect(wrapper.get('input').attributes('disabled')).toBeUndefined();
    expect(wrapper.find('.semi-switch-knob').exists()).toBe(true);
  });

  it('按尺寸显示文本，并允许 VNode prop 与 Vue 命名 slot', () => {
    expect(SWITCH_SIZES).toEqual(['large', 'default', 'small']);
    const checked = mount(Switch, {
      props: { checked: true, checkedText: h('strong', { class: 'checked-vnode' }, 'ON') },
    });
    expect(checked.get('.semi-switch-checked-text').attributes('x-semi-prop')).toBe('checkedText');
    expect(checked.get('.checked-vnode').text()).toBe('ON');

    const unchecked = mount(Switch, {
      props: { uncheckedText: 'prop' },
      slots: { uncheckedText: () => h('em', { class: 'unchecked-slot' }, 'OFF') },
    });
    expect(unchecked.get('.unchecked-slot').text()).toBe('OFF');

    const small = mount(Switch, {
      props: { size: 'small', checked: true, checkedText: 'ON', uncheckedText: 'OFF' },
    });
    expect(small.find('.semi-switch-checked-text').exists()).toBe(false);
    expect(small.find('.semi-switch-unchecked-text').exists()).toBe(false);
  });

  it('仅键盘 focus-visible 增加 focus class，blur 后清理', async () => {
    const wrapper = mount(Switch);
    const input = wrapper.get('input');
    vi.spyOn(input.element, 'matches').mockReturnValue(true);
    await input.trigger('focus');
    expect(wrapper.classes()).toContain('semi-switch-focus');
    await input.trigger('blur');
    expect(wrapper.classes()).not.toContain('semi-switch-focus');
  });

  it('鼠标进入/离开监听绑定 wrapper', async () => {
    const enter = vi.fn();
    const leave = vi.fn();
    const wrapper = mount(Switch, {
      attrs: { onMouseenter: enter, onMouseleave: leave },
    });
    expect(wrapper.classes()).toContain('semi-switch');
    expect(wrapper.get('input').classes()).toContain('semi-switch-native-control');
    await wrapper.trigger('mouseenter');
    await wrapper.trigger('mouseleave');
    expect(enter).toHaveBeenCalledTimes(1);
    expect(leave).toHaveBeenCalledTimes(1);
  });

  it('SSR-safe 渲染受控、loading、文本和 ARIA，不访问浏览器全局', async () => {
    const app = createSSRApp({
      render: () =>
        h(Switch, {
          checked: true,
          loading: true,
          size: 'large',
          checkedText: '开',
          ariaLabel: 'SSR switch',
        }),
    });
    const html = await renderToString(app);
    expect(html).toContain('semi-switch-checked');
    expect(html).toContain('semi-switch-loading');
    expect(html).toContain('semi-spin-large');
    expect(html).toContain('aria-label="SSR switch"');
    expect(html).toContain('aria-checked="true"');
    expect(html).toContain('开');
  });
});
