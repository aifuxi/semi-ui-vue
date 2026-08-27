import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { semiGlobal } from '../config-provider';
import AutoComplete from './AutoComplete.vue';
import type { AutoCompleteExposed } from './types';

afterEach(() => {
  document.body.innerHTML = '';
  delete semiGlobal.config.overrideDefaultProps;
});

describe('AutoComplete', () => {
  it('输入与选择按固定顺序更新非受控值', async () => {
    const wrapper = mount(AutoComplete, {
      attachTo: document.body,
      props: { data: ['semi', 'design'], motion: false },
    });
    await wrapper.get('input').setValue('se');
    await nextTick();
    expect(wrapper.emitted('search')?.[0]).toEqual(['se']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['se']);
    expect(document.body.querySelector('[role="listbox"]')).not.toBeNull();
    document.body.querySelector<HTMLElement>('[role="option"]')?.click();
    await nextTick();
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('semi');
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['semi']);
    expect(wrapper.get('input').element.value).toBe('semi');
  });

  it('受控选择只通知，显示值等待调用方回写', async () => {
    const wrapper = mount(AutoComplete, {
      attachTo: document.body,
      props: { data: ['semi', 'design'], modelValue: 'semi', defaultOpen: true, motion: false },
    });
    await nextTick();
    document.body.querySelectorAll<HTMLElement>('[role="option"]')[1]?.click();
    await nextTick();
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['design']);
    expect(wrapper.get('input').element.value).toBe('semi');
  });

  it('键盘循环跳过 disabled，Enter 选择，Escape 关闭', async () => {
    const wrapper = mount(AutoComplete, {
      attachTo: document.body,
      props: {
        data: [{ value: 'disabled', disabled: true }, { value: 'enabled' }],
        defaultActiveFirstOption: true,
        motion: false,
      },
    });
    const input = wrapper.get('input');
    await input.trigger('focus');
    await input.trigger('keydown', { keyCode: 40 });
    await input.trigger('keydown', { keyCode: 40 });
    await nextTick();
    expect(document.body.querySelector('.semi-autocomplete-option-focused')?.textContent).toContain(
      'enabled',
    );
    const activeDescendant = wrapper.get('[role="combobox"]').attributes('aria-activedescendant');
    expect(activeDescendant).toBeTruthy();
    expect(document.getElementById(activeDescendant ?? '')?.textContent).toContain('enabled');
    await input.trigger('keydown', { keyCode: 13 });
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('enabled');
    await input.trigger('keydown', { keyCode: 40 });
    await input.trigger('keydown', { keyCode: 27 });
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('false');
  });

  it('对象回调与候选 slot 保留公开 option DOM', async () => {
    const item = { value: 'semi', label: 'Semi Design', team: 'UI' };
    const wrapper = mount(AutoComplete, {
      attachTo: document.body,
      props: { data: [item], defaultOpen: true, motion: false, onSelectWithObject: true },
      slots: { option: ({ option }) => `${option.team}:${option.label}` },
    });
    await nextTick();
    const option = document.body.querySelector<HTMLElement>('[role="option"]');
    expect(option?.textContent).toBe('UI:Semi Design');
    option?.click();
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject(item);
  });

  it('清除、loading、empty、尺寸、校验和 disabled 走最终 DOM', async () => {
    const onClear = vi.fn();
    const wrapper = mount(AutoComplete, {
      attachTo: document.body,
      props: {
        defaultValue: 'semi',
        showClear: true,
        size: 'large',
        validateStatus: 'warning',
        onClear,
      },
    });
    expect(wrapper.get('.semi-input-wrapper').classes()).toEqual(
      expect.arrayContaining(['semi-input-wrapper-large', 'semi-input-wrapper-warning']),
    );
    await wrapper.get('input').trigger('focus');
    await wrapper.get('.semi-input-clearbtn').trigger('mousedown');
    expect(onClear).toHaveBeenCalledOnce();
    expect(wrapper.get('input').element.value).toBe('');
    await wrapper.setProps({ defaultOpen: true, loading: true, motion: false });
    await nextTick();
    expect(document.body.querySelector('.semi-autocomplete-loading-wrapper')).not.toBeNull();
    await wrapper.setProps({ loading: false, disabled: true });
    expect(wrapper.get('input').attributes('disabled')).toBeDefined();
    await wrapper.setProps({ disabled: false, data: [], emptyContent: '暂无候选' });
    await nextTick();
    expect(document.body.querySelector('[role="listbox"]')?.textContent).toBe('暂无候选');
    expect(document.body.querySelector('[role="option"]')).toBeNull();
  });

  it('稳定自定义容器首次展示即为 Portal 父节点', async () => {
    const popupHost = document.createElement('div');
    document.body.append(popupHost);
    mount(AutoComplete, {
      attachTo: document.body,
      props: {
        data: ['semi'],
        defaultOpen: true,
        getPopupContainer: () => popupHost,
        motion: false,
      },
    });
    await nextTick();
    await nextTick();
    expect(popupHost.querySelector('.semi-portal-inner')).not.toBeNull();
  });

  it('默认 true Boolean 区分缺省、显式 false 与全局覆盖', async () => {
    const defaultValue = mount(AutoComplete, {
      attachTo: document.body,
      props: {
        data: ['semi'],
        defaultOpen: true,
        style: { width: '240px' },
        motion: false,
      },
    });
    await nextTick();
    expect(document.body.querySelector<HTMLElement>('[role="listbox"]')?.style.minWidth).toBe(
      '240px',
    );
    defaultValue.unmount();
    document.body.innerHTML = '';

    const explicitFalse = mount(AutoComplete, {
      attachTo: document.body,
      props: {
        data: ['semi'],
        defaultOpen: true,
        dropdownMatchSelectWidth: false,
        style: { width: '240px' },
        motion: false,
      },
    });
    await nextTick();
    expect(document.body.querySelector<HTMLElement>('[role="listbox"]')?.style.minWidth).toBe('');
    explicitFalse.unmount();
    document.body.innerHTML = '';

    semiGlobal.config.overrideDefaultProps = { AutoComplete: { dropdownMatchSelectWidth: false } };
    const inherited = mount(AutoComplete, {
      attachTo: document.body,
      props: { data: ['semi'], defaultOpen: true, motion: false },
    });
    await nextTick();
    expect(document.body.querySelector<HTMLElement>('[role="listbox"]')?.style.minWidth).toBe('');
    inherited.unmount();
    document.body.innerHTML = '';
    const explicit = mount(AutoComplete, {
      attachTo: document.body,
      props: {
        data: ['semi'],
        defaultOpen: true,
        dropdownMatchSelectWidth: true,
        style: { width: '240px' },
        motion: false,
      },
    });
    await nextTick();
    expect(document.body.querySelector<HTMLElement>('[role="listbox"]')?.style.minWidth).toBe(
      '240px',
    );
    explicit.unmount();
  });

  it('data 更新、暴露方法和卸载清理作用于最终状态', async () => {
    const wrapper = mount(AutoComplete, {
      attachTo: document.body,
      props: { data: ['semi'], motion: false },
    });
    const exposed = wrapper.vm as unknown as AutoCompleteExposed;
    exposed.open();
    await nextTick();
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('true');
    await wrapper.setProps({ data: ['vue'] });
    await nextTick();
    expect(document.body.querySelector('[role="option"]')?.textContent).toContain('vue');
    exposed.search('vu');
    expect(wrapper.emitted('search')?.at(-1)).toEqual(['vu']);
    exposed.close();
    await nextTick();
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('false');
    wrapper.unmount();
    await nextTick();
    expect(document.body.querySelector('.semi-portal-inner')).toBeNull();
  });
});
